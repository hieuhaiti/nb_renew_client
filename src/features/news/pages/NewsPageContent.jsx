import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useDebounce } from 'use-debounce';
import { useTranslation } from 'react-i18next';
import LoadingInline from '@/components/common/LoadingInline';
import RootLayout from '@/components/layout/RootLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetNewsList } from '@/services/api/news/newsService';
import { getLocaleFromLanguage } from '@/lib/utils';
import NewsHeroHighlights, { SectionHeading } from '@/features/news/components/NewsHeroHighlights';
import NewsCardsGrid from '@/features/news/components/NewsCardsGrid';

function formatDate(value, locale) {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--';
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(date);
}

export default function NewsPageContent() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const locale = getLocaleFromLanguage(i18n.language);

  const [keyword, setKeyword] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState('all');
  const [page, setPage] = useState(1);
  const limit = 9;
  const [debouncedKeyword] = useDebounce(keyword.trim(), 400);

  useEffect(() => {
    setPage(1);
  }, [debouncedKeyword, featuredFilter]);

  const isFeaturedParam =
    featuredFilter === 'featured' ? true : featuredFilter === 'normal' ? false : undefined;

  const { data, isLoading, isError, isFetching, refetch } = useGetNewsList({
    page,
    limit,
    search: debouncedKeyword || undefined,
    is_published: true,
    is_featured: isFeaturedParam,
  });

  const items = useMemo(() => {
    const raw = data?.data?.items || data?.data?.news || data?.items || data?.news || [];
    return Array.isArray(raw) ? raw : [];
  }, [data]);

  const pagination = data?.data?.pagination || data?.pagination || {};
  const total = Number(pagination?.total || items.length || 0);
  const totalPages = Math.max(1, Number(pagination?.totalPages || pagination?.pages || 1));
  const currentPage = Math.max(1, Number(pagination?.page || page));

  const featuredCount = useMemo(() => {
    return items.filter((item) => Boolean(item?.is_featured)).length;
  }, [items]);

  return (
    <RootLayout>
      <div className="bg-background min-h-screen py-4 sm:py-5 lg:py-6">
        <div className="mx-auto w-full px-4 sm:px-6 lg:w-[80%] lg:px-0 xl:w-[70%] 2xl:w-[60%]">
          <NewsHeroHighlights
            t={t}
            total={total}
            featuredCount={featuredCount}
            currentPage={currentPage}
            totalPages={totalPages}
            onGotoList={() =>
              document.getElementById('news-list')?.scrollIntoView({ behavior: 'smooth' })
            }
            onGotoMap={() => navigate('/map')}
          />

          <section className="mt-4">
            <Card className="border-border/70 gap-0 rounded-3xl py-0 shadow-sm">
              <CardContent className="space-y-4 px-5 py-5">
                <SectionHeading
                  title={t('newsPage.filters.title')}
                  description={t('newsPage.filters.description')}
                />

                <div className="grid gap-3 lg:grid-cols-[2fr_1fr_auto]">
                  <div className="space-y-1.5">
                    <label className="typo-meta text-muted-foreground">
                      {t('newsPage.filters.keyword')}
                    </label>
                    <div className="relative">
                      <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                      <Input
                        value={keyword}
                        onChange={(event) => setKeyword(event.target.value)}
                        placeholder={t('newsPage.filters.placeholder')}
                        className="h-11 pl-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="typo-meta text-muted-foreground">
                      {t('newsPage.filters.featured')}
                    </label>
                    <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
                      <SelectTrigger className="h-11 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('newsPage.filters.options.all')}</SelectItem>
                        <SelectItem value="featured">
                          {t('newsPage.filters.options.featured')}
                        </SelectItem>
                        <SelectItem value="normal">
                          {t('newsPage.filters.options.normal')}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end gap-2">
                    <Button
                      variant="outline"
                      className="h-11 rounded-xl"
                      onClick={() => refetch?.()}
                      disabled={isFetching}
                    >
                      {isFetching ? (
                        <span className="inline-flex items-center gap-2">
                          <LoadingInline size="small" color="muted" />
                          {t('newsPage.actions.loading')}
                        </span>
                      ) : (
                        t('newsPage.actions.refresh')
                      )}
                    </Button>
                    <Button
                      className="h-11 rounded-xl"
                      onClick={() => {
                        setKeyword('');
                        setFeaturedFilter('all');
                      }}
                    >
                      {t('newsPage.actions.reset')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section id="news-list" className="mt-6">
            <div className="mb-4 flex items-end justify-between gap-3">
              <SectionHeading
                title={t('newsPage.list.title')}
                description={t('newsPage.list.description', { count: items.length })}
              />
            </div>

            {isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={`news-skeleton-${index}`}
                    className="border-border/70 bg-card h-80 animate-pulse rounded-2xl border"
                  />
                ))}
              </div>
            ) : isError ? (
              <div className="text-destructive py-12 text-center text-sm">
                {t('newsPage.states.error')}
              </div>
            ) : items.length === 0 ? (
              <div className="text-muted-foreground py-12 text-center text-sm">
                {t('newsPage.states.empty')}
              </div>
            ) : (
              <>
                <NewsCardsGrid items={items} t={t} locale={locale} formatDate={formatDate} />

                <div className="mt-6 flex items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    className="rounded-xl"
                    disabled={currentPage <= 1}
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  >
                    {t('common.prev')}
                  </Button>
                  <span className="typo-meta text-muted-foreground">
                    {t('newsPage.pagination.page', { page: currentPage, totalPages })}
                  </span>
                  <Button
                    variant="outline"
                    className="rounded-xl"
                    disabled={currentPage >= totalPages}
                    onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  >
                    {t('common.next')}
                  </Button>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </RootLayout>
  );
}
