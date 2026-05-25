import { MapPin, ShoppingBag, Star, Building2, Tag } from 'lucide-react';
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

function StarRating({ count }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={13}
          className={i < count ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted'}
        />
      ))}
      <span className="text-muted-foreground ml-1 text-xs font-medium">{count} sao OCOP</span>
    </div>
  );
}

export default function OcopProductModal() {
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
          <DialogTitle>{name_vi ?? 'Sản phẩm OCOP'}</DialogTitle>
          <DialogDescription>Thông tin sản phẩm OCOP Ninh Bình</DialogDescription>
        </DialogHeader>

        {/* Hero image with green gradient overlay */}
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

          {/* OCOP badge overlay */}
          <div className="absolute top-3 left-3">
            <Badge className="gap-1 border-0 bg-amber-400 text-xs font-bold text-amber-900 shadow">
              <Star size={10} className="fill-amber-900" />
              OCOP
            </Badge>
          </div>

          {/* Star rating on image */}
          {star_rating > 0 && (
            <div className="absolute bottom-3 left-3">
              <div className="flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 shadow">
                {Array.from({ length: star_rating }, (_, i) => (
                  <Star key={i} size={11} className="fill-amber-400 text-amber-400" />
                ))}
                <span className="text-xs font-semibold text-amber-700">{star_rating} sao</span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-3 p-4">
          {/* Product name */}
          <h2 className="text-foreground line-clamp-2 text-base font-bold leading-tight">
            {name_vi}
          </h2>

          {/* Producer */}
          {producer_name && (
            <div className="flex items-center gap-2">
              <Building2 size={13} className="text-green-600 shrink-0" />
              <span className="text-muted-foreground text-sm">{producer_name}</span>
            </div>
          )}

          {/* Price */}
          {formattedPrice && (
            <div className="flex items-center gap-2">
              <Tag size={13} className="text-green-600 shrink-0" />
              <span className="text-sm font-semibold text-green-700">{formattedPrice}</span>
            </div>
          )}

          {/* Spot location */}
          {spot_name && (
            <div className="flex items-start gap-2">
              <MapPin size={13} className="text-green-600 mt-0.5 shrink-0" />
              <span className="text-muted-foreground text-sm">{spot_name}</span>
            </div>
          )}

          {/* Divider */}
          <div className="border-muted border-t" />

          {/* OCOP program badge row */}
          <div className="bg-green-50 dark:bg-green-950/30 flex items-center gap-2 rounded-lg px-3 py-2">
            <ShoppingBag size={14} className="shrink-0 text-green-700" />
            <p className="text-xs text-green-700">
              Sản phẩm đạt chứng nhận{' '}
              <span className="font-semibold">OCOP {star_rating} sao</span> — Mỗi xã một sản phẩm
            </p>
          </div>

          {/* Actions */}
          {spot_id && (
            <Button
              size="sm"
              className="w-full gap-1.5 bg-green-600 text-white hover:bg-green-700"
              onClick={handleViewSpot}
            >
              <MapPin size={14} />
              Xem điểm tham quan
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
