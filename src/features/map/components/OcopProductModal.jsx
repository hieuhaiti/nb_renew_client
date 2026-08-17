import { MapPin, ShoppingBag, Star, Building2, Tag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { withBaseUrl } from '@/lib/utils';
import placeholderImg from '@/assets/images/placeholder.png';
import { useOcopModalStore, useSpotDetailModalStore } from '@/features/map/store/useModalStore';

function formatPriceVnd(price) {
  const num = Number(price);
  if (!num) return null;
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
}

export default function OcopProductModal() {
  const { t } = useTranslation();
  const { isOpen, ocopData, closeOcopModal } = useOcopModalStore();
  const { openSpotModal } = useSpotDetailModalStore();

  if (!ocopData) return null;

  const { name_vi, star_rating, cover_image_url, producer_name, price_vnd, spot_id, spot_name } =
    ocopData;

  const imageUrl = cover_image_url ? withBaseUrl(cover_image_url) : placeholderImg;
  const formattedPrice = formatPriceVnd(price_vnd);

  const handleViewSpot = () => {
    if (!spot_id) return;
    closeOcopModal();
    openSpotModal(spot_id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeOcopModal()}>
      <DialogContent className="w-full max-w-sm overflow-hidden rounded-2xl p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{name_vi ?? t('mapPage.ocopPanel.fallbackProductName')}</DialogTitle>
          <DialogDescription>{t('mapPage.ocopPanel.productModalDescription')}</DialogDescription>
        </DialogHeader>

        <div className="relative h-44 w-full overflow-hidden">
          <img
            src={imageUrl}
            alt={name_vi ?? ''}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = placeholderImg;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-green-900/70 via-transparent to-transparent" />

          <div className="absolute top-3 left-3">
            <Badge className="gap-1 border-0 bg-amber-400 text-xs font-bold text-amber-900 shadow">
              <Star size={10} className="fill-amber-900" />
              OCOP
            </Badge>
          </div>

          {star_rating > 0 && (
            <div className="absolute bottom-3 left-3">
              <div className="flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 shadow">
                {Array.from({ length: star_rating }, (_, index) => (
                  <Star key={index} size={11} className="fill-amber-400 text-amber-400" />
                ))}
                <span className="text-xs font-semibold text-amber-700">
                  {t('mapPage.ocopPanel.ocopStars', { count: star_rating })}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 p-4">
          <h2 className="text-foreground line-clamp-2 text-base leading-tight font-bold">
            {name_vi}
          </h2>

          {producer_name && (
            <div className="flex items-center gap-2">
              <Building2 size={13} className="shrink-0 text-green-600" />
              <span className="text-muted-foreground text-sm">{producer_name}</span>
            </div>
          )}

          {formattedPrice && (
            <div className="flex items-center gap-2">
              <Tag size={13} className="shrink-0 text-green-600" />
              <span className="text-sm font-semibold text-green-700">{formattedPrice}</span>
            </div>
          )}

          {spot_name && (
            <div className="flex items-start gap-2">
              <MapPin size={13} className="mt-0.5 shrink-0 text-green-600" />
              <span className="text-muted-foreground text-sm">{spot_name}</span>
            </div>
          )}

          <div className="border-muted border-t" />

          <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 dark:bg-green-950/30">
            <ShoppingBag size={14} className="shrink-0 text-green-700" />
            <p className="text-xs text-green-700">
              {t('mapPage.ocopPanel.productCertified')}{' '}
              <span className="font-semibold">
                {t('mapPage.ocopPanel.ocopStars', { count: star_rating })}
              </span>{' '}
              {t('mapPage.ocopPanel.oneCommuneOneProduct')}
            </p>
          </div>

          {spot_id && (
            <Button
              size="sm"
              className="w-full gap-1.5 bg-green-600 text-white hover:bg-green-700"
              onClick={handleViewSpot}
            >
              <MapPin size={14} />
              {t('mapPage.ocopPanel.viewDestination')}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
