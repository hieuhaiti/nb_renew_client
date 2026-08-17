import { MapPin, User, Calendar, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { withBaseUrl } from '@/lib/utils';
import placeholderImg from '@/assets/images/placeholder.png';

const PRIORITY_BADGE = {
  low: 'bg-muted text-muted-foreground border-border',
  normal: 'bg-primary/10 text-primary border-primary/20',
  high: 'bg-warning/10 text-warning border-warning/20',
  critical: 'bg-destructive/10 text-destructive border-destructive/20',
};

const STATUS_BADGE = {
  pending: 'bg-warning/10 text-warning border-warning/20',
  in_progress: 'bg-primary/10 text-primary border-primary/20',
  resolved: 'bg-success/10 text-success border-success/20',
  rejected: 'bg-destructive/10 text-destructive border-destructive/20',
  closed: 'bg-muted text-muted-foreground border-border',
};

/**
 * @param {{ item: import('../../../services/api/feedback/feedbackService').CitizenFeedback, onClick: () => void }} props
 */
export default function FeedbackCard({ item, onClick }) {
  const { t } = useTranslation();

  const priorityLabel = t(`feedbackPage.priority.${item.priority}`, { defaultValue: item.priority });
  const statusLabel = t(`feedbackPage.status.${item.status}`, { defaultValue: item.status });
  const priorityClass = PRIORITY_BADGE[item.priority] ?? 'bg-muted text-muted-foreground border-border';
  const statusClass = STATUS_BADGE[item.status] ?? 'bg-muted text-muted-foreground border-border';

  const coverImage = item.images?.[0];

  const date = item.created_at
    ? new Date(item.created_at).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : null;

  return (
    <article
      onClick={onClick}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* Cover image */}
      {coverImage && (
        <div className="relative h-36 overflow-hidden">
          <img
            src={withBaseUrl(coverImage)}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = placeholderImg;
            }}
          />
        </div>
      )}

      <div className="flex flex-1 flex-col gap-2 p-4">
        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={`typo-badge inline-flex items-center gap-1 rounded-full border px-2 py-0.5 ${priorityClass}`}>
            {item.priority === 'critical' && <AlertTriangle className="size-2.5" />}
            {priorityLabel}
          </span>
          <span className={`typo-badge inline-flex rounded-full border px-2 py-0.5 ${statusClass}`}>
            {statusLabel}
          </span>
        </div>

        {/* Title */}
        <h3 className="typo-body line-clamp-2 font-bold text-foreground transition-colors group-hover:text-primary">
          {item.title}
        </h3>

        {/* Content preview */}
        <p className="typo-meta line-clamp-3 text-muted-foreground">{item.content}</p>

        {/* Location */}
        {(item.location_text || (item.latitude && item.longitude)) && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="size-3 shrink-0" />
            <span className="typo-meta line-clamp-1">
              {item.location_text ?? `${item.latitude}, ${item.longitude}`}
            </span>
          </div>
        )}

        {/* Footer: user + date */}
        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-1.5">
            {item.user_avatar ? (
              <img
                src={withBaseUrl(item.user_avatar)}
                alt=""
                className="size-5 rounded-full border object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = placeholderImg;
                }}
              />
            ) : (
              <div className="flex size-5 items-center justify-center rounded-full bg-muted">
                <User className="size-3 text-muted-foreground" />
              </div>
            )}
            <span className="typo-meta text-muted-foreground">
              {item.user_name ?? t('feedbackPage.card.anonymous')}
            </span>
          </div>

          {date && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="size-3 shrink-0" />
              <span className="typo-meta">{date}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export function FeedbackCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-border bg-card">
      <div className="space-y-3 p-4">
        <div className="flex gap-2">
          <div className="h-5 w-16 rounded-full bg-muted" />
          <div className="h-5 w-20 rounded-full bg-muted" />
        </div>
        <div className="h-4 w-3/4 rounded bg-muted" />
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-2/3 rounded bg-muted" />
        <div className="h-3 w-1/2 rounded bg-muted" />
        <div className="flex justify-between pt-1">
          <div className="h-4 w-24 rounded bg-muted" />
          <div className="h-4 w-16 rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}
