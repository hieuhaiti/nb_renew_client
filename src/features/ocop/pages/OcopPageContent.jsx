import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift, MapPinned, Search, Sparkles, Star } from 'lucide-react';
import { useDebounce } from 'use-debounce';
import RootLayout from '@/components/layout/RootLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetOcopCategories, useGetOcopProducts } from '@/services/api/ocop/ocopService';
import { formatVND, withBaseUrl } from '@/lib/utils';
import placeholderImg from '@/assets/images/placeholder.png';

const PROVINCE_LABELS = {
  37: 'Ninh Bình',
};

const FEATURED_VENDORS = [
  {
    id: 'vendor-1',
    icon: '🌿',
    name: 'HTX Sinh Dược Ninh Bình',
    description:
      'Chuyên các dòng trà thảo mộc, mỹ phẩm thiên nhiên và quà tặng du lịch gắn với hành trình sinh thái.',
  },
  {
    id: 'vendor-2',
    icon: '🍯',
    name: 'Trang trại Cúc Phương',
    description:
      'Cung cấp mật ong, dược liệu và sản phẩm thiên nhiên cho tuyến du lịch rừng và nghỉ dưỡng.',
  },
  {
    id: 'vendor-3',
    icon: '🏺',
    name: 'Xưởng Gốm An Nhiên',
    description:
      'Phát triển sản phẩm thủ công cao cấp, phù hợp quà tặng, trang trí và trải nghiệm làng nghề.',
  },
];

const DEFAULT_POPULAR_CATEGORY_KEYS = ['food', 'beverage', 'herbal', 'craft', 'souvenir', 'eco'];

function getCategoryLabel(category, labelMap = {}) {
  if (!category) return '--';
  return labelMap[category] || category;
}

function getProvinceLabel(product) {
  const provinceCode = String(product?.province_code || '').trim();
  if (!provinceCode) return '--';
  return PROVINCE_LABELS[provinceCode] || `Tỉnh ${provinceCode}`;
}

function getProductName(product) {
  return product?.name_vi || product?.name_en || product?.name || 'OCOP';
}

function getProductDescription(product) {
  return product?.description_vi || product?.description_en || product?.description || '';
}

function getProductStars(product) {
  const value = Number(product?.star_rating || product?.stars || 0);
  return Number.isFinite(value) ? value : 0;
}

function SectionHeading({ title, description }) {
  return (
    <div>
      <h2 className="typo-card-title text-foreground truncate">{title}</h2>
      {description ? <p className="typo-body text-muted-foreground mt-1">{description}</p> : null}
    </div>
  );
}

export default function OcopPageContent() {
  const navigate = useNavigate();
  const fallbackImage = withBaseUrl(placeholderImg);

  const [keyword, setKeyword] = useState('');
  const [provinceFilter, setProvinceFilter] = useState('all');
  const [starFilter, setStarFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [chipCategory, setChipCategory] = useState('all');
  const [debouncedKeyword] = useDebounce(keyword.trim(), 400);

  const { data, isLoading, isError, isFetching, refetch } = useGetOcopProducts({
    page: 1,
    limit: 12,
    search: debouncedKeyword || undefined,
    category: categoryFilter !== 'all' ? categoryFilter : undefined,
    province_code: provinceFilter !== 'all' ? provinceFilter : undefined,
    star_rating: starFilter !== 'all' ? starFilter : undefined,
  });

  const { data: categoriesData } = useGetOcopCategories();

  const products = useMemo(() => {
    if (!data) return [];
    return data?.data?.items || data?.items || [];
  }, [data]);

  const categoryOptions = useMemo(() => {
    const rawValue =
      categoriesData?.data?.items ||
      categoriesData?.data?.categories ||
      categoriesData?.items ||
      categoriesData?.categories ||
      categoriesData?.data ||
      [];
    const raw = Array.isArray(rawValue) ? rawValue : [];

    return raw
      .map((item) => {
        const key = String(
          item?.code ||
            item?.category ||
            item?.slug ||
            item?.value ||
            item?.key ||
            item?.id ||
            item?.name ||
            item?.name_vi ||
            item?.name_en ||
            ''
        ).trim();

        if (!key) return null;

        return {
          key,
          label:
            item?.name_vi ||
            item?.name_en ||
            item?.display_name ||
            item?.label ||
            item?.name ||
            key,
        };
      })
      .filter(Boolean);
  }, [categoriesData]);

  const productCategoryKeys = useMemo(() => {
    const values = products.map((item) => item?.category).filter(Boolean);
    return [...new Set(values)];
  }, [products]);

  const categories = useMemo(() => {
    if (categoryOptions.length) {
      return categoryOptions.map((item) => item.key);
    }
    return productCategoryKeys;
  }, [categoryOptions, productCategoryKeys]);

  const popularCategories = useMemo(() => {
    if (categories.length) return categories.slice(0, 6);
    return DEFAULT_POPULAR_CATEGORY_KEYS;
  }, [categories]);

  const categoryLabelMap = useMemo(() => {
    return categoryOptions.reduce((acc, item) => {
      if (item?.key && !acc[item.key]) {
        acc[item.key] = item.label;
      }
      return acc;
    }, {});
  }, [categoryOptions]);

  const provinces = useMemo(() => {
    const values = products.map((item) => String(item?.province_code || '').trim()).filter(Boolean);
    return [...new Set(values)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return products.filter((product) => {
      const star = getProductStars(product);
      const category = product?.category || '';
      const provinceCode = String(product?.province_code || '').trim();
      const searchText = [
        getProductName(product),
        getProductDescription(product),
        product?.producer_name || '',
        getCategoryLabel(category, categoryLabelMap),
      ]
        .join(' ')
        .toLowerCase();

      const matchKeyword = !normalizedKeyword || searchText.includes(normalizedKeyword);
      const matchProvince = provinceFilter === 'all' || provinceCode === provinceFilter;
      const matchStar = starFilter === 'all' || String(star) === starFilter;
      const matchCategory = categoryFilter === 'all' || category === categoryFilter;
      const matchChip = chipCategory === 'all' || category === chipCategory;

      return matchKeyword && matchProvince && matchStar && matchCategory && matchChip;
    });
  }, [
    products,
    keyword,
    provinceFilter,
    starFilter,
    categoryFilter,
    chipCategory,
    categoryLabelMap,
  ]);

  const total = data?.data?.pagination?.total || products.length;

  const averageRating = useMemo(() => {
    const values = products.map((item) => getProductStars(item)).filter((value) => value > 0);
    if (!values.length) return null;
    const sum = values.reduce((acc, value) => acc + value, 0);
    return sum / values.length;
  }, [products]);

  const handleReset = () => {
    setKeyword('');
    setProvinceFilter('all');
    setStarFilter('all');
    setCategoryFilter('all');
    setChipCategory('all');
  };

  return (
    <RootLayout>
      <div className="bg-background min-h-screen py-4 sm:py-5 lg:py-6">
        <div className="mx-auto w-full px-4 sm:px-6 lg:w-[80%] lg:px-0 xl:w-[70%] 2xl:w-[60%]">
          <section className="grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
            <Card className="border-border/70 relative gap-0 overflow-hidden rounded-3xl py-0 shadow-sm">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center" />
              <div className="from-card/95 via-card/88 to-card/82 absolute inset-0 bg-linear-to-r" />
              <CardContent className="relative px-6 py-8 sm:px-8 sm:py-9">
                <span className="typo-badge bg-primary/10 text-primary inline-flex rounded-full px-3 py-1">
                  Gian hàng OCOP gắn với điểm đến du lịch và trải nghiệm địa phương
                </span>

                <h1 className="typo-hero text-foreground mt-4 max-w-4xl">
                  Khám phá sản phẩm OCOP đặc sắc, dễ tìm, dễ lọc và dễ kết nối mua hàng.
                </h1>

                <p className="typo-body text-muted-foreground mt-3 max-w-3xl leading-relaxed">
                  Trang này tập trung giới thiệu sản phẩm OCOP theo địa phương, hạng sao, danh mục
                  và đơn vị cung cấp, đồng thời liên kết chặt với bản đồ, điểm du lịch và ưu đãi
                  theo mùa.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button
                    className="rounded-xl"
                    onClick={() =>
                      document
                        .getElementById('ocop-products')
                        ?.scrollIntoView({ behavior: 'smooth' })
                    }
                  >
                    Khám phá gian hàng
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-xl"
                    onClick={() =>
                      document
                        .getElementById('ocop-vendors')
                        ?.scrollIntoView({ behavior: 'smooth' })
                    }
                  >
                    Đơn vị cung cấp
                  </Button>
                </div>

                <div className="mt-6 grid gap-2 sm:grid-cols-3">
                  <div className="border-border/60 bg-card/90 rounded-2xl border p-4">
                    <p className="typo-kpi text-foreground">{total}</p>
                    <p className="typo-meta text-muted-foreground">Sản phẩm OCOP đang giới thiệu</p>
                  </div>
                  <div className="border-border/60 bg-card/90 rounded-2xl border p-4">
                    <p className="typo-kpi text-foreground">{FEATURED_VENDORS.length}</p>
                    <p className="typo-meta text-muted-foreground">Đơn vị cung cấp tiêu biểu</p>
                  </div>
                  <div className="border-border/60 bg-card/90 rounded-2xl border p-4">
                    <p className="typo-kpi text-foreground">
                      {averageRating ? `${averageRating.toFixed(1)}/5` : '--'}
                    </p>
                    <p className="typo-meta text-muted-foreground">Điểm hài lòng trung bình</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/70 gap-0 rounded-3xl py-0 shadow-sm">
              <CardContent className="px-5 py-5">
                <SectionHeading
                  title="Điểm nổi bật"
                  description="Gợi ý nhanh để du khách chọn đúng sản phẩm phù hợp hành trình"
                />

                <div className="mt-4 grid gap-3">
                  <div className="border-border/70 bg-primary/5 flex gap-3 rounded-2xl border p-4">
                    <div className="bg-card grid h-12 w-12 place-content-center rounded-2xl">
                      <Gift className="text-primary h-5 w-5" />
                    </div>
                    <div>
                      <p className="typo-section-title text-foreground">Combo quà tặng du lịch</p>
                      <p className="typo-meta text-muted-foreground mt-1">
                        Gợi ý giỏ quà OCOP cho du khách với mức giá theo ngân sách.
                      </p>
                    </div>
                  </div>

                  <div className="border-border/70 bg-secondary/8 flex gap-3 rounded-2xl border p-4">
                    <div className="bg-card grid h-12 w-12 place-content-center rounded-2xl">
                      <Sparkles className="text-secondary h-5 w-5" />
                    </div>
                    <div>
                      <p className="typo-section-title text-foreground">Lọc theo hạng sao</p>
                      <p className="typo-meta text-muted-foreground mt-1">
                        Tìm nhanh sản phẩm 3 sao, 4 sao, 5 sao theo tỉnh và nhóm ngành.
                      </p>
                    </div>
                  </div>

                  <div className="border-border/70 bg-warning/8 flex gap-3 rounded-2xl border p-4">
                    <div className="bg-card grid h-12 w-12 place-content-center rounded-2xl">
                      <MapPinned className="text-warning h-5 w-5" />
                    </div>
                    <div>
                      <p className="typo-section-title text-foreground">Gắn với điểm tham quan</p>
                      <p className="typo-meta text-muted-foreground mt-1">
                        Mỗi sản phẩm liên kết với điểm du lịch để gợi ý mua sắm theo hành trình.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="mt-4">
            <Card className="border-border/70 gap-0 rounded-3xl py-0 shadow-sm">
              <CardContent className="space-y-4 px-5 py-5">
                <SectionHeading
                  title="Bộ lọc sản phẩm"
                  description="Tìm theo tên, địa phương, hạng sao và danh mục"
                />

                <div className="grid gap-3 lg:grid-cols-[2fr_1.2fr_1fr_1fr_auto]">
                  <div className="space-y-1.5">
                    <label className="typo-meta text-muted-foreground">Từ khóa</label>
                    <div className="relative">
                      <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                      <Input
                        value={keyword}
                        onChange={(event) => setKeyword(event.target.value)}
                        placeholder="Ví dụ: trà, mật ong, gốm, tinh dầu..."
                        className="h-11 pl-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="typo-meta text-muted-foreground">Địa phương</label>
                    <Select value={provinceFilter} onValueChange={setProvinceFilter}>
                      <SelectTrigger className="h-11 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả địa phương</SelectItem>
                        {provinces.map((item) => (
                          <SelectItem key={item} value={item}>
                            {PROVINCE_LABELS[item] || `Tỉnh ${item}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="typo-meta text-muted-foreground">Hạng sao</label>
                    <Select value={starFilter} onValueChange={setStarFilter}>
                      <SelectTrigger className="h-11 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="3">3 sao</SelectItem>
                        <SelectItem value="4">4 sao</SelectItem>
                        <SelectItem value="5">5 sao</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="typo-meta text-muted-foreground">Danh mục</label>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="h-11 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        {categories.map((item) => (
                          <SelectItem key={item} value={item}>
                            {getCategoryLabel(item, categoryLabelMap)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button className="h-11 rounded-xl" onClick={handleReset}>
                      Làm mới
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant={chipCategory === 'all' ? 'default' : 'outline'}
                    className="rounded-full"
                    onClick={() => setChipCategory('all')}
                  >
                    Tất cả
                  </Button>

                  {categories.map((item) => (
                    <Button
                      key={item}
                      size="sm"
                      variant={chipCategory === item ? 'default' : 'outline'}
                      className="rounded-full"
                      onClick={() => setChipCategory(item)}
                    >
                      {getCategoryLabel(item, categoryLabelMap)}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          <section id="ocop-products" className="mt-6">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <SectionHeading
                title="Sản phẩm OCOP nổi bật"
                description={`Đang hiển thị ${filteredProducts.length} sản phẩm phù hợp`}
              />
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => refetch?.()}
                disabled={isFetching}
              >
                {isFetching ? 'Đang tải...' : 'Làm mới dữ liệu'}
              </Button>
            </div>

            {isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={`ocop-skeleton-${index}`}
                    className="border-border/70 bg-card h-72 animate-pulse rounded-2xl border"
                  />
                ))}
              </div>
            ) : isError ? (
              <div className="text-destructive py-12 text-center text-sm">
                Không thể tải dữ liệu OCOP lúc này.
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-muted-foreground py-12 text-center text-sm">
                Chưa có sản phẩm OCOP phù hợp.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {filteredProducts.map((item) => {
                  const name = getProductName(item);
                  const description = getProductDescription(item);
                  const stars = getProductStars(item);
                  const imageSrc = withBaseUrl(item?.cover_image_url || '') || fallbackImage;
                  const priceValue = Number(item?.price_vnd);
                  const priceLabel = Number.isFinite(priceValue) ? formatVND(priceValue) : '--';
                  const provinceLabel = getProvinceLabel(item);
                  const categoryLabel = getCategoryLabel(item?.category, categoryLabelMap);
                  const unitLabel = item?.unit || '--';

                  return (
                    <Card
                      key={item?.id || `${name}-${item?.created_at || ''}`}
                      className="border-border/70 gap-0 overflow-hidden rounded-2xl border py-0 shadow-sm"
                    >
                      <div className="relative h-52">
                        <img
                          src={imageSrc}
                          alt={name}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = placeholderImg;
                          }}
                        />

                        {stars > 0 ? (
                          <span className="typo-badge bg-card/90 text-foreground absolute top-3 left-3 rounded-full px-2.5 py-1">
                            {'?'.repeat(stars)} · {stars} sao
                          </span>
                        ) : null}

                        <Button
                          size="icon"
                          variant="secondary"
                          className="absolute top-3 right-3 h-9 w-9 rounded-full"
                        >
                          <Star className="fill-gold text-gold h-4 w-4" />
                        </Button>
                      </div>

                      <CardContent className="px-4 py-4">
                        <div className="typo-meta text-muted-foreground flex items-center justify-between gap-2">
                          <span title={provinceLabel} className="truncate">
                            {provinceLabel}
                          </span>
                          <span title={item?.producer_name || '--'} className="truncate">
                            {item?.producer_name || '--'}
                          </span>
                        </div>

                        <h3
                          className="typo-section-title text-foreground mt-2 truncate"
                          title={name}
                        >
                          {name}
                        </h3>

                        <p
                          className="typo-body text-muted-foreground line-clamp-3"
                          title={description || 'Chưa có mô tả'}
                        >
                          {description || 'Chưa có mô tả.'}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-1.5">
                          <span className="typo-badge bg-secondary/15 text-secondary rounded-full px-2 py-1">
                            {categoryLabel}
                          </span>
                          <span className="typo-badge bg-primary/10 text-primary rounded-full px-2 py-1">
                            {unitLabel}
                          </span>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-2">
                          <strong className="text-warning text-lg font-bold">{priceLabel}</strong>
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-lg"
                            onClick={() => {
                              if (item?.id) {
                                navigate(`/ocop/${item.id}`);
                              }
                            }}
                            disabled={!item?.id}
                          >
                            Xem chi tiết
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </section>

          <section className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
            <Card className="from-primary/90 via-primary to-secondary/90 text-primary-foreground gap-0 rounded-3xl border-0 bg-linear-to-r py-0 shadow-sm">
              <CardContent className="px-6 py-6 sm:px-7">
                <span className="typo-badge border-primary-foreground/40 bg-primary-foreground/10 text-primary-foreground inline-flex rounded-full border px-3 py-1">
                  Ưu đãi theo mùa du lịch
                </span>
                <h3 className="mt-3 text-3xl leading-tight font-bold">
                  Mua quà địa phương ngay trong hành trình khám phá.
                </h3>
                <p className="text-primary-foreground/90 mt-2 text-sm">
                  Kết nối gian hàng OCOP với bản đồ điểm đến, khu trải nghiệm, nhà hàng và tour để
                  du khách mua sắm thuận tiện hơn.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    className="border-primary-foreground/50 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 rounded-xl"
                    onClick={() => navigate('/map')}
                  >
                    Mở bản đồ
                  </Button>
                  <Button
                    variant="outline"
                    className="border-primary-foreground/50 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 rounded-xl"
                    onClick={() => navigate('/tourism-point')}
                  >
                    Xem điểm du lịch
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/70 gap-0 rounded-3xl py-0 shadow-sm">
              <CardContent className="px-5 py-5">
                <SectionHeading
                  title="Danh mục phổ biến"
                  description="Nhóm sản phẩm được quan tâm nhiều"
                />
                <div className="mt-4 flex flex-wrap gap-2">
                  {popularCategories.map((item, index) => (
                    <Button
                      key={item}
                      size="sm"
                      variant={index === 0 ? 'default' : 'outline'}
                      className="rounded-full"
                      onClick={() => {
                        setChipCategory(item);
                        setCategoryFilter(item);
                        document
                          .getElementById('ocop-products')
                          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                    >
                      {getCategoryLabel(item, categoryLabelMap)}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          <section id="ocop-vendors" className="mt-6">
            <div className="mb-4">
              <SectionHeading
                title="Đơn vị cung cấp tiêu biểu"
                description="Các cơ sở sản xuất và hợp tác xã gắn với du lịch trải nghiệm"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {FEATURED_VENDORS.map((vendor) => (
                <Card key={vendor.id} className="border-border/70 rounded-3xl shadow-sm">
                  <CardContent className="px-5 py-5">
                    <div className="flex gap-3">
                      <div className="bg-warning/15 grid h-14 w-14 place-content-center rounded-2xl text-2xl">
                        {vendor.icon}
                      </div>
                      <div className="min-w-0">
                        <h3
                          className="typo-section-title text-foreground truncate"
                          title={vendor.name}
                        >
                          {vendor.name}
                        </h3>
                        <p
                          className="typo-body text-muted-foreground mt-1 line-clamp-3"
                          title={vendor.description}
                        >
                          {vendor.description}
                        </p>
                      </div>
                    </div>

                    <Button variant="outline" className="mt-4 rounded-xl">
                      Liên hệ đơn vị
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    </RootLayout>
  );
}
