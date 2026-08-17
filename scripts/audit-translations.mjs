import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { parse } from '@babel/parser';

const rootDir = process.cwd();
const srcDir = path.join(rootDir, 'src');
const enPath = path.join(srcDir, 'locales', 'en', 'translation.json');
const viPath = path.join(srcDir, 'locales', 'vi', 'translation.json');
const defaultReportPath = path.join(rootDir, 'translation-audit.md');
const sourceExtensions = new Set(['.js', '.jsx', '.ts', '.tsx']);
const placeholderPattern = /^(todo|tbd|n\/a|na|none|null|undefined|-|--|\.\.\.|translate|translation pending|missing)$/i;
const visibleAttributeNames = new Set([
  'aria-label',
  'label',
  'placeholder',
  'title',
  'alt',
  'value',
]);
const safeTextPattern =
  /^([A-Z0-9_\-/.:#%+()[\]\s]+|[.#/%+\-–—·|:()[\]\s]+|\d+(\.\d+)?\s*(px|rem|em|vh|vw|%|km|m|min|h)?|true|false|null|undefined)$/i;
const technicalStringPattern =
  /^(https?:\/\/|\/|\.\/|\.\.\/|@\/|data:|linear-gradient|radial-gradient|rgb|rgba|hsl|hsla|var\(|calc\(|repeat\(|minmax\(|translate|scale|rotate|Bearer\s|GET|POST|PUT|PATCH|DELETE|ASC|DESC|EPSG|FeatureCollection|Point|LineString|Polygon)/i;
const codeLikeTextPattern =
  /(;|=>|===|!==|&&|\|\||\?\s*\(|:\s*\(|\breturn\b|\bconst\b|\blet\b|\bfunction\b|\bpath\b|\blocation\b|\bstartsWith\b|\blength\b|\bslice\b|\bmap\b|\bfilter\b)/;
const technicalContextPattern =
  /\b(className|style|background|backgroundImage|src|href|path|to|url|id|key|type|variant|size|method|queryKey|endPoint|endpoint|baseURL|headers|params|data|icon|bg|color|coords|coordinates|slug|token|access_token|appid|apiKey|sortBy|sortOrder|status|enabled|name|code)\s*[:=]\s*$/;
const visibleFunctionPattern =
  /\b(toast\.(?:success|error|info|warning|warn)|alert|confirm|setError|throw new Error|Error)\s*\(\s*$/;
const translationKeyPattern = /^[A-Za-z0-9_-]+(?:\.[A-Za-z0-9_-]+)*$/;
const resolvableKeyPropertyPattern = /^[A-Za-z_$][\w$]*Key$/;
const declaredTranslationKeyPropertyNames = new Set([
  'key',
  'name',
  'label',
  'title',
  'description',
  'placeholder',
  'tooltip',
  'ariaLabel',
]);
const genericContextTokens = new Set([
  'data',
  'item',
  'meta',
  'config',
  'cfg',
  'cls',
  'obj',
  'value',
  'values',
  'label',
  'title',
  'description',
  'text',
  'key',
  'keys',
  'entry',
  'entries',
  'result',
  'results',
  'list',
  'map',
  'card',
  'role',
  'info',
  'detail',
  'details',
]);

const args = process.argv.slice(2);
const writeIndex = args.indexOf('--write');
const shouldWrite = writeIndex !== -1;
const reportPath =
  shouldWrite && args[writeIndex + 1] && !args[writeIndex + 1].startsWith('--')
    ? path.resolve(rootDir, args[writeIndex + 1])
    : defaultReportPath;

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, ''));
}

function isTranslationKeyLiteral(value) {
  return (
    typeof value === 'string' &&
    translationKeyPattern.test(value) &&
    value.includes('.') &&
    /[A-Za-z_]/.test(value)
  );
}

function isResolvableTranslationPropertyName(propertyName) {
  return (
    resolvableKeyPropertyPattern.test(propertyName) ||
    declaredTranslationKeyPropertyNames.has(propertyName)
  );
}

function hasInlineDefaultValue(content, index) {
  const tail = content.slice(index, index + 250);
  return /,\s*{[\s\S]*?\bdefaultValue\s*:/.test(tail);
}

function resolveTemplateTranslationKeys(literal, localeKeys) {
  if (!literal || literal.quote !== '`' || !literal.raw.includes('${')) return [];

  const prefix = unescapeStringLiteral(literal.raw.split('${')[0] || '');
  if (!isTranslationKeyLiteral(`${prefix}x`)) return [];

  return localeKeys.filter((key) => key.startsWith(prefix));
}

function collectDuplicateJsonKeys(filePath, locale) {
  const content = fs.readFileSync(filePath, 'utf8');
  const prefix = 'const __translation = ';
  const lineStarts = makeLineStarts(content);
  let ast;

  try {
    ast = parse(`${prefix}${content};`, { sourceType: 'module' });
  } catch {
    return [];
  }

  const rootObject = ast.program.body[0]?.declarations?.[0]?.init;
  if (rootObject?.type !== 'ObjectExpression') return [];

  const duplicates = [];

  function originalLine(start) {
    return lineForIndex(lineStarts, Math.max(0, start - prefix.length));
  }

  function walkObject(node, keyPath = []) {
    if (!node || node.type !== 'ObjectExpression') return;

    const seen = new Map();
    for (const property of node.properties || []) {
      if (property.type !== 'ObjectProperty' && property.type !== 'Property') continue;
      if (property.computed) continue;

      const propertyName = getPropertyName(property.key);
      if (!propertyName) continue;

      const line = originalLine(property.key.start ?? property.start ?? 0);
      if (seen.has(propertyName)) {
        duplicates.push({
          locale,
          file: path.relative(rootDir, filePath).replace(/\\/g, '/'),
          key: [...keyPath, propertyName].join('.'),
          firstLine: seen.get(propertyName),
          line,
        });
      } else {
        seen.set(propertyName, line);
      }

      if (property.value?.type === 'ObjectExpression') {
        walkObject(property.value, [...keyPath, propertyName]);
      }
    }
  }

  walkObject(rootObject);
  return duplicates;
}

function valueType(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

function flattenTranslations(value, prefix = '', output = {}) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    for (const [key, childValue] of Object.entries(value)) {
      flattenTranslations(childValue, prefix ? `${prefix}.${key}` : key, output);
    }
    return output;
  }

  output[prefix] = {
    type: valueType(value),
    value,
  };
  return output;
}

function collectSourceFiles(dir, output = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist') continue;

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectSourceFiles(fullPath, output);
      continue;
    }

    if (sourceExtensions.has(path.extname(entry.name))) {
      output.push(fullPath);
    }
  }

  return output;
}

function makeLineStarts(content) {
  const starts = [0];
  for (let index = 0; index < content.length; index += 1) {
    if (content.charCodeAt(index) === 10) starts.push(index + 1);
  }
  return starts;
}

function lineForIndex(lineStarts, index) {
  let low = 0;
  let high = lineStarts.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (lineStarts[mid] <= index) low = mid + 1;
    else high = mid - 1;
  }

  return high + 1;
}

function unescapeStringLiteral(value) {
  return value
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\`/g, '`')
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, '\\');
}

function readStringLiteralAt(content, index) {
  const quote = content[index];
  if (!quote || !['"', "'", '`'].includes(quote)) return null;

  let cursor = index + 1;
  let raw = '';
  let escaped = false;

  while (cursor < content.length) {
    const char = content[cursor];

    if (escaped) {
      raw += `\\${char}`;
      escaped = false;
      cursor += 1;
      continue;
    }

    if (char === '\\') {
      escaped = true;
      cursor += 1;
      continue;
    }

    if (char === quote) {
      return {
        quote,
        raw,
        value: unescapeStringLiteral(raw),
        start: index,
        end: cursor + 1,
      };
    }

    raw += char;
    cursor += 1;
  }

  return null;
}

function readIdentifierAt(content, index) {
  const char = content[index];
  if (!char || !/[A-Za-z_$]/.test(char)) return null;

  let cursor = index + 1;
  while (cursor < content.length && /[\w$]/.test(content[cursor])) cursor += 1;

  return {
    name: content.slice(index, cursor),
    start: index,
    end: cursor,
  };
}

function skipWhitespace(content, index) {
  let cursor = index;
  while (cursor < content.length && /\s/.test(content[cursor])) cursor += 1;
  return cursor;
}

function readPropertyAccessAt(content, index) {
  let cursor = skipWhitespace(content, index);
  const firstIdentifier = readIdentifierAt(content, cursor);
  if (!firstIdentifier) return null;

  const segments = [firstIdentifier.name];
  cursor = firstIdentifier.end;

  while (cursor < content.length) {
    cursor = skipWhitespace(content, cursor);

    if (content.slice(cursor, cursor + 2) === '?.') cursor += 2;
    else if (content[cursor] === '.') cursor += 1;
    else break;

    cursor = skipWhitespace(content, cursor);
    const nextIdentifier = readIdentifierAt(content, cursor);
    if (!nextIdentifier) return null;

    segments.push(nextIdentifier.name);
    cursor = nextIdentifier.end;
  }

  if (segments.length < 2) return null;

  return {
    segments,
    start: index,
    end: cursor,
  };
}

function extractFallback(content, index) {
  let cursor = skipWhitespace(content, index);
  if (content[cursor] !== ',') return null;
  cursor = skipWhitespace(content, cursor + 1);

  const literal = readStringLiteralAt(content, cursor);
  if (!literal || (literal.quote === '`' && literal.raw.includes('${'))) return null;

  return literal.value;
}

function collectResolvableKeyProperties(content) {
  const ast = parseSourceAst(content);
  if (!ast) return new Map();

  const properties = new Map();

  function addEntry(propertyName, key, contextName) {
    if (!isResolvableTranslationPropertyName(propertyName)) return;
    if (!isTranslationKeyLiteral(key)) return;

    if (!properties.has(propertyName)) properties.set(propertyName, []);
    properties.get(propertyName).push({
      key,
      contextTokens: tokenizeContextName(contextName),
    });
  }

  function collectFromObjectExpression(node, contextName) {
    for (const property of node.properties || []) {
      if (property.type !== 'ObjectProperty' && property.type !== 'Property') continue;
      if (property.computed) continue;

      const propertyName = getPropertyName(property.key);
      const propertyValue = getStaticStringValue(property.value);
      if (!propertyName || !propertyValue) continue;

      addEntry(propertyName, propertyValue, contextName);
    }
  }

  function walk(node, contextName = null) {
    if (!node || typeof node !== 'object') return;

    if (node.type === 'VariableDeclarator' && node.id?.type === 'Identifier') {
      walk(node.init, node.id.name);
      return;
    }

    if (
      (node.type === 'FunctionDeclaration' ||
        node.type === 'FunctionExpression' ||
        node.type === 'ArrowFunctionExpression') &&
      node.body
    ) {
      const nextContextName = node.id?.name || contextName;
      walk(node.body, nextContextName);
      return;
    }

    if (node.type === 'ReturnStatement' && node.argument?.type === 'ObjectExpression') {
      collectFromObjectExpression(node.argument, contextName);
      walk(node.argument, contextName);
      return;
    }

    if (node.type === 'ObjectExpression') {
      collectFromObjectExpression(node, contextName);
    }

    for (const value of Object.values(node)) {
      if (!value) continue;
      if (Array.isArray(value)) {
        for (const item of value) walk(item, contextName);
      } else if (typeof value === 'object') {
        walk(value, contextName);
      }
    }
  }

  walk(ast.program);
  return properties;
}

function buildResolvableKeyPropertyMap(sourceDocuments) {
  const propertyMap = new Map();

  for (const document of sourceDocuments) {
    const localProperties = collectResolvableKeyProperties(document.content);
    for (const [propertyName, entries] of localProperties.entries()) {
      if (!propertyMap.has(propertyName)) propertyMap.set(propertyName, []);
      propertyMap.get(propertyName).push(...entries);
    }
  }

  return new Map(
    [...propertyMap.entries()].map(([propertyName, entries]) => [
      propertyName,
      dedupePropertyEntries(entries),
    ])
  );
}

function resolvePropertyAccessTranslationKeys(content, index, propertyKeyMap) {
  const propertyAccess = readPropertyAccessAt(content, index);
  if (!propertyAccess) return null;

  const baseIdentifier = propertyAccess.segments[0];
  const propertyName = propertyAccess.segments[propertyAccess.segments.length - 1];
  if (!isResolvableTranslationPropertyName(propertyName)) return null;

  const entries = propertyKeyMap.get(propertyName);
  if (!entries?.length) return null;

  const baseTokens = tokenizeContextName(baseIdentifier).filter((token) => !genericContextTokens.has(token));
  const matchingEntries = baseTokens.length
    ? entries.filter((entry) => entry.contextTokens.some((token) => baseTokens.includes(token)))
    : [];
  const resolvedEntries = matchingEntries.length ? matchingEntries : entries;
  const keys = [...new Set(resolvedEntries.map((entry) => entry.key))].sort((a, b) =>
    a.localeCompare(b)
  );
  if (!keys.length) return null;

  return {
    baseIdentifier,
    propertyName,
    keys,
    end: propertyAccess.end,
  };
}

function parseSourceAst(content) {
  try {
    return parse(content, {
      sourceType: 'module',
      plugins: ['jsx'],
    });
  } catch {
    return null;
  }
}

function getPropertyName(node) {
  if (!node) return null;
  if (node.type === 'Identifier') return node.name;
  if (node.type === 'JSXIdentifier') return node.name;
  if (node.type === 'StringLiteral' || node.type === 'Literal') return node.value;
  return null;
}

function getStaticStringValue(node) {
  if (!node) return null;
  if (node.type === 'StringLiteral' || node.type === 'Literal') {
    return typeof node.value === 'string' ? node.value : null;
  }
  if (
    node.type === 'TemplateLiteral' &&
    node.expressions?.length === 0 &&
    node.quasis?.length === 1
  ) {
    return node.quasis[0].value?.cooked ?? null;
  }
  return null;
}

function tokenizeContextName(value) {
  return String(value || '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
}

function dedupePropertyEntries(entries) {
  const seen = new Set();
  const output = [];

  for (const entry of entries) {
    const contextId = [...entry.contextTokens].sort().join(',');
    const id = `${entry.key}:${contextId}`;
    if (seen.has(id)) continue;
    seen.add(id);
    output.push(entry);
  }

  return output.sort((a, b) => a.key.localeCompare(b.key));
}

function extractStaticTranslationCalls(content, relPath, lineStarts) {
  const usages = [];
  const callRegex = /\b(?:i18n\.)?t\s*\(/g;
  let match;

  while ((match = callRegex.exec(content))) {
    const literalStart = skipWhitespace(content, callRegex.lastIndex);
    const literal = readStringLiteralAt(content, literalStart);
    if (!literal) continue;

    if (literal.quote === '`' && literal.raw.includes('${')) continue;

    usages.push({
      key: literal.value,
      source: 't()',
      file: relPath,
      line: lineForIndex(lineStarts, match.index),
      fallback: extractFallback(content, literal.end),
    });
  }

  return usages;
}

function extractStaticI18nKeys(content, relPath, lineStarts) {
  const usages = [];
  const literalAttrRegex = /\bi18nKey\s*=\s*(["'])(.*?)\1/g;
  const expressionAttrRegex = /\bi18nKey\s*=\s*{\s*/g;
  let match;

  while ((match = literalAttrRegex.exec(content))) {
    usages.push({
      key: unescapeStringLiteral(match[2]),
      source: 'i18nKey',
      file: relPath,
      line: lineForIndex(lineStarts, match.index),
      fallback: null,
    });
  }

  while ((match = expressionAttrRegex.exec(content))) {
    const literalStart = skipWhitespace(content, expressionAttrRegex.lastIndex);
    const literal = readStringLiteralAt(content, literalStart);
    if (!literal || (literal.quote === '`' && literal.raw.includes('${'))) continue;

    usages.push({
      key: literal.value,
      source: 'i18nKey',
      file: relPath,
      line: lineForIndex(lineStarts, match.index),
      fallback: null,
    });
  }

  return usages;
}

function extractTemplateTranslationCalls(content, relPath, lineStarts, localeKeys) {
  const usages = [];
  const callRegex = /\b(?:i18n\.)?t\s*\(/g;
  let match;

  while ((match = callRegex.exec(content))) {
    const literalStart = skipWhitespace(content, callRegex.lastIndex);
    const literal = readStringLiteralAt(content, literalStart);
    const keys = resolveTemplateTranslationKeys(literal, localeKeys);
    if (!keys.length) continue;

    for (const key of keys) {
      usages.push({
        key,
        source: 't().template',
        file: relPath,
        line: lineForIndex(lineStarts, match.index),
        fallback: null,
      });
    }
  }

  return usages;
}

function extractDeclaredTranslationKeyLiterals(content, relPath, lineStarts) {
  const ast = parseSourceAst(content);
  if (!ast) return [];

  const usages = [];
  const excludedPropertyNames = new Set([
    'queryKey',
    'mutationKey',
    'cacheKey',
    'storageKey',
    'invalidateKey',
  ]);

  function addUsage(key, start, source) {
    if (!isTranslationKeyLiteral(key)) return;
    usages.push({
      key,
      source,
      file: relPath,
      line: lineForIndex(lineStarts, start),
      fallback: null,
    });
  }

  function collectArrayElements(elements, start, source) {
    const keys = elements
      .map((element) => getStaticStringValue(element))
      .filter((value) => isTranslationKeyLiteral(value));

    if (!keys.length) return;

    for (const key of keys) addUsage(key, start, source);
  }

  function walk(node) {
    if (!node || typeof node !== 'object') return;

    if (node.type === 'JSXAttribute') {
      const attributeName = getPropertyName(node.name);
      const expression = node.value?.type === 'JSXExpressionContainer' ? node.value.expression : null;
      const staticValue = getStaticStringValue(node.value) || getStaticStringValue(expression);

      if (!excludedPropertyNames.has(attributeName)) {
        if (attributeName?.endsWith('Key') && staticValue) {
          addUsage(staticValue, node.value?.start ?? node.start, `jsx:${attributeName}`);
        }

        if (
          declaredTranslationKeyPropertyNames.has(attributeName) &&
          staticValue &&
          isTranslationKeyLiteral(staticValue)
        ) {
          addUsage(staticValue, node.value?.start ?? node.start, `jsx:${attributeName}`);
        }

        if (attributeName?.endsWith('Keys') && expression?.type === 'ArrayExpression') {
          collectArrayElements(
            expression.elements || [],
            expression.start ?? node.start,
            `jsx:${attributeName}`
          );
        }
      }
    }

    if (node.type === 'ObjectProperty' || node.type === 'Property') {
      const propertyName = getPropertyName(node.key);
      const staticValue = getStaticStringValue(node.value);
      if (excludedPropertyNames.has(propertyName)) {
        // Common non-i18n `...Key` fields should not be treated as translation declarations.
      } else {
        if (propertyName?.endsWith('Key') && staticValue) {
          addUsage(staticValue, node.value.start ?? node.start, `declared:${propertyName}`);
        }

        if (
          declaredTranslationKeyPropertyNames.has(propertyName) &&
          staticValue &&
          isTranslationKeyLiteral(staticValue)
        ) {
          addUsage(staticValue, node.value.start ?? node.start, `declared:${propertyName}`);
        }

        if (propertyName?.endsWith('Keys') && node.value?.type === 'ArrayExpression') {
          collectArrayElements(
            node.value.elements || [],
            node.value.start ?? node.start,
            `declared:${propertyName}`
          );
        }
      }
    }

    if (node.type === 'VariableDeclarator' && node.id?.type === 'Identifier') {
      const variableName = node.id.name;
      const staticValue = getStaticStringValue(node.init);

      if (variableName.endsWith('Key') && staticValue) {
        addUsage(staticValue, node.init.start ?? node.start, `declared:${variableName}`);
      }

      if (node.init?.type === 'ArrayExpression') {
        const shouldCollect =
          variableName.endsWith('Keys') ||
          (variableName === variableName.toUpperCase() &&
            (node.init.elements || []).some((element) => {
              const key = getStaticStringValue(element);
              return key && translationKeyPattern.test(key) && key.includes('.');
            }));

        if (shouldCollect) {
          collectArrayElements(
            node.init.elements || [],
            node.init.start ?? node.start,
            `declared:${variableName}`
          );
        }
      }
    }

    for (const value of Object.values(node)) {
      if (!value) continue;
      if (Array.isArray(value)) {
        for (const item of value) walk(item);
      } else if (typeof value === 'object') {
        walk(value);
      }
    }
  }

  walk(ast.program);
  return usages;
}

function extractResolvedTranslationCalls(content, relPath, lineStarts, propertyKeyMap) {
  const usages = [];
  const callRegex = /\b(?:i18n\.)?t\s*\(/g;
  let match;

  while ((match = callRegex.exec(content))) {
    const argStart = skipWhitespace(content, callRegex.lastIndex);
    const literal = readStringLiteralAt(content, argStart);
    if (literal && !(literal.quote === '`' && literal.raw.includes('${'))) continue;

    const resolved = resolvePropertyAccessTranslationKeys(content, argStart, propertyKeyMap);
    if (!resolved) continue;

    for (const key of resolved.keys) {
      usages.push({
        key,
        source: `t().${resolved.propertyName}`,
        file: relPath,
        line: lineForIndex(lineStarts, match.index),
        fallback: extractFallback(content, resolved.end),
      });
    }
  }

  return usages;
}

function extractResolvedI18nKeys(content, relPath, lineStarts, propertyKeyMap) {
  const usages = [];
  const attrRegex = /\bi18nKey\s*=\s*{\s*/g;
  let match;

  while ((match = attrRegex.exec(content))) {
    const argStart = skipWhitespace(content, attrRegex.lastIndex);
    const literal = readStringLiteralAt(content, argStart);
    if (literal && !(literal.quote === '`' && literal.raw.includes('${'))) continue;

    const resolved = resolvePropertyAccessTranslationKeys(content, argStart, propertyKeyMap);
    if (!resolved) continue;

    for (const key of resolved.keys) {
      usages.push({
        key,
        source: `i18nKey.${resolved.propertyName}`,
        file: relPath,
        line: lineForIndex(lineStarts, match.index),
        fallback: null,
      });
    }
  }

  return usages;
}

function isResolvableDynamicArgument(content, index, propertyKeyMap, localeKeys) {
  const literal = readStringLiteralAt(content, index);
  if (literal) {
    if (literal.quote !== '`' || !literal.raw.includes('${')) return true;
    return (
      resolveTemplateTranslationKeys(literal, localeKeys).length > 0 ||
      hasInlineDefaultValue(content, literal.end)
    );
  }

  const resolved = resolvePropertyAccessTranslationKeys(content, index, propertyKeyMap);
  if (resolved) return true;

  const identifier = readIdentifierAt(content, index);
  return Boolean(
    identifier &&
      (isResolvableTranslationPropertyName(identifier.name) || hasInlineDefaultValue(content, identifier.end))
  );
}

function extractDynamicUsages(content, relPath, lineStarts, propertyKeyMap, localeKeys) {
  const dynamic = [];
  const callRegex = /\b(?:i18n\.)?t\s*\(/g;
  const attrRegex = /\bi18nKey\s*=\s*{/g;
  let match;

  while ((match = callRegex.exec(content))) {
    const argStart = skipWhitespace(content, callRegex.lastIndex);
    if (!isResolvableDynamicArgument(content, argStart, propertyKeyMap, localeKeys)) {
      dynamic.push({
        source: 't()',
        file: relPath,
        line: lineForIndex(lineStarts, match.index),
      });
    }
  }

  while ((match = attrRegex.exec(content))) {
    const argStart = skipWhitespace(content, attrRegex.lastIndex);
    if (!isResolvableDynamicArgument(content, argStart, propertyKeyMap, localeKeys)) {
      dynamic.push({
        source: 'i18nKey',
        file: relPath,
        line: lineForIndex(lineStarts, match.index),
      });
    }
  }

  return dynamic;
}

function getLineText(content, lineStarts, line) {
  const start = lineStarts[line - 1] ?? 0;
  const end = lineStarts[line] ? lineStarts[line] - 1 : content.length;
  return content.slice(start, end);
}

function hasHumanLetters(text) {
  return /[\p{L}]/u.test(text);
}

function normalizeVisibleText(text) {
  return String(text || '').replace(/\s+/g, ' ').trim();
}

function isIgnorableVisibleText(text) {
  const normalized = normalizeVisibleText(text);
  if (!normalized) return true;
  if (/^[,.;:()[\]{}]/.test(normalized)) return true;
  if (codeLikeTextPattern.test(normalized)) return true;
  if (!hasHumanLetters(normalized)) return true;
  if (safeTextPattern.test(normalized)) return true;
  if (technicalStringPattern.test(normalized)) return true;
  return false;
}

function classifyHardcodedText(text) {
  const normalized = normalizeVisibleText(text);

  if (/^[A-Z0-9&+\-/\s.]+$/.test(normalized) && normalized.length <= 32) {
    return 'review';
  }

  if (/^[A-Z][A-Za-z0-9&+\-/\s.]+$/.test(normalized) && normalized.length <= 40) {
    return 'review';
  }

  return 'must_i18n';
}

function addHardcodedCandidate(output, candidate) {
  const text = normalizeVisibleText(candidate.text);
  if (isIgnorableVisibleText(text)) return;

  output.push({
    ...candidate,
    text,
    classification: candidate.classification || classifyHardcodedText(text),
  });
}

function extractJsxTextNodes(content, relPath, lineStarts) {
  const candidates = [];
  const jsxTextRegex = />([^<>{}]+)</g;
  let match;

  while ((match = jsxTextRegex.exec(content))) {
    if (!isProbablyJsxTagClose(content, match.index)) continue;

    const text = normalizeVisibleText(match[1]);
    if (!text) continue;

    addHardcodedCandidate(candidates, {
      text,
      source: 'jsx_text',
      file: relPath,
      line: lineForIndex(lineStarts, match.index),
    });
  }

  return candidates;
}

function isProbablyJsxTagClose(content, closeIndex) {
  if (content[closeIndex - 1] === '=' || content[closeIndex - 1] === '-') return false;

  const lineStart = content.lastIndexOf('\n', closeIndex) + 1;
  const previousOpen = content.lastIndexOf('<', closeIndex);
  if (previousOpen < lineStart) return false;

  const tagText = content.slice(previousOpen + 1, closeIndex).trim();
  if (!tagText) return false;
  if (tagText.startsWith('!') || tagText.startsWith('?')) return false;
  if (/^[A-Za-z][\w.:/-]*(\s|$|>)/.test(tagText)) return true;
  if (/^\/[A-Za-z][\w.:/-]*(\s|$|>)/.test(tagText)) return true;

  return false;
}

function extractVisibleAttributes(content, relPath, lineStarts) {
  const candidates = [];
  const attrRegex = /\b([A-Za-z][\w-]*)\s*=\s*(["'])(.*?)\2/g;
  let match;

  while ((match = attrRegex.exec(content))) {
    const attrName = match[1];
    const attrValue = unescapeStringLiteral(match[3]);

    if (!visibleAttributeNames.has(attrName)) continue;
    addHardcodedCandidate(candidates, {
      text: attrValue,
      source: `attr:${attrName}`,
      file: relPath,
      line: lineForIndex(lineStarts, match.index),
    });
  }

  return candidates;
}

function extractVisibleStringLiterals(content, relPath, lineStarts) {
  const candidates = [];
  const stringRegex = /(["'`])/g;
  let match;

  while ((match = stringRegex.exec(content))) {
    const literal = readStringLiteralAt(content, match.index);
    if (!literal) continue;
    stringRegex.lastIndex = literal.end;

    const templateChunks =
      literal.quote === '`' && literal.raw.includes('${')
        ? literal.raw.replace(/\$\{[\s\S]*?\}/g, ' ')
        : null;
    const text = normalizeVisibleText(templateChunks || literal.value);
    if (isIgnorableVisibleText(text)) continue;

    const before = content.slice(Math.max(0, match.index - 80), match.index);
    const line = getLineText(content, lineStarts, lineForIndex(lineStarts, match.index));
    const isVisibleContext =
      visibleFunctionPattern.test(before) ||
      /\b(defaultValue|fallback|fallbackText|emptyText|loadingText|errorMessage|successMessage|label|placeholder|title|description|message|text|content)\s*:\s*$/.test(before) ||
      /\b(defaultValue|fallback)\s*[:=]/.test(line);

    if (!isVisibleContext) {
      if (technicalContextPattern.test(before)) continue;
      continue;
    }

    addHardcodedCandidate(candidates, {
      text,
      source: 'string_literal',
      file: relPath,
      line: lineForIndex(lineStarts, match.index),
    });
  }

  return candidates;
}

function uniqueByLocation(entries) {
  const seen = new Set();
  return entries.filter((entry) => {
    const id = `${entry.file}:${entry.line}:${entry.source}:${entry.key ?? ''}`;
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

function uniqueHardcodedCandidates(entries) {
  const seen = new Set();
  return entries.filter((entry) => {
    const id = `${entry.file}:${entry.line}:${entry.source}:${entry.text}`;
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

function formatList(items, emptyText = 'None') {
  if (!items.length) return `- ${emptyText}`;
  return items.map((item) => `- ${item}`).join('\n');
}

function formatKeyList(keys) {
  return formatList(keys.map((key) => `\`${key}\``));
}

function formatDuplicateJsonKeyList(items) {
  if (!items.length) return '- None';
  return items
    .map(
      (item) =>
        `- \`${item.key}\` in \`${item.file}:${item.line}\` duplicates first declaration at line ${item.firstLine}`
    )
    .join('\n');
}

function formatUsageList(items, emptyText = 'None') {
  if (!items.length) return `- ${emptyText}`;
  return items
    .map((item) => {
      const fallback = item.fallback ? ` fallback=${JSON.stringify(item.fallback)}` : '';
      return `- \`${item.key}\` (${item.source}) at \`${item.file}:${item.line}\`${fallback}`;
    })
    .join('\n');
}

function formatDynamicList(items) {
  if (!items.length) return '- None';
  return items
    .map((item) => `- ${item.source} at \`${item.file}:${item.line}\``)
    .join('\n');
}

function formatHardcodedList(items) {
  if (!items.length) return '- None';
  return items
    .map((item) => `- ${JSON.stringify(item.text)} (${item.source}) at \`${item.file}:${item.line}\``)
    .join('\n');
}

function formatFileCountList(items) {
  if (!items.length) return '- None';
  return items.map((item) => `- \`${item.file}\`: ${item.count}`).join('\n');
}

function countByFile(items) {
  const counts = new Map();
  for (const item of items) {
    counts.set(item.file, (counts.get(item.file) || 0) + 1);
  }

  return [...counts.entries()]
    .map(([file, count]) => ({ file, count }))
    .sort((a, b) => b.count - a.count || a.file.localeCompare(b.file));
}

function buildMissingKeyCandidates(usages) {
  const candidates = new Map();

  for (const usage of usages) {
    if (!candidates.has(usage.key)) {
      candidates.set(usage.key, {
        key: usage.key,
        fallbacks: new Set(),
        locations: [],
      });
    }

    const candidate = candidates.get(usage.key);
    if (usage.fallback) candidate.fallbacks.add(usage.fallback);
    candidate.locations.push(`${usage.file}:${usage.line}`);
  }

  return [...candidates.values()]
    .map((candidate) => ({
      ...candidate,
      fallbacks: [...candidate.fallbacks],
      locations: [...new Set(candidate.locations)].slice(0, 5),
    }))
    .sort((a, b) => a.key.localeCompare(b.key));
}

function formatMissingKeyCandidates(candidates) {
  if (!candidates.length) return '- None';

  return candidates
    .map((candidate) => {
      const fallbackText = candidate.fallbacks.length
        ? ` fallback(s): ${candidate.fallbacks.map((value) => JSON.stringify(value)).join(', ')}`
        : ' fallback(s): none';
      return `- \`${candidate.key}\` at \`${candidate.locations.join('`, `')}\`${fallbackText}`;
    })
    .join('\n');
}

function buildFlatPlaceholderObject(candidates) {
  return Object.fromEntries(candidates.map((candidate) => [candidate.key, 'TODO_REVIEW']));
}

function formatJsonBlock(value) {
  return `\`\`\`json\n${JSON.stringify(value, null, 2)}\n\`\`\``;
}

function buildReport(result) {
  const generatedAt = new Date().toISOString();
  const status = result.failed ? 'FAIL' : 'PASS';

  return `# Translation Audit EN/VI

Generated: ${generatedAt}

## Conclusion

${status}: translation completeness ${
    result.failed
      ? 'has blocking issues that should be fixed before release.'
      : 'has no blocking key/type/empty-value issues in the static audit.'
  }

${
    result.counts.dynamicUsages > 0
      ? 'Dynamic i18n usages are listed for manual review because static analysis cannot resolve their keys safely.'
      : 'No unresolved dynamic i18n usages remain.'
  }

## Summary

- EN leaf keys: ${result.counts.en}
- VI leaf keys: ${result.counts.vi}
- Static i18n usages found: ${result.counts.staticUsages}
- Dynamic i18n usages needing manual review: ${result.counts.dynamicUsages}
- Inline fallbacks found: ${result.counts.inlineFallbacks}
- Hardcoded visible text must_i18n: ${result.counts.hardcodedMustI18n}
- Hardcoded visible text review: ${result.counts.hardcodedReview}
- Unique used keys missing in EN: ${result.missingKeyCandidates.en.length}
- Unique used keys missing in VI: ${result.missingKeyCandidates.vi.length}
- Duplicate JSON keys: ${result.counts.duplicateJsonKeys}
- Keys unused by static scan: ${result.counts.unusedKeys}

## Duplicate JSON Keys

${formatDuplicateJsonKeyList(result.duplicateJsonKeys)}

## Missing Between Locale Files

### Missing in EN

${formatKeyList(result.missingInEn)}

### Missing in VI

${formatKeyList(result.missingInVi)}

## Type Mismatches

${formatList(
    result.typeMismatches.map(
      (item) => `\`${item.key}\`: EN=${item.enType}, VI=${item.viType}`
    )
  )}

## Empty or Placeholder Values

### EN

${formatList(result.emptyOrPlaceholder.en.map((item) => `\`${item.key}\` = ${JSON.stringify(item.value)}`))}

### VI

${formatList(result.emptyOrPlaceholder.vi.map((item) => `\`${item.key}\` = ${JSON.stringify(item.value)}`))}

## Used But Missing

### Missing in EN

${formatUsageList(result.usedButMissing.en)}

### Missing in VI

${formatUsageList(result.usedButMissing.vi)}

## Tracked JSX Key Props

${formatUsageList(result.trackedJsxKeyProps)}

## Inline Fallbacks

${formatUsageList(result.inlineFallbacks)}

## Hardcoded Visible Text

### must_i18n by file

${formatFileCountList(result.hardcodedVisibleText.mustI18nByFile)}

### must_i18n

${formatHardcodedList(result.hardcodedVisibleText.mustI18n)}

### review

${formatHardcodedList(result.hardcodedVisibleText.review)}

## Suggested Missing-Key Additions

These are flat key additions for review. Values are intentionally set to \`TODO_REVIEW\` so the audit does not invent translation copy.

### EN Candidates

${formatMissingKeyCandidates(result.missingKeyCandidates.en)}

${formatJsonBlock(buildFlatPlaceholderObject(result.missingKeyCandidates.en))}

### VI Candidates

${formatMissingKeyCandidates(result.missingKeyCandidates.vi)}

${formatJsonBlock(buildFlatPlaceholderObject(result.missingKeyCandidates.vi))}

## Dynamic Usages for Manual Review

${formatDynamicList(result.dynamicUsages)}

## Unused Keys by Static Scan

${formatKeyList(result.unusedKeys)}
`;
}

const duplicateJsonKeys = [
  ...collectDuplicateJsonKeys(enPath, 'en'),
  ...collectDuplicateJsonKeys(viPath, 'vi'),
];
const en = flattenTranslations(readJson(enPath));
const vi = flattenTranslations(readJson(viPath));
const enKeys = Object.keys(en).sort();
const viKeys = Object.keys(vi).sort();
const enKeySet = new Set(enKeys);
const viKeySet = new Set(viKeys);
const allLocaleKeys = [...new Set([...enKeys, ...viKeys])].sort();

const missingInEn = viKeys.filter((key) => !enKeySet.has(key));
const missingInVi = enKeys.filter((key) => !viKeySet.has(key));
const typeMismatches = allLocaleKeys
  .filter((key) => en[key] && vi[key] && en[key].type !== vi[key].type)
  .map((key) => ({ key, enType: en[key].type, viType: vi[key].type }));

const emptyOrPlaceholder = { en: [], vi: [] };
for (const [locale, entries] of [
  ['en', en],
  ['vi', vi],
]) {
  for (const [key, entry] of Object.entries(entries)) {
    const value = entry.value;
    if (
      value === null ||
      (typeof value === 'string' && (!value.trim() || placeholderPattern.test(value.trim())))
    ) {
      emptyOrPlaceholder[locale].push({ key, value });
    }
  }
  emptyOrPlaceholder[locale].sort((a, b) => a.key.localeCompare(b.key));
}

const sourceFiles = collectSourceFiles(srcDir);
const sourceDocuments = sourceFiles.map((filePath) => ({
  filePath,
  relPath: path.relative(rootDir, filePath).replace(/\\/g, '/'),
  content: fs.readFileSync(filePath, 'utf8'),
}));
const resolvableKeyPropertyMap = buildResolvableKeyPropertyMap(sourceDocuments);
const staticUsages = [];
const dynamicUsages = [];
const hardcodedVisibleText = [];

for (const document of sourceDocuments) {
  const { relPath, content } = document;
  const lineStarts = makeLineStarts(content);

  staticUsages.push(...extractStaticTranslationCalls(content, relPath, lineStarts));
  staticUsages.push(...extractStaticI18nKeys(content, relPath, lineStarts));
  staticUsages.push(...extractTemplateTranslationCalls(content, relPath, lineStarts, allLocaleKeys));
  staticUsages.push(...extractDeclaredTranslationKeyLiterals(content, relPath, lineStarts));
  staticUsages.push(...extractResolvedTranslationCalls(content, relPath, lineStarts, resolvableKeyPropertyMap));
  staticUsages.push(...extractResolvedI18nKeys(content, relPath, lineStarts, resolvableKeyPropertyMap));
  dynamicUsages.push(
    ...extractDynamicUsages(content, relPath, lineStarts, resolvableKeyPropertyMap, allLocaleKeys)
  );
  hardcodedVisibleText.push(...extractJsxTextNodes(content, relPath, lineStarts));
  hardcodedVisibleText.push(...extractVisibleAttributes(content, relPath, lineStarts));
  hardcodedVisibleText.push(...extractVisibleStringLiterals(content, relPath, lineStarts));
}

const uniqueStaticUsages = uniqueByLocation(staticUsages).sort((a, b) =>
  `${a.file}:${a.line}:${a.key}`.localeCompare(`${b.file}:${b.line}:${b.key}`)
);
const usedKeys = new Set(uniqueStaticUsages.map((usage) => usage.key));
const usedButMissing = {
  en: uniqueStaticUsages.filter((usage) => !enKeySet.has(usage.key)),
  vi: uniqueStaticUsages.filter((usage) => !viKeySet.has(usage.key)),
};
const inlineFallbacks = uniqueStaticUsages.filter((usage) => usage.fallback);
const trackedJsxKeyProps = uniqueStaticUsages.filter((usage) => usage.source.startsWith('jsx:'));
const unusedKeys = allLocaleKeys.filter((key) => !usedKeys.has(key));
const uniqueHardcodedVisibleText = uniqueHardcodedCandidates(hardcodedVisibleText).sort((a, b) =>
  `${a.file}:${a.line}:${a.text}`.localeCompare(`${b.file}:${b.line}:${b.text}`)
);
const mustI18nHardcodedText = uniqueHardcodedVisibleText.filter(
  (item) => item.classification === 'must_i18n'
);
const reviewHardcodedText = uniqueHardcodedVisibleText.filter(
  (item) => item.classification === 'review'
);

const result = {
  failed:
    duplicateJsonKeys.length > 0 ||
    missingInEn.length > 0 ||
    missingInVi.length > 0 ||
    typeMismatches.length > 0 ||
    emptyOrPlaceholder.en.length > 0 ||
    emptyOrPlaceholder.vi.length > 0 ||
    usedButMissing.en.length > 0 ||
    usedButMissing.vi.length > 0 ||
    mustI18nHardcodedText.length > 0,
  counts: {
    en: enKeys.length,
    vi: viKeys.length,
    staticUsages: uniqueStaticUsages.length,
    dynamicUsages: dynamicUsages.length,
    inlineFallbacks: inlineFallbacks.length,
    hardcodedMustI18n: mustI18nHardcodedText.length,
    hardcodedReview: reviewHardcodedText.length,
    duplicateJsonKeys: duplicateJsonKeys.length,
    unusedKeys: unusedKeys.length,
  },
  duplicateJsonKeys,
  missingInEn,
  missingInVi,
  typeMismatches,
  emptyOrPlaceholder,
  usedButMissing,
  trackedJsxKeyProps,
  inlineFallbacks,
  hardcodedVisibleText: {
    mustI18n: mustI18nHardcodedText,
    mustI18nByFile: countByFile(mustI18nHardcodedText),
    review: reviewHardcodedText,
  },
  missingKeyCandidates: {
    en: buildMissingKeyCandidates(usedButMissing.en),
    vi: buildMissingKeyCandidates(usedButMissing.vi),
  },
  dynamicUsages,
  unusedKeys,
};

const report = buildReport(result);

if (shouldWrite) {
  fs.writeFileSync(reportPath, report);
  console.log(`Translation audit report written to ${path.relative(rootDir, reportPath)}`);
} else {
  console.log(report);
}

if (result.failed) {
  process.exitCode = 1;
}
