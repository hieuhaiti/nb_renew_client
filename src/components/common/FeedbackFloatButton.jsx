import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageSquarePlus } from 'lucide-react';
import FeedbackSubmitDialog from '@/features/feedback/components/FeedbackSubmitDialog';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const EXCLUDED_PATHS = ['/map'];

export default function FeedbackFloatButton() {
  const location = useLocation();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const isExcluded = EXCLUDED_PATHS.some(
    (p) => location.pathname === p || location.pathname.startsWith(p + '/')
  );

  if (isExcluded) return null;

  return (
    <>
      {/* Float button */}
      <div className="pointer-events-none fixed right-5 bottom-6 z-40 flex flex-col items-end gap-2">
        {/* Tooltip label — visible on md+ and only on hover via group */}
        <div className="pointer-events-auto group relative">
          {/* Pulse ring */}
          <span className="absolute -inset-1 animate-pulse rounded-full bg-primary/15 group-hover:hidden" />

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Gửi phản ánh"
            className="
              relative flex items-center gap-2 overflow-hidden rounded-full
              bg-gradient-to-br from-primary to-secondary
              px-4 py-3
              text-primary-foreground
              shadow-[0_4px_20px_rgba(0,0,0,0.18)]
              ring-2 ring-white/20
              transition-all duration-200
              hover:scale-105 hover:shadow-[0_6px_28px_rgba(0,0,0,0.25)]
              active:scale-95
              sm:py-3
            "
          >
            <MessageSquarePlus size={20} className="shrink-0" />
            <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-300 sm:block sm:max-w-32">
              Gửi phản ánh
            </span>
          </button>
        </div>
      </div>

      <FeedbackSubmitDialog
        open={open}
        onOpenChange={setOpen}
        onSuccess={() => toast.success(t('feedbackPage.submit.success_toast', { defaultValue: 'Gửi phản ánh thành công!' }))}
      />
    </>
  );
}
