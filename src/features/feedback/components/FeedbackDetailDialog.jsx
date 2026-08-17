import { useState } from 'react';
import { MapPin, User, CheckCircle2, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { withBaseUrl } from '@/lib/utils';
import placeholderImg from '@/assets/images/placeholder.png';
import { useGetFeedbackById } from '@/services/api/feedback/feedbackService';

const PRIORITY_CLASS = {
  low: 'bg-muted text-muted-foreground border-border',
  normal: 'bg-primary/10 text-primary border-primary/20',
  high: 'bg-warning/10 text-warning border-warning/20',
  critical: 'bg-destructive/10 text-destructive border-destructive/20',
};

const STATUS_CLASS = {
  pending: 'bg-warning/10 text-warning border-warning/20',
  in_progress: 'bg-primary/10 text-primary border-primary/20',
  resolved: 'bg-success/10 text-success border-success/20',
  rejected: 'bg-destructive/10 text-destructive border-destructive/20',
  closed: 'bg-muted text-muted-foreground border-border',
};

function formatDateTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function DetailRow({ label, children }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <span className="typo-meta font-semibold text-muted-foreground">{label}:</span>
      <div className="col-span-2 typo-body">{children}</div>
    </div>
  );
}

/**
 * @param {{ open: boolean, onOpenChange: (open: boolean) => void, feedbackId: string|null }} props
 */
export default function FeedbackDetailDialog({ open, onOpenChange, feedbackId }) {
  const { t } = useTranslation();

  const { data, isLoading } = useGetFeedbackById(feedbackId, {
    enabled: Boolean(feedbackId) && open,
    staleTime: 0,
  });

  const feedback = data?.data ?? null;

  const [lightboxSrc, setLightboxSrc] = useState(null);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[82vh] max-w-2xl overflow-y-auto">
          <DialogTitle className="typo-body font-bold">
            {t('feedbackPage.detail.title')}
          </DialogTitle>
          <DialogDescription className="typo-meta">
            {t('feedbackPage.detail.description')}
          </DialogDescription>

          {isLoading ? (
            <div className="space-y-3 py-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="grid grid-cols-3 gap-2">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                  <div className="col-span-2 h-4 animate-pulse rounded bg-muted" />
                </div>
              ))}
            </div>
          ) : feedback ? (
            <div className="mt-2 space-y-3">
              <DetailRow label={t('feedbackPage.detail.fields.title')}>
                <span className="font-semibold">{feedback.title}</span>
              </DetailRow>

              <DetailRow label={t('feedbackPage.detail.fields.content')}>
                <p className="whitespace-pre-wrap">{feedback.content}</p>
              </DetailRow>

              <DetailRow label={t('feedbackPage.detail.fields.priority')}>
                <Badge
                  variant="outline"
                  className={PRIORITY_CLASS[feedback.priority] ?? ''}
                >
                  {t(`feedbackPage.priority.${feedback.priority}`, { defaultValue: feedback.priority })}
                </Badge>
              </DetailRow>

              <DetailRow label={t('feedbackPage.detail.fields.status')}>
                <Badge
                  variant="outline"
                  className={STATUS_CLASS[feedback.status] ?? ''}
                >
                  {t(`feedbackPage.status.${feedback.status}`, { defaultValue: feedback.status })}
                </Badge>
              </DetailRow>

              <DetailRow label={t('feedbackPage.detail.fields.location_verified')}>
                <div className="flex items-center gap-1.5">
                  {feedback.is_location_verified ? (
                    <CheckCircle2 className="size-4 text-success" />
                  ) : (
                    <Clock className="size-4 text-muted-foreground" />
                  )}
                  <span className="typo-meta">
                    {feedback.is_location_verified
                      ? t('feedbackPage.detail.verified')
                      : t('feedbackPage.detail.not_verified')}
                  </span>
                </div>
              </DetailRow>

              {(feedback.user_name || feedback.user_avatar) && (
                <DetailRow label={t('feedbackPage.detail.fields.submitted_by')}>
                  <div className="flex items-center gap-2">
                    {feedback.user_avatar ? (
                      <img
                        src={withBaseUrl(feedback.user_avatar)}
                        alt=""
                        className="size-7 rounded-full border object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = placeholderImg;
                        }}
                      />
                    ) : (
                      <div className="flex size-7 items-center justify-center rounded-full bg-muted">
                        <User className="size-3.5 text-muted-foreground" />
                      </div>
                    )}
                    <span className="typo-body font-medium">
                      {feedback.user_name ?? t('feedbackPage.card.anonymous')}
                    </span>
                  </div>
                </DetailRow>
              )}

              {(feedback.location_text || feedback.latitude || feedback.longitude) && (
                <DetailRow label={t('feedbackPage.detail.fields.location')}>
                  <div className="flex items-start gap-1.5">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <div>
                      {feedback.location_text && (
                        <p className="typo-body">{feedback.location_text}</p>
                      )}
                      {(feedback.latitude || feedback.longitude) && (
                        <p className="typo-meta text-muted-foreground">
                          {feedback.latitude}, {feedback.longitude}
                        </p>
                      )}
                    </div>
                  </div>
                </DetailRow>
              )}

              {feedback.admin_response && (
                <DetailRow label={t('feedbackPage.detail.fields.admin_response')}>
                  <p className="rounded-lg bg-muted p-3 typo-body">{feedback.admin_response}</p>
                </DetailRow>
              )}

              {feedback.images && feedback.images.length > 0 && (
                <DetailRow label={t('feedbackPage.detail.fields.images')}>
                  <div className="grid grid-cols-3 gap-2">
                    {feedback.images.map((url, idx) => (
                      <img
                        key={idx}
                        src={withBaseUrl(url)}
                        alt=""
                        className="h-24 w-full cursor-zoom-in rounded-lg border object-cover transition hover:opacity-80"
                        onClick={() => setLightboxSrc(withBaseUrl(url))}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = placeholderImg;
                        }}
                      />
                    ))}
                  </div>
                </DetailRow>
              )}

              <DetailRow label={t('feedbackPage.detail.fields.created_at')}>
                <span className="typo-meta text-muted-foreground">
                  {formatDateTime(feedback.created_at)}
                </span>
              </DetailRow>
            </div>
          ) : (
            <div className="py-12 text-center typo-body text-muted-foreground">
              {t('feedbackPage.states.not_found')}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Simple lightbox */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-200 flex cursor-zoom-out items-center justify-center bg-black/80 p-4"
          onClick={() => setLightboxSrc(null)}
        >
          <img
            src={lightboxSrc}
            alt=""
            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
          />
        </div>
      )}
    </>
  );
}
