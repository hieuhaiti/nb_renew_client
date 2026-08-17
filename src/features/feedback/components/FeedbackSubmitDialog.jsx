import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MapPin, LocateFixed, Type, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateFeedback } from '@/services/api/feedback/feedbackService';
import useAuthStore from '@/stores/useAuthStore';

const PRIORITIES = ['low', 'normal', 'high', 'critical'];

/** Location mode: manual text or GPS fix */
const LOC_TEXT = 'text';
const LOC_GEO = 'geo';

function buildSchema(t) {
  return z.object({
    title: z
      .string()
      .min(10, t('feedbackPage.submit.errors.title_min'))
      .max(500, t('feedbackPage.submit.errors.title_max')),
    content: z
      .string()
      .min(20, t('feedbackPage.submit.errors.content_min')),
    priority: z.enum(['low', 'normal', 'high', 'critical']),
    location_text: z.string().optional().or(z.literal('')),
  });
}

/**
 * @param {{ open: boolean, onOpenChange: (open: boolean) => void, onSuccess?: () => void }} props
 */
export default function FeedbackSubmitDialog({ open, onOpenChange, onSuccess }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [locationMode, setLocationMode] = useState(LOC_TEXT);
  const [coords, setCoords] = useState(null); // { lat, lng }
  const [isLocating, setIsLocating] = useState(false);

  const schema = buildSchema(t);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      content: '',
      priority: 'normal',
      location_text: '',
    },
  });

  // Reset everything when dialog closes
  useEffect(() => {
    if (!open) {
      reset();
      setLocationMode(LOC_TEXT);
      setCoords(null);
      setIsLocating(false);
    }
  }, [open, reset]);

  // Geolocation handler
  function handleLocateMe() {
    if (!navigator.geolocation) {
      toast.error(t('feedbackPage.submit.location_error'));
      return;
    }
    setIsLocating(true);
    setCoords(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLocating(false);
      },
      () => {
        toast.error(t('feedbackPage.submit.location_error'));
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  const mutation = useCreateFeedback({
    onSuccess: () => {
      onOpenChange(false);
      onSuccess?.();
    },
  });

  function onSubmit(data) {
    const payload = {
      title: data.title,
      content: data.content,
      priority: data.priority,
    };

    const trimmedText = data.location_text?.trim();
    if (locationMode === LOC_TEXT && trimmedText) {
      payload.location_text = trimmedText;
    }
    if (locationMode === LOC_GEO && coords) {
      payload.latitude = coords.lat;
      payload.longitude = coords.lng;
    }

    mutation.mutate(payload);
  }

  // ── Unauthenticated state ────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-sm text-center">
          <DialogTitle className="typo-body font-bold">
            {t('feedbackPage.submit.auth_required_title')}
          </DialogTitle>
          <DialogDescription className="typo-meta">
            {t('feedbackPage.submit.auth_required_desc')}
          </DialogDescription>
          <div className="mt-4 flex justify-center gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t('feedbackPage.submit.cancel')}
            </Button>
            <Button
              onClick={() => {
                onOpenChange(false);
                navigate('/login');
              }}
            >
              {t('common.login')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // ── Authenticated form ───────────────────────────────────────────────────────
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-xl overflow-y-auto">
        <DialogTitle className="typo-body font-bold">
          {t('feedbackPage.submit.dialog_title')}
        </DialogTitle>
        <DialogDescription className="typo-meta">
          {t('feedbackPage.submit.dialog_desc')}
        </DialogDescription>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-2 space-y-4">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="fb-title" className="typo-form">
              {t('feedbackPage.submit.fields.title')}{' '}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="fb-title"
              {...register('title')}
              placeholder={t('feedbackPage.submit.fields.title_placeholder')}
              className="typo-form w-full min-w-0 truncate"
              maxLength={500}
            />
            {errors.title && (
              <p className="typo-meta text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <Label htmlFor="fb-content" className="typo-form">
              {t('feedbackPage.submit.fields.content')}{' '}
              <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="fb-content"
              {...register('content')}
              rows={4}
              placeholder={t('feedbackPage.submit.fields.content_placeholder')}
              className="typo-form w-full resize-none"
            />
            {errors.content && (
              <p className="typo-meta text-destructive">{errors.content.message}</p>
            )}
          </div>

          {/* Priority */}
          <div className="space-y-1.5">
            <Label className="typo-form">{t('feedbackPage.submit.fields.priority')}</Label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="typo-form w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((p) => (
                      <SelectItem key={p} value={p} className="typo-form">
                        {t(`feedbackPage.priority.${p}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Location section */}
          <div className="space-y-2">
            <Label className="typo-form">{t('feedbackPage.submit.fields.location')}</Label>

            {/* Mode toggle */}
            <div className="flex gap-1 rounded-xl border border-border bg-muted p-1">
              <button
                type="button"
                onClick={() => setLocationMode(LOC_TEXT)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 typo-badge transition-all hover:bg-card/70 ${
                  locationMode === LOC_TEXT
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Type size={13} />
                {t('feedbackPage.submit.fields.location_mode_text')}
              </button>
              <button
                type="button"
                onClick={() => setLocationMode(LOC_GEO)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 typo-badge transition-all hover:bg-card/70 ${
                  locationMode === LOC_GEO
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <LocateFixed size={13} />
                {t('feedbackPage.submit.fields.location_mode_geo')}
              </button>
            </div>

            {/* Text address */}
            {locationMode === LOC_TEXT && (
              <Input
                {...register('location_text')}
                placeholder={t('feedbackPage.submit.fields.location_placeholder')}
                className="typo-form w-full min-w-0 truncate"
              />
            )}

            {/* Geolocation */}
            {locationMode === LOC_GEO && (
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2 typo-form"
                  onClick={handleLocateMe}
                  disabled={isLocating}
                >
                  {isLocating ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <LocateFixed size={14} />
                  )}
                  {isLocating
                    ? t('feedbackPage.submit.fields.locating')
                    : t('feedbackPage.submit.fields.locate_me')}
                </Button>

                {coords && (
                  <div className="flex items-start gap-2 rounded-lg border border-success/30 bg-success/8 px-3 py-2">
                    <MapPin size={14} className="mt-0.5 shrink-0 text-success" />
                    <div className="min-w-0">
                      <p className="typo-meta font-semibold text-success">
                        {t('feedbackPage.submit.fields.locate_acquired')}
                      </p>
                      <p className="typo-meta mt-0.5 truncate text-muted-foreground">
                        {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={mutation.isPending}
            >
              {t('feedbackPage.submit.cancel')}
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending
                ? t('feedbackPage.submit.submitting')
                : t('feedbackPage.submit.submit')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
