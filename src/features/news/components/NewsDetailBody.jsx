import React, { useMemo } from 'react';
import DOMPurify from 'dompurify';
import { Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { hasHtmlMarkup } from '@/lib/utils';

function calculateReadingTime(text) {
  if (!text) return 0;
  const plain = text.replace(/<[^>]*>/g, '');
  const words = plain.trim().split(/\s+/).filter(Boolean).length;
  if (words === 0) return 0;
  return Math.max(1, Math.ceil(words / 200));
}

export default function NewsDetailBody({ detail, t }) {
  const content = detail?.content ?? '';
  const summary = detail?.summary ?? '';

  const isHtmlContent = hasHtmlMarkup(content);
  const sanitizedHtml = useMemo(() => {
    if (!isHtmlContent) return '';
    return DOMPurify.sanitize(content);
  }, [isHtmlContent, content]);

  const readingMinutes = useMemo(
    () => calculateReadingTime(content || summary),
    [content, summary]
  );

  return (
    <Card className="rounded-3xl border-border/70 shadow-sm">
      <CardContent className="space-y-5 px-6 py-6">
        {readingMinutes > 0 && (
          <div className="typo-meta text-muted-foreground flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {readingMinutes} {t('newsPage.detail.min_read')}
          </div>
        )}

        {summary ? (
          <div className="rounded-2xl border-l-4 border-primary bg-primary/5 px-5 py-4">
            <p className="typo-body text-foreground italic leading-relaxed">{summary}</p>
          </div>
        ) : null}

        {isHtmlContent ? (
          <div
            className="typo-body text-foreground prose prose-sm max-w-none leading-relaxed"
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
          />
        ) : (
          <p className="typo-body text-foreground whitespace-pre-line leading-relaxed">
            {content || t('newsPage.detail.no_content')}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
