import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ExternalLink, MapPin, Package } from 'lucide-react';
import RootLayout from '@/components/layout/RootLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGetOcopById } from '@/services/api/ocop/ocopService';
import { formatVND, withBaseUrl } from '@/lib/utils';
import placeholderImg from '@/assets/images/placeholder.png';

const PROVINCE_LABELS = {
  37: 'Ninh Bình',
};

export default function OcopDetailPageContent() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, isLoading, isError } = useGetOcopById(id);

  const detail = useMemo(() => {
    if (!data) return null;
    return data?.data?.item || data?.data?.product || data?.item || data?.product || data?.data || null;
  }, [data]);

  const name =
    detail?.name_vi || detail?.name_en || detail?.name || 'Sản phẩm OCOP';
  const description =
    detail?.description_vi || detail?.description_en || detail?.description || 'Chưa có mô tả.';
  const provinceCode = String(detail?.province_code || '').trim();
  const provinceLabel = provinceCode ? PROVINCE_LABELS[provinceCode] || `Tỉnh ${provinceCode}` : '--';
  const imageSrc = withBaseUrl(detail?.cover_image_url || '');
  const priceValue = Number(detail?.price_vnd);
  const priceLabel = Number.isFinite(priceValue) ? formatVND(priceValue) : '--';
  const stars = Number(detail?.star_rating || 0);

  if (isLoading) {
    return (
      <RootLayout>
        <div className="bg-background min-h-screen px-4 py-8">
          <div className="mx-auto max-w-6xl animate-pulse rounded-3xl border border-border/70 bg-card p-8" />
        </div>
      </RootLayout>
    );
  }

  if (isError || !detail) {
    return (
      <RootLayout>
        <div className="bg-background flex min-h-screen items-center justify-center px-4">
          <Card className="w-full max-w-xl rounded-3xl border-border/70">
            <CardContent className="space-y-4 px-6 py-6 text-center">
              <h1 className="typo-card-title text-foreground">Không tìm thấy chi tiết sản phẩm</h1>
              <Button className="rounded-xl" onClick={() => navigate('/ocop')}>
                Quay lại danh sách OCOP
              </Button>
            </CardContent>
          </Card>
        </div>
      </RootLayout>
    );
  }

  return (
    <RootLayout>
      <div className="bg-background min-h-screen px-4 py-4 lg:py-6">
        <div className="mx-auto w-full lg:w-[88%]">
          <Button variant="outline" className="mb-4 rounded-xl" onClick={() => navigate('/ocop')}>
            Quay lại danh sách
          </Button>

          <div className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
            <Card className="gap-0 overflow-hidden rounded-3xl border-border/70 py-0 shadow-sm">
              <div className="h-72 bg-muted sm:h-96">
                <img
                  src={imageSrc || placeholderImg}
                  alt={name}
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = placeholderImg;
                  }}
                />
              </div>
            </Card>

            <Card className="rounded-3xl border-border/70 shadow-sm">
              <CardContent className="space-y-4 px-6 py-6">
                <h1 className="typo-hero text-foreground">{name}</h1>

                <div className="flex flex-wrap gap-2">
                  {stars > 0 ? (
                    <span className="typo-badge rounded-full bg-primary/10 px-3 py-1 text-primary">
                      {'★'.repeat(stars)} · {stars} sao
                    </span>
                  ) : null}
                  <span className="typo-badge rounded-full bg-secondary/15 px-3 py-1 text-secondary">
                    {detail?.category || '--'}
                  </span>
                </div>

                <p className="typo-body text-muted-foreground leading-relaxed">{description}</p>

                <div className="space-y-2 rounded-2xl border border-border/70 bg-card p-4">
                  <p className="typo-body text-foreground flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    <span>{detail?.unit || '--'}</span>
                  </p>
                  <p className="typo-body text-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{provinceLabel}</span>
                  </p>
                  <p className="typo-body text-foreground">
                    Đơn vị cung cấp: {detail?.producer_name || '--'}
                  </p>
                  <p className="typo-body text-foreground">
                    Mã chứng nhận: {detail?.certification_no || '--'}
                  </p>
                </div>

                <div className="flex items-end justify-between gap-3">
                  <p className="text-2xl font-bold text-warning">{priceLabel}</p>
                  <Button
                    className="rounded-xl"
                    onClick={() => window.open(detail?.shop_url, '_blank', 'noopener,noreferrer')}
                    disabled={!detail?.shop_url}
                  >
                    Xem gian hàng
                    <ExternalLink className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}

