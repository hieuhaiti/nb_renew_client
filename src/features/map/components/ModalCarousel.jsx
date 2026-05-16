import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useModalCarouselStore } from '@/features/map/store/useModalStore';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { withBaseUrl } from '@/lib/utils';
import useEmblaCarousel from 'embla-carousel-react';
import { Button } from '@/components/ui/button';

export default function ModalCarousel() {
  const { t } = useTranslation();
  const { isModalCarouselOpen, imageData, closeCarouselModal } = useModalCarouselStore();
  const [zoomImage, setZoomImage] = useState(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    skipSnaps: false,
    containScroll: false,
  });

  const duplicatedImages = imageData ? [...imageData, ...imageData, ...imageData] : [];

  useEffect(() => {
    if (emblaApi && duplicatedImages.length > 0) {
      emblaApi.scrollTo(imageData.length, false);
    }
  }, [emblaApi, imageData?.length, duplicatedImages.length]);

  useEffect(() => {
    if (!zoomImage) return;
    const onEsc = (event) => {
      if (event.key === 'Escape') {
        setZoomImage(null);
      }
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [zoomImage]);

  if (!imageData || imageData.length === 0) return null;

  return (
    <Dialog
      open={isModalCarouselOpen}
      onOpenChange={(open) => {
        if (!open) {
          setZoomImage(null);
          closeCarouselModal();
        }
      }}
    >
      <DialogContent className="bg-card h-[95vh] min-w-4xl xl:h-[80vh]">
        <DialogHeader>
          <DialogTitle>{t('images_gallery', 'Thư viện ảnh')}</DialogTitle>
          <DialogDescription>
            {t('explore_images', 'Khám phá những hình ảnh đẹp của địa điểm này')}
          </DialogDescription>
        </DialogHeader>

        <div className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-lg">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex flex-nowrap gap-4 px-4">
              {duplicatedImages.map((img, idx) => (
                <div key={idx} className="w-[85%] shrink-0 overflow-hidden rounded-lg xl:w-[65%]">
                  <Card className="h-full cursor-grab overflow-hidden active:cursor-grabbing">
                    <CardContent className="relative aspect-video w-full">
                      <img
                        src={withBaseUrl(img)}
                        alt={`${t('image', 'Ảnh')} ${(idx % imageData.length) + 1}`}
                        className="absolute inset-0 h-full w-full cursor-zoom-in rounded-lg object-cover shadow-lg"
                        onClick={() => setZoomImage(withBaseUrl(img))}
                      />
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          <Button variant="ghost"
            className="bg-background hover:bg-accent absolute top-1/2 left-2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border transition-colors"
            onClick={() => emblaApi?.scrollPrev()}
          >
            <span className="sr-only">Previous</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </Button>

          <Button variant="ghost"
            className="bg-background hover:bg-accent absolute top-1/2 right-2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border transition-colors"
            onClick={() => emblaApi?.scrollNext()}
          >
            <span className="sr-only">Next</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Button>
        </div>
      </DialogContent>

      {zoomImage && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/85 p-4"
          onClick={() => setZoomImage(null)}
          role="dialog"
          aria-label={t('zoomed_image', 'Ảnh phóng to')}
        >
          <Button variant="ghost"
            type="button"
            className="absolute top-4 right-4 rounded-full border border-white/35 bg-black/30 px-3 py-1 text-sm text-white hover:bg-black/50"
            onClick={(event) => {
              event.stopPropagation();
              setZoomImage(null);
            }}
          >
            {t('close', 'Đóng')}
          </Button>
          <img
            src={zoomImage}
            alt={t('zoomed_image', 'Ảnh phóng to')}
            className="max-h-[92vh] max-w-[92vw] rounded-md object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </Dialog>
  );
}


