import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, MapPin, Package, ShieldCheck, Star } from 'lucide-react';
import RootLayout from '@/components/layout/RootLayout';
import { useGetOcopById } from '@/services/api/ocop/ocopService';
import { formatVND, withBaseUrl } from '@/lib/utils';
import placeholderImg from '@/assets/images/placeholder.png';

const BTN_GRADIENT = { background: 'linear-gradient(135deg, #0b66c3, #0ea5e9)' };

const CATEGORY_LABELS = {
  thuc_pham: 'Thực phẩm',
  do_uong: 'Đồ uống',
  duoc_lieu: 'Dược liệu',
  thuoc_và_cskh: 'Thuốc & CSKH',
  vai_va_may_mac: 'Vải & May mặc',
  thu_cong_my_nghe: 'Thủ công mỹ nghệ',
  sinh_vat_canh: 'Sinh vật cảnh',
};

const CATEGORY_COLORS = {
  thuc_pham: { bg: 'bg-[#fef3c7]', text: 'text-[#b45309]', border: 'border-[#fde68a]' },
  do_uong: { bg: 'bg-[#dbeafe]', text: 'text-[#1d4ed8]', border: 'border-[#bfdbfe]' },
  duoc_lieu: { bg: 'bg-[#dcfce7]', text: 'text-[#166534]', border: 'border-[#bbf7d0]' },
  thuoc_và_cskh: { bg: 'bg-[#fce7f3]', text: 'text-[#9d174d]', border: 'border-[#fbcfe8]' },
  vai_va_may_mac: { bg: 'bg-[#f3e8ff]', text: 'text-[#6b21a8]', border: 'border-[#e9d5ff]' },
  thu_cong_my_nghe: { bg: 'bg-[#fff7ed]', text: 'text-[#9a3412]', border: 'border-[#fed7aa]' },
  sinh_vat_canh: { bg: 'bg-[#ecfdf5]', text: 'text-[#065f46]', border: 'border-[#a7f3d0]' },
};

const DEFAULT_CAT_COLOR = { bg: 'bg-[#f8fbff]', text: 'text-[#52647a]', border: 'border-[#cfe0f4]' };

const PROVINCE_LABELS = { 37: 'Ninh Bình' };

export default function OcopDetailPageContent() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, isLoading, isError } = useGetOcopById(id);

  const detail = useMemo(() => {
    if (!data) return null;
    return data?.data?.item || data?.data?.product || data?.item || data?.product || data?.data || null;
  }, [data]);

  const name = detail?.name_vi || detail?.name_en || detail?.name || 'Sản phẩm OCOP';
  const description = detail?.description_vi || detail?.description_en || detail?.description || 'Chưa có mô tả.';
  const provinceCode = String(detail?.province_code || '').trim();
  const provinceLabel = provinceCode ? PROVINCE_LABELS[provinceCode] || `Tỉnh ${provinceCode}` : '--';
  const imageSrc = withBaseUrl(detail?.cover_image_url || '');
  const priceValue = Number(detail?.price_vnd);
  const priceLabel = Number.isFinite(priceValue) && priceValue > 0 ? formatVND(priceValue) : 'Liên hệ';
  const stars = Math.min(5, Math.max(0, Number(detail?.star_rating || 0)));
  const category = detail?.category || '';
  const catColor = CATEGORY_COLORS[category] || DEFAULT_CAT_COLOR;
  const catLabel = CATEGORY_LABELS[category] || category || '--';

  if (isLoading) {
    return (
      <RootLayout>
        <div className="min-h-screen px-4 py-5 lg:py-6">
          <div className="mx-auto w-full max-w-7xl">
            <div className="mb-4 h-9 w-32 animate-pulse rounded-[10px] border border-[#cfe0f4] bg-[#f8fbff]" />
            <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
              <div className="h-80 animate-pulse rounded-[18px] border border-[#cfe0f4] bg-[#f8fbff] sm:h-96" />
              <div className="space-y-3">
                <div className="h-8 w-3/4 animate-pulse rounded-[8px] bg-[#f8fbff]" />
                <div className="flex gap-2">
                  <div className="h-6 w-20 animate-pulse rounded-full bg-[#f8fbff]" />
                  <div className="h-6 w-24 animate-pulse rounded-full bg-[#f8fbff]" />
                </div>
                <div className="h-32 animate-pulse rounded-[12px] border border-[#cfe0f4] bg-[#f8fbff]" />
                <div className="h-24 animate-pulse rounded-[12px] border border-[#cfe0f4] bg-[#f8fbff]" />
                <div className="h-12 animate-pulse rounded-[10px] bg-[#f8fbff]" />
              </div>
            </div>
          </div>
        </div>
      </RootLayout>
    );
  }

  if (isError || !detail) {
    return (
      <RootLayout>
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="w-full max-w-sm rounded-[18px] border border-[#cfe0f4] bg-white p-8 text-center shadow-[0_4px_16px_rgba(13,74,130,0.07)]">
            <p className="text-base font-bold text-foreground">Không tìm thấy sản phẩm OCOP</p>
            <button
              type="button"
              onClick={() => navigate('/ocop')}
              className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-[10px] border border-[#cfe0f4] bg-white px-4 py-2 text-sm font-semibold text-foreground hover:bg-[#eef7ff]"
            >
              <ArrowLeft size={14} />
              Quay lại danh sách
            </button>
          </div>
        </div>
      </RootLayout>
    );
  }

  return (
    <RootLayout>
      <div className="min-h-screen px-4 py-5 lg:py-6">
        <div className="mx-auto w-full max-w-7xl">
          {/* Back button */}
          <button
            type="button"
            onClick={() => navigate('/ocop')}
            className="mb-4 flex items-center gap-1.5 rounded-[10px] border border-[#cfe0f4] bg-white px-3.5 py-2 text-sm font-semibold text-foreground shadow-sm hover:bg-[#eef7ff]"
          >
            <ArrowLeft size={15} />
            Quay lại danh sách
          </button>

          <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
            {/* Image */}
            <div className="relative overflow-hidden rounded-[18px] border border-[#cfe0f4] shadow-[0_8px_24px_rgba(13,74,130,0.10)]">
              <div className="h-72 sm:h-96 lg:h-full lg:min-h-105">
                <img
                  src={imageSrc || placeholderImg}
                  alt={name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = placeholderImg;
                  }}
                />
              </div>
              {/* Star badge overlay */}
              {stars > 0 && (
                <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full border border-[#fde68a] bg-[#fef3c7]/95 px-2.5 py-1 text-xs font-bold text-[#b45309] backdrop-blur-sm">
                  <Star size={10} className="fill-[#b45309]" />
                  {stars} sao OCOP
                </div>
              )}
              {/* Category badge overlay */}
              {catLabel && catLabel !== '--' && (
                <div
                  className={`absolute top-3 right-3 rounded-full border px-2.5 py-1 text-xs font-semibold backdrop-blur-sm ${catColor.bg} ${catColor.text} ${catColor.border}`}
                >
                  {catLabel}
                </div>
              )}
            </div>

            {/* Detail info */}
            <div className="flex flex-col gap-4">
              {/* Name + badges */}
              <div>
                <h1 className="text-2xl font-black leading-snug tracking-tight text-foreground">
                  {name}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {stars > 0 && (
                    <span className="flex items-center gap-1 rounded-full border border-[#fde68a] bg-[#fef3c7] px-2.5 py-0.5 text-xs font-bold text-[#b45309]">
                      {'★'.repeat(stars)}{'☆'.repeat(5 - stars)} · {stars} sao
                    </span>
                  )}
                  {catLabel && catLabel !== '--' && (
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${catColor.bg} ${catColor.text} ${catColor.border}`}
                    >
                      {catLabel}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>

              {/* Info rows */}
              <div className="rounded-[12px] border border-[#cfe0f4] bg-[#f8fbff] p-4 space-y-3">
                <div className="flex items-center gap-2.5 text-sm text-foreground">
                  <Package size={15} className="shrink-0 text-[#0b66c3]" />
                  <span className="text-muted-foreground">Đơn vị tính:</span>
                  <span className="font-semibold">{detail?.unit || '--'}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-foreground">
                  <MapPin size={15} className="shrink-0 text-[#0b66c3]" />
                  <span className="text-muted-foreground">Tỉnh/Thành:</span>
                  <span className="font-semibold">{provinceLabel}</span>
                </div>
                {detail?.producer_name && (
                  <div className="flex items-start gap-2.5 text-sm text-foreground">
                    <span className="mt-0.5 shrink-0 text-[#0b66c3]">🏭</span>
                    <span className="text-muted-foreground shrink-0">Đơn vị:</span>
                    <span className="font-semibold">{detail.producer_name}</span>
                  </div>
                )}
                {detail?.certification_no && (
                  <div className="flex items-center gap-2.5 text-sm text-foreground">
                    <ShieldCheck size={15} className="shrink-0 text-[#0b66c3]" />
                    <span className="text-muted-foreground">Mã chứng nhận:</span>
                    <span className="font-semibold font-mono text-xs">{detail.certification_no}</span>
                  </div>
                )}
              </div>

              {/* Price + shop button */}
              <div className="rounded-[12px] border border-[#cfe0f4] bg-white p-4">
                <p className="text-xs text-muted-foreground mb-1">Giá tham khảo</p>
                <p className="text-2xl font-black text-[#0b66c3]">{priceLabel}</p>
                {detail?.unit && priceValue > 0 && (
                  <p className="mt-0.5 text-xs text-muted-foreground">/{detail.unit}</p>
                )}
              </div>

              <button
                type="button"
                onClick={() => detail?.shop_url && window.open(detail.shop_url, '_blank', 'noopener,noreferrer')}
                disabled={!detail?.shop_url}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-[10px] text-sm font-bold text-white disabled:opacity-40"
                style={BTN_GRADIENT}
              >
                Xem gian hàng
                <ExternalLink size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}
