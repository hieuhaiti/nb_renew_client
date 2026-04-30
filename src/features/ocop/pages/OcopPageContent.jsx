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
    icon: '??',
    name: 'HTX Sinh Du?c Ninh Bình',
    description:
      'Chuyên các dòng trà th?o m?c, m? ph?m thiên nhiên và quà t?ng du l?ch g?n v?i hành trình sinh thái.',
  },
  {
    id: 'vendor-2',
    icon: '??',
    name: 'Trang tr?i Cúc Phuong',
    description:
      'Cung c?p m?t ong, du?c li?u và s?n ph?m thiên nhiên cho tuy?n du l?ch r?ng và ngh? du?ng.',
  },
  {
    id: 'vendor-3',
    icon: '??',
    name: 'Xu?ng G?m An Nhiên',
    description:
      'Phát tri?n s?n ph?m th? công cao c?p, phù h?p quà t?ng, trang trí và tr?i nghi?m làng ngh?.',
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
  return PROVINCE_LABELS[provinceCode] || `T?nh ${provinceCode}`;
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
      <div className="bg-background min-h-screen py-4 lg:py-6">
        <div className="mx-auto w-full px-4 sm:px-6 lg:w-[88%] lg:px-0">
          <section className="grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
            <Card className="border-border/70 relative gap-0 overflow-hidden rounded-3xl py-0 shadow-sm">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center" />
              <div className="from-card/95 via-card/88 to-card/82 absolute inset-0 bg-linear-to-r" />
              <CardContent className="relative px-6 py-8 sm:px-8 sm:py-9">
                <span className="typo-badge bg-primary/10 text-primary inline-flex rounded-full px-3 py-1">
                  Gian hàng OCOP g?n v?i di?m d?n du l?ch và tr?i nghi?m d?a phuong
                </span>

                <h1 className="typo-hero text-foreground mt-4 max-w-4xl">
                  Khám phá s?n ph?m OCOP d?c s?c, d? tìm, d? l?c và d? k?t n?i mua hàng.
                </h1>

                <p className="typo-body text-muted-foreground mt-3 max-w-3xl leading-relaxed">
                  Trang này t?p trung gi?i thi?u s?n ph?m OCOP theo d?a phuong, h?ng sao, danh m?c
                  và don v? cung c?p, d?ng th?i liên k?t ch?t v?i b?n d?, di?m du l?ch và uu dãi
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
                    Ðon v? cung c?p
                  </Button>
                </div>

                <div className="mt-6 grid gap-2 sm:grid-cols-3">
                  <div className="border-border/60 bg-card/90 rounded-2xl border p-4">
                    <p className="typo-kpi text-foreground">{total}</p>
                    <p className="typo-meta text-muted-foreground">S?n ph?m OCOP dang gi?i thi?u</p>
                  </div>
                  <div className="border-border/60 bg-card/90 rounded-2xl border p-4">
                    <p className="typo-kpi text-foreground">{FEATURED_VENDORS.length}</p>
                    <p className="typo-meta text-muted-foreground">Ðon v? cung c?p tiêu bi?u</p>
                  </div>
                  <div className="border-border/60 bg-card/90 rounded-2xl border p-4">
                    <p className="typo-kpi text-foreground">
                      {averageRating ? `${averageRating.toFixed(1)}/5` : '--'}
                    </p>
                    <p className="typo-meta text-muted-foreground">Ði?m hài lòng trung bình</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/70 gap-0 rounded-3xl py-0 shadow-sm">
              <CardContent className="px-5 py-5">
                <SectionHeading title="Ði?m nh?n hôm nay" />

                <div className="mt-4 grid gap-3">
                  <div className="border-border/70 bg-primary/5 flex gap-3 rounded-2xl border p-4">
                    <div className="bg-card grid h-12 w-12 place-content-center rounded-2xl">
                      <Gift className="text-primary h-5 w-5" />
                    </div>
                    <div>
                      <p className="typo-section-title text-foreground">Combo quà t?ng du l?ch</p>
                      <p className="typo-meta text-muted-foreground mt-1">
                        G?i ý gi? quà OCOP cho du khách v?i m?c giá theo ngân sách.
                      </p>
                    </div>
                  </div>

                  <div className="border-border/70 bg-secondary/8 flex gap-3 rounded-2xl border p-4">
                    <div className="bg-card grid h-12 w-12 place-content-center rounded-2xl">
                      <Sparkles className="text-secondary h-5 w-5" />
                    </div>
                    <div>
                      <p className="typo-section-title text-foreground">L?c theo h?ng sao</p>
                      <p className="typo-meta text-muted-foreground mt-1">
                        Tìm nhanh s?n ph?m 3 sao, 4 sao, 5 sao theo t?nh và nhóm ngành.
                      </p>
                    </div>
                  </div>

                  <div className="border-border/70 bg-warning/8 flex gap-3 rounded-2xl border p-4">
                    <div className="bg-card grid h-12 w-12 place-content-center rounded-2xl">
                      <MapPinned className="text-warning h-5 w-5" />
                    </div>
                    <div>
                      <p className="typo-section-title text-foreground">G?n v?i di?m tham quan</p>
                      <p className="typo-meta text-muted-foreground mt-1">
                        M?i s?n ph?m liên k?t v?i di?m du l?ch d? g?i ý mua s?m theo hành trình.
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
                  title="B? l?c s?n ph?m"
                  description="Tìm theo tên, d?a phuong, h?ng sao và danh m?c"
                />

                <div className="grid gap-3 lg:grid-cols-[2fr_1.2fr_1fr_1fr_auto]">
                  <div className="space-y-1.5">
                    <label className="typo-meta text-muted-foreground">T? khóa</label>
                    <div className="relative">
                      <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                      <Input
                        value={keyword}
                        onChange={(event) => setKeyword(event.target.value)}
                        placeholder="Ví d?: trà, m?t ong, g?m, tinh d?u..."
                        className="h-11 pl-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="typo-meta text-muted-foreground">Ð?a phuong</label>
                    <Select value={provinceFilter} onValueChange={setProvinceFilter}>
                      <SelectTrigger className="h-11 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">T?t c? d?a phuong</SelectItem>
                        {provinces.map((item) => (
                          <SelectItem key={item} value={item}>
                            {PROVINCE_LABELS[item] || `T?nh ${item}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="typo-meta text-muted-foreground">H?ng sao</label>
                    <Select value={starFilter} onValueChange={setStarFilter}>
                      <SelectTrigger className="h-11 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">T?t c?</SelectItem>
                        <SelectItem value="3">3 sao</SelectItem>
                        <SelectItem value="4">4 sao</SelectItem>
                        <SelectItem value="5">5 sao</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="typo-meta text-muted-foreground">Danh m?c</label>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="h-11 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">T?t c?</SelectItem>
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
                      Làm m?i
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
                    T?t c?
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
                title="S?n ph?m OCOP n?i b?t"
                description={`Ðang hi?n th? ${filteredProducts.length} s?n ph?m phù h?p`}
              />
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => refetch?.()}
                disabled={isFetching}
              >
                {isFetching ? 'Ðang t?i...' : 'Làm m?i d? li?u'}
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
                Không th? t?i d? li?u OCOP lúc này.
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-muted-foreground py-12 text-center text-sm">
                Chua có s?n ph?m OCOP phù h?p.
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
                          <Star className="h-4 w-4" />
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
                          title={description || 'Chua có mô t?'}
                        >
                          {description || 'Chua có mô t?.'}
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
                            Xem chi ti?t
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
                  Uu dãi theo mùa du l?ch
                </span>
                <h3 className="mt-3 text-3xl leading-tight font-bold">
                  Mua quà d?a phuong ngay trong hành trình khám phá.
                </h3>
                <p className="text-primary-foreground/90 mt-2 text-sm">
                  K?t n?i gian hàng OCOP v?i b?n d? di?m d?n, khu tr?i nghi?m, nhà hàng và tour d?
                  du khách mua s?m thu?n ti?n hon.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    className="border-primary-foreground/50 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 rounded-xl"
                    onClick={() => navigate('/map')}
                  >
                    M? b?n d?
                  </Button>
                  <Button
                    variant="outline"
                    className="border-primary-foreground/50 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 rounded-xl"
                    onClick={() => navigate('/tourism-point')}
                  >
                    Xem di?m du l?ch
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/70 gap-0 rounded-3xl py-0 shadow-sm">
              <CardContent className="px-5 py-5">
                <SectionHeading
                  title="Danh m?c ph? bi?n"
                  description="Nhóm s?n ph?m du?c quan tâm nhi?u"
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
                title="Ðon v? cung c?p tiêu bi?u"
                description="Các co s? s?n xu?t và h?p tác xã g?n v?i du l?ch tr?i nghi?m"
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
                      Liên h? don v?
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
