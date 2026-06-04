import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const rootDir = process.cwd();
const srcDir = path.join(rootDir, 'src');
const enPath = path.join(srcDir, 'locales', 'en', 'translation.json');
const viPath = path.join(srcDir, 'locales', 'vi', 'translation.json');
const defaultReportPath = path.join(rootDir, 'translation-audit.md');
const sourceExtensions = new Set(['.js', '.jsx', '.ts', '.tsx']);
const placeholderPattern = /^(todo|tbd|n\/a|na|none|null|undefined|-|--|\.\.\.|translate|translation pending|missing)$/i;

const args = process.argv.slice(2);
const writeIndex = args.indexOf('--write');
const shouldWrite = writeIndex !== -1;
const reportPath =
  shouldWrite && args[writeIndex + 1] && !args[writeIndex + 1].startsWith('--')
    ? path.resolve(rootDir, args[writeIndex + 1])
    : defaultReportPath;

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
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

function skipWhitespace(content, index) {
  let cursor = index;
  while (cursor < content.length && /\s/.test(content[cursor])) cursor += 1;
  return cursor;
}

function extractFallback(content, index) {
  let cursor = skipWhitespace(content, index);
  if (content[cursor] !== ',') return null;
  cursor = skipWhitespace(content, cursor + 1);

  const literal = readStringLiteralAt(content, cursor);
  if (!literal || (literal.quote === '`' && literal.raw.includes('${'))) return null;

  return literal.value;
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

function extractDynamicUsages(content, relPath, lineStarts) {
  const dynamic = [];
  const callRegex = /\b(?:i18n\.)?t\s*\(/g;
  const attrRegex = /\bi18nKey\s*=\s*{/g;
  let match;

  while ((match = callRegex.exec(content))) {
    const argStart = skipWhitespace(content, callRegex.lastIndex);
    const literal = readStringLiteralAt(content, argStart);
    if (!literal || (literal.quote === '`' && literal.raw.includes('${'))) {
      dynamic.push({
        source: 't()',
        file: relPath,
        line: lineForIndex(lineStarts, match.index),
      });
    }
  }

  while ((match = attrRegex.exec(content))) {
    const argStart = skipWhitespace(content, attrRegex.lastIndex);
    const literal = readStringLiteralAt(content, argStart);
    if (!literal || (literal.quote === '`' && literal.raw.includes('${'))) {
      dynamic.push({
        source: 'i18nKey',
        file: relPath,
        line: lineForIndex(lineStarts, match.index),
      });
    }
  }

  return dynamic;
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

function formatList(items, emptyText = 'None') {
  if (!items.length) return `- ${emptyText}`;
  return items.map((item) => `- ${item}`).join('\n');
}

function formatKeyList(keys) {
  return formatList(keys.map((key) => `\`${key}\``));
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

Dynamic i18n usages are listed for manual review because static analysis cannot resolve their keys safely.

## Summary

- EN leaf keys: ${result.counts.en}
- VI leaf keys: ${result.counts.vi}
- Static i18n usages found: ${result.counts.staticUsages}
- Dynamic i18n usages needing manual review: ${result.counts.dynamicUsages}
- Inline fallbacks found: ${result.counts.inlineFallbacks}
- Unique used keys missing in EN: ${result.missingKeyCandidates.en.length}
- Unique used keys missing in VI: ${result.missingKeyCandidates.vi.length}
- Keys unused by static scan: ${result.counts.unusedKeys}

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

## Inline Fallbacks

${formatUsageList(result.inlineFallbacks)}

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
const staticUsages = [];
const dynamicUsages = [];

for (const filePath of sourceFiles) {
  const relPath = path.relative(rootDir, filePath).replace(/\\/g, '/');
  const content = fs.readFileSync(filePath, 'utf8');
  const lineStarts = makeLineStarts(content);

  staticUsages.push(...extractStaticTranslationCalls(content, relPath, lineStarts));
  staticUsages.push(...extractStaticI18nKeys(content, relPath, lineStarts));
  dynamicUsages.push(...extractDynamicUsages(content, relPath, lineStarts));
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
const unusedKeys = allLocaleKeys.filter((key) => !usedKeys.has(key));

const result = {
  failed:
    missingInEn.length > 0 ||
    missingInVi.length > 0 ||
    typeMismatches.length > 0 ||
    emptyOrPlaceholder.en.length > 0 ||
    emptyOrPlaceholder.vi.length > 0 ||
    usedButMissing.en.length > 0 ||
    usedButMissing.vi.length > 0,
  counts: {
    en: enKeys.length,
    vi: viKeys.length,
    staticUsages: uniqueStaticUsages.length,
    dynamicUsages: dynamicUsages.length,
    inlineFallbacks: inlineFallbacks.length,
    unusedKeys: unusedKeys.length,
  },
  missingInEn,
  missingInVi,
  typeMismatches,
  emptyOrPlaceholder,
  usedButMissing,
  inlineFallbacks,
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
