import { useEffect } from 'react';
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

export default function ModalCarousel() {
    const { t } = useTranslation();
    const { isModalCarouselOpen, imageData, closeCarouselModal } =
        useModalCarouselStore();

    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: 'center',
        skipSnaps: false,
        containScroll: false,
    });

    // Duplicate images for infinite effect
    const duplicatedImages = imageData
        ? [...imageData, ...imageData, ...imageData]
        : [];

    useEffect(() => {
        if (emblaApi && duplicatedImages.length > 0) {
            // Jump to middle set on mount for seamless loop
            emblaApi.scrollTo(imageData.length, false);
        }
    }, [emblaApi, imageData?.length]);

    if (!imageData || imageData.length === 0) return null;

    return (
        <Dialog open={isModalCarouselOpen} onOpenChange={closeCarouselModal}>
            <DialogContent className="min-w-4xl h-[95vh] xl:h-[80vh] bg-card">
                <DialogHeader>
                    <DialogTitle>
                        {t('images_gallery', 'Thư viện ảnh')}
                    </DialogTitle>
                    <DialogDescription>
                        {t(
                            'explore_images',
                            'Khám phá những hình ảnh đẹp của địa điểm này'
                        )}
                    </DialogDescription>
                </DialogHeader>

                <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-lg">
                    <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex flex-nowrap gap-4 px-4">
                            {duplicatedImages.map((img, idx) => (
                                <div
                                    key={idx}
                                    className="shrink-0 w-[85%] xl:w-[65%] rounded-lg overflow-hidden"
                                >
                                    <Card className="overflow-hidden h-full cursor-grab active:cursor-grabbing">
                                        <CardContent className="relative w-full aspect-video">
                                            <img
                                                src={withBaseUrl(img)}
                                                alt={`Ảnh ${
                                                    (idx % imageData.length) + 1
                                                }`}
                                                className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-lg"
                                            />
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full border bg-background flex items-center justify-center hover:bg-accent transition-colors"
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
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>

                    <button
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full border bg-background flex items-center justify-center hover:bg-accent transition-colors"
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
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
