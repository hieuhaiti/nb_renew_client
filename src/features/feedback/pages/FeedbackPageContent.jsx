import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import {
  Search,
  RefreshCw,
  Inbox,
  ChevronLeft,
  ChevronRight,
  MessageSquarePlus,
} from 'lucide-react';
import RootLayout from '@/components/layout/RootLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useAuthStore from '@/stores/useAuthStore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetPublicFeedbacks } from '@/services/api/feedback/feedbackService';
import FeedbackCard, { FeedbackCardSkeleton } from '../components/FeedbackCard';
import FeedbackDetailDialog from '../components/FeedbackDetailDialog';
import FeedbackSubmitDialog from '../components/FeedbackSubmitDialog';

const HERO_BG =
  'linear-gradient(135deg,rgba(30,64,175,.9),rgba(37,99,235,.85),rgba(59,130,246,.8)), url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80") center/cover';

const PRIORITIES = ['all', 'low', 'normal', 'high', 'critical'];
const LIMIT = 12;

export default function FeedbackPageContent() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [debouncedSearch] = useDebounce(search.trim(), 400);

  const [selectedId, setSelectedId] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);

  const { data, isLoading, isError, isFetching, refetch } = useGetPublicFeedbacks({
    page,
    limit: LIMIT,
    search: debouncedSearch || undefined,
    priority: priorityFilter !== 'all' ? priorityFilter : undefined,
  });

  const feedbacks = useMemo(() => data?.data?.items ?? data?.items ?? [], [data]);
  const pagination = useMemo(() => data?.data?.pagination ?? data?.pagination ?? null, [data]);
  const total = pagination?.total ?? feedbacks.length;
  const totalPages = pagination?.totalPages ?? 1;

  function openDetail(id) {
    setSelectedId(id);
    setDetailOpen(true);
  }

  function handleReset() {
    setSearch('');
    setPriorityFilter('all');
    setPage(1);
  }

  return (
    <RootLayout>
      <div className="min-h-screen">
        {/* Hero */}
        <section className="px-6 py-10 text-white" style={{ background: HERO_BG }}>
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 max-w-2xl">
              <span className="typo-badge mb-3 inline-flex rounded-full border border-white/30 bg-white/15 px-3 py-1 backdrop-blur-sm">
                {t('feedbackPage.hero.badge')}
              </span>
              <h1 className="mt-2 text-2xl leading-tight font-black tracking-tight md:text-3xl xl:text-4xl">
                {t('feedbackPage.hero.title')}
              </h1>
              <p className="typo-body mt-2 leading-relaxed font-medium text-white/90">
                {t('feedbackPage.hero.description')}
              </p>
            </div>

            <div className="mb-4 flex flex-row items-stretch gap-4 max-[1023px]:flex-col">
              {/* Stats */}
              <div className="flex flex-wrap items-stretch gap-3 self-stretch">
                <div className="flex min-h-19 flex-col justify-center rounded-2xl border border-white/25 bg-white/15 px-5 py-2.5 text-center backdrop-blur-sm">
                  <div className="text-lg leading-none font-black md:text-xl xl:text-2xl">
                    {total}
                  </div>
                  <div className="typo-meta mt-0.5 text-white/80">
                    {t('feedbackPage.stats.total')}
                  </div>
                </div>
              </div>

              {/* Search + filter bar */}
              <div className="bg-card/95 flex flex-1 flex-col gap-3 rounded-3xl border border-white/75 p-4 shadow-[0_12px_28px_rgba(0,0,0,.14)] sm:flex-row sm:items-center">
                <div className="relative min-w-0 flex-1">
                  <Search
                    size={16}
                    className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
                  />
                  <Input
                    type="text"
                    placeholder={t('feedbackPage.filters.search_placeholder')}
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    className="border-input bg-card typo-form text-foreground focus:border-primary h-11 w-full rounded-xl pr-3 pl-9 outline-none"
                  />
                </div>

                <Select
                  value={priorityFilter}
                  onValueChange={(v) => {
                    setPriorityFilter(v);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="border-input bg-card typo-form text-foreground focus:border-primary h-11 shrink-0 rounded-xl px-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="typo-form">
                      {t('feedbackPage.filters.all_priorities')}
                    </SelectItem>
                    {PRIORITIES.slice(1).map((p) => (
                      <SelectItem key={p} value={p} className="typo-form">
                        {t(`feedbackPage.priority.${p}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  type="button"
                  onClick={() => setSubmitOpen(true)}
                  className="typo-button h-11 shrink-0 gap-2 rounded-xl px-5"
                >
                  <MessageSquarePlus size={16} />
                  {t('feedbackPage.submit.btn_label')}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-4 py-5 md:px-6">
          {/* Toolbar */}
          <div className="mb-5 flex items-center justify-between gap-3">
            <p className="typo-meta text-muted-foreground">
              <strong className="text-foreground">{total}</strong>{' '}
              {t('feedbackPage.stats.total').toLowerCase()}
            </p>
            <Button
              variant="ghost"
              type="button"
              onClick={handleReset}
              className="border-border bg-card typo-meta text-muted-foreground hover:bg-muted flex h-8 items-center gap-1.5 rounded-lg px-3 font-semibold"
            >
              <RefreshCw size={12} className={isFetching ? 'animate-spin' : ''} />
              {t('feedbackPage.toolbar.refresh')}
            </Button>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <FeedbackCardSkeleton key={i} />
              ))}
            </div>
          ) : isError ? (
            <div className="border-border bg-card typo-body text-muted-foreground rounded-2xl py-20 text-center">
              {t('feedbackPage.states.error')}
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="border-border bg-card flex flex-col items-center justify-center rounded-2xl py-20">
              <Inbox size={40} className="mb-3 opacity-30" />
              <p className="typo-body text-foreground font-semibold">
                {t('feedbackPage.states.empty_title')}
              </p>
              <p className="typo-meta text-muted-foreground mt-1">
                {t('feedbackPage.states.empty_desc')}
              </p>
              <Button
                type="button"
                className="typo-button mt-4 gap-2"
                onClick={() => setSubmitOpen(true)}
              >
                <MessageSquarePlus size={16} />
                {t('feedbackPage.submit.btn_label')}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {feedbacks.map((item) => (
                <FeedbackCard key={item.id} item={item} onClick={() => openDetail(item.id)} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between">
              <Button
                variant="ghost"
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="border-border bg-card typo-body hover:bg-muted flex h-9 items-center gap-1.5 rounded-xl px-4 font-semibold disabled:opacity-40"
              >
                <ChevronLeft size={15} />
                {t('common.prev')}
              </Button>
              <span className="border-border bg-card typo-body rounded-full px-4 py-1.5 font-semibold">
                {t('feedbackPage.pagination.page', { current: page, total: totalPages })}
              </span>
              <Button
                variant="ghost"
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="border-border bg-card typo-body hover:bg-muted flex h-9 items-center gap-1.5 rounded-xl px-4 font-semibold disabled:opacity-40"
              >
                {t('common.next')}
                <ChevronRight size={15} />
              </Button>
            </div>
          )}
        </div>
      </div>

      <FeedbackDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        feedbackId={selectedId}
      />

      <FeedbackSubmitDialog
        open={submitOpen}
        onOpenChange={setSubmitOpen}
        onSuccess={() => refetch()}
      />
    </RootLayout>
  );
}
