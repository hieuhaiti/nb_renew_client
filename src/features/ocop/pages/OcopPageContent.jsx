import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Star,
  MapPin,
  RefreshCw,
  Inbox,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useDebounce } from 'use-debounce';
import RootLayout from '@/components/layout/RootLayout';
import { useGetOcopProducts } from '@/services/api/ocop/ocopService';
import { formatVND, withBaseUrl } from '@/lib/utils';
import placeholderImg from '@/assets/images/placeholder.png';

const BTN_GRADIENT = { background: 'linear-gradient(135deg, #0b66c3, #0ea5e9)' };
const HERO_BG = `linear-gradient(135deg,rgba(5,150,105,.92),rgba(3,95,172,.88),rgba(14,165,233,.78)), url("https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80") center/cover`;

/* Category labels extracted from API data */
const CATEGORY_LABELS = {
  thuoc_và_cskh: 'Thuốc & CSKH',
  thu_cong_my_nghe: 'Thủ công mỹ nghệ',
  thuc_pham: 'Thực phẩm',
  do_uong: 'Đồ uống',
  du_lich_dich_vu: 'Du lịch & Dịch vụ',
  my_pham: 'Mỹ phẩm',
  trang_tri: 'Trang trí',
  qua_tang: 'Quà tặng',
  nong_san: 'Nông sản',
  thao_duoc: 'Thảo dược',
  chan_nuoi: 'Chăn nuôi',
  may_mac: 'May mặc',
};

const CATEGORY_COLORS = {
  thuoc_và_cskh:    { bg: 'bg-purple-50',  text: 'text-purple-700', border: 'border-purple-200' },
  thu_cong_my_nghe: { bg: 'bg-amber-50',   text: 'text-amber-700',  border: 'border-amber-200'  },
  thuc_pham:        { bg: 'bg-green-50',   text: 'text-green-700',  border: 'border-green-200'  },
  do_uong:          { bg: 'bg-teal-50',    text: 'text-teal-700',   border: 'border-teal-200'   },
  my_pham:          { bg: 'bg-pink-50',    text: 'text-pink-700',   border: 'border-pink-200'   },
  nong_san:         { bg: 'bg-lime-50',    text: 'text-lime-700',   border: 'border-lime-200'   },
};

function getCategoryLabel(key) {
  if (!key) return '—';
  return CATEGORY_LABELS[key] || key.replace(/_/g, ' ');
}

function getCategoryColor(key) {
  return CATEGORY_COLORS[key] || {
    bg: 'bg-[#eef7ff]', text: 'text-[#0b66c3]', border: 'border-[#cfe0f4]',
  };
}

function getProductName(p) {
  return p?.name_vi || p?.name_en || p?.name || 'Sản phẩm OCOP';
}

function getProductStars(p) {
  return Math.min(5, Math.max(0, Number(p?.star_rating ?? 0)));
}


function OcopCard({ item, navigate }) {
  const name = getProductName(item);
  const stars = getProductStars(item);
  const imageSrc = withBaseUrl(item?.cover_image_url || '') || placeholderImg;
  const price = Number(item?.price_vnd);
  const priceLabel = Number.isFinite(price) && price > 0 ? formatVND(price) : null;
  const catConf = getCategoryColor(item?.category);

  return (
    <article
      onClick={() => item?.id && navigate(`/ocop/${item.id}`)}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-[18px] border border-[#cfe0f4] bg-white shadow-[0_4px_16px_rgba(13,74,130,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(13,74,130,0.15)]"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageSrc}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { e.target.onerror = null; e.target.src = placeholderImg; }}
        />

        {/* Star badge */}
        {stars > 0 && (
          <span className="absolute top-3 left-3 flex items-center gap-1 rounded-full border border-[#fde68a] bg-[#fef3c7]/95 px-2.5 py-0.5 text-xs font-bold text-[#b45309] backdrop-blur-sm">
            <Star size={10} className="fill-[#d99200] text-[#d99200]" />
            {stars} sao
          </span>
        )}

        {/* Category badge */}
        <span className={`absolute top-3 right-3 rounded-full border px-2.5 py-0.5 text-xs font-semibold backdrop-blur-sm ${catConf.bg} ${catConf.text} ${catConf.border}`}>
          {getCategoryLabel(item?.category)}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <h3
          className="line-clamp-2 text-sm font-black leading-snug text-foreground transition-colors group-hover:text-[#0b66c3]"
          title={name}
        >
          {name}
        </h3>

        {item?.producer_name && (
          <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
            {item.producer_name}
          </p>
        )}

        {item?.location_name || item?.province_name ? (
          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin size={10} className="shrink-0" />
            <span className="line-clamp-1">{item?.location_name || item?.province_name}</span>
          </div>
        ) : null}

        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {item?.description || 'Chưa có mô tả.'}
        </p>

        {/* Certification */}
        {item?.certification_no && (
          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <ShieldCheck size={11} className="shrink-0 text-[#10b981]" />
            <span className="truncate">{item.certification_no}</span>
          </div>
        )}

        {/* Price + CTA */}
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div>
            {priceLabel ? (
              <>
                <div className="text-base font-black text-[#0b66c3]">{priceLabel}</div>
                {item?.unit && (
                  <div className="text-[10px] text-muted-foreground">/ {item.unit}</div>
                )}
              </>
            ) : (
              <div className="text-sm font-semibold text-[#10b981]">Liên hệ</div>
            )}
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold text-[#0b66c3] group-hover:underline">
            Chi tiết <ArrowRight size={11} />
          </span>
        </div>
      </div>
    </article>
  );
}

function OcopCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-[18px] border border-[#cfe0f4] bg-white">
      <div className="bg-muted h-48 w-full" />
      <div className="space-y-2 p-4">
        <div className="bg-muted h-4 w-3/4 rounded" />
        <div className="bg-muted h-3 w-1/2 rounded" />
        <div className="bg-muted h-3 w-full rounded" />
        <div className="bg-muted h-3 w-2/3 rounded" />
      </div>
    </div>
  );
}

export default function OcopPageContent() {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [starFilter, setStarFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [debouncedSearch] = useDebounce(search.trim(), 400);

  const { data, isLoading, isError, isFetching, refetch } = useGetOcopProducts({
    page,
    limit: 12,
    search: debouncedSearch || undefined,
    category: categoryFilter !== 'all' ? categoryFilter : undefined,
    star_rating: starFilter !== 'all' ? starFilter : undefined,
  });

  const products = useMemo(() => data?.data?.items || data?.items || [], [data]);
  const pagination = useMemo(() => data?.data?.pagination || data?.pagination || null, [data]);
  const total = pagination?.total ?? products.length;
  const totalPages = pagination?.totalPages ?? 1;

  /* Extract unique categories from loaded products for chips */
  const availableCategories = useMemo(() => {
    const keys = [...new Set(products.map((p) => p?.category).filter(Boolean))];
    return keys;
  }, [products]);

  const averageStars = useMemo(() => {
    const vals = products.map(getProductStars).filter(Boolean);
    if (!vals.length) return null;
    return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
  }, [products]);

  const handleReset = () => {
    setSearch('');
    setCategoryFilter('all');
    setStarFilter('all');
    setPage(1);
  };

  return (
    <RootLayout>
      <div className="min-h-screen">
        {/* Hero */}
        <section className="px-6 py-10 text-white" style={{ background: HERO_BG }}>
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 max-w-2xl">
              <span className="mb-3 inline-flex rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                Chương trình OCOP – Mỗi xã một sản phẩm
              </span>
              <h1 className="mt-2 text-4xl font-black leading-tight tracking-tight">
                Sản phẩm OCOP Ninh Bình
              </h1>
              <p className="mt-2 text-sm font-medium leading-relaxed text-white/90">
                Khám phá đặc sản địa phương được chứng nhận OCOP 3–5 sao, từ thực phẩm, thảo dược đến thủ công mỹ nghệ.
              </p>
            </div>

            {/* Stats */}
            <div className="mb-6 flex flex-wrap gap-3">
              {[
                { value: total, label: 'Sản phẩm' },
                { value: availableCategories.length || '—', label: 'Danh mục' },
                { value: averageStars ? `${averageStars} ★` : '—', label: 'Sao TB' },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-white/25 bg-white/15 px-5 py-2.5 text-center backdrop-blur-sm"
                >
                  <div className="text-2xl font-black leading-none">{s.value}</div>
                  <div className="mt-0.5 text-xs text-white/80">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Search bar */}
            <div
              className="flex flex-col gap-3 rounded-3xl p-4 sm:flex-row sm:items-center"
              style={{
                background: 'rgba(255,255,255,0.94)',
                border: '1px solid rgba(255,255,255,0.75)',
                boxShadow: '0 12px 28px rgba(0,0,0,.14)',
              }}
            >
              <div className="relative min-w-0 flex-1">
                <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-[#52647a]" />
                <input
                  type="text"
                  placeholder="Tìm sản phẩm, nhà sản xuất..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="h-11 w-full rounded-xl border border-[#a8bed4] bg-white pl-9 pr-3 text-sm text-foreground outline-none focus:border-[#0b66c3]"
                />
              </div>
              <select
                value={starFilter}
                onChange={(e) => { setStarFilter(e.target.value); setPage(1); }}
                className="h-11 shrink-0 rounded-xl border border-[#a8bed4] bg-white px-3 text-sm text-foreground outline-none focus:border-[#0b66c3]"
              >
                <option value="all">Tất cả hạng sao</option>
                <option value="5">5 sao ★★★★★</option>
                <option value="4">4 sao ★★★★</option>
                <option value="3">3 sao ★★★</option>
              </select>
              <button
                type="button"
                onClick={() => { setPage(1); refetch?.(); }}
                className="h-11 shrink-0 rounded-xl px-5 text-sm font-bold text-white"
                style={BTN_GRADIENT}
              >
                Tìm kiếm
              </button>
            </div>
          </div>
        </section>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-4 py-5 md:px-6">

          {/* Category chips + toolbar */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => { setCategoryFilter('all'); setPage(1); }}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  categoryFilter === 'all'
                    ? 'bg-[#0b66c3] text-white'
                    : 'border border-[#cfe0f4] bg-white text-muted-foreground hover:bg-[#eef7ff]'
                }`}
              >
                Tất cả
              </button>
              {availableCategories.map((key) => {
                const conf = getCategoryColor(key);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => { setCategoryFilter(key); setPage(1); }}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                      categoryFilter === key
                        ? 'bg-[#0b66c3] text-white'
                        : `border ${conf.border} ${conf.bg} ${conf.text} hover:opacity-80`
                    }`}
                  >
                    {getCategoryLabel(key)}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">{total}</strong> sản phẩm
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="flex h-8 items-center gap-1.5 rounded-[8px] border border-[#cfe0f4] bg-white px-3 text-xs font-semibold text-muted-foreground hover:bg-[#eef7ff]"
              >
                <RefreshCw size={12} className={isFetching ? 'animate-spin' : ''} />
                Làm mới
              </button>
            </div>
          </div>

          {/* Product grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => <OcopCardSkeleton key={i} />)}
            </div>
          ) : isError ? (
            <div className="rounded-[18px] border border-[#cfe0f4] bg-white py-20 text-center text-muted-foreground">
              Không thể tải dữ liệu OCOP lúc này.
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[18px] border border-[#cfe0f4] bg-white py-20 text-muted-foreground">
              <Inbox size={40} className="mb-3 opacity-30" />
              <p className="text-base font-semibold text-foreground">Chưa có sản phẩm phù hợp</p>
              <p className="mt-1 text-sm">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((item) => (
                <OcopCard key={item?.id} item={item} navigate={navigate} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="flex h-9 items-center gap-1.5 rounded-[10px] border border-[#cfe0f4] bg-white px-4 text-sm font-semibold disabled:opacity-40 hover:bg-[#eef7ff]"
              >
                <ChevronLeft size={15} /> Trước
              </button>
              <span className="rounded-full border border-[#cfe0f4] bg-white px-4 py-1.5 text-sm font-semibold">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="flex h-9 items-center gap-1.5 rounded-[10px] border border-[#cfe0f4] bg-white px-4 text-sm font-semibold disabled:opacity-40 hover:bg-[#eef7ff]"
              >
                Sau <ChevronRight size={15} />
              </button>
            </div>
          )}

          {/* Bottom CTA */}
          <div
            className="mt-10 overflow-hidden rounded-[22px] px-7 py-7 text-white"
            style={{ background: HERO_BG }}
          >
            <p className="mb-1 text-xs font-semibold text-white/75">Mua sắm trong hành trình</p>
            <h3 className="text-2xl font-black leading-tight">
              Kết hợp mua sản phẩm OCOP với hành trình du lịch Ninh Bình
            </h3>
            <p className="mt-1.5 text-sm text-white/85">
              Tìm điểm mua hàng trên bản đồ, liên kết với tour và điểm tham quan gần nhất.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                { label: 'Mở bản đồ', path: '/map' },
                { label: 'Xem tour', path: '/tour' },
                { label: 'Điểm tham quan', path: '/tourism-point' },
              ].map((item) => (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className="h-9 rounded-[10px] border border-white/35 bg-white/15 px-4 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/25"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}
