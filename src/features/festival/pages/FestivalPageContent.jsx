import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, MapPin, Search, Repeat2, Globe } from 'lucide-react';
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
import { useFestivalsQuery, useFestivalTypesQuery } from '@/services/api/map/festivalService';
import { withBaseUrl } from '@/lib/utils';
import placeholderImg from '@/assets/images/placeholder.png';

const FESTIVAL_TYPE_LABELS = {
  traditional: 'Truyền thống',
  cultural: 'Văn hóa',
  religious: 'Tôn giáo',
  folk: 'Dân gian',
  modern: 'Hiện đại',
  seasonal: 'Theo mùa',
};

const FESTIVAL_HIGHLIGHTS = [
  {
    id: 'highlight-1',
    icon: <CalendarDays className="h-5 w-5" />,
    title: 'Lịch lễ hội theo năm',
    description: 'Theo dõi toàn bộ lịch lễ hội trong năm, từ truyền thống đến hiện đại.',
    colorClass: 'bg-primary/5',
    iconColorClass: 'text-primary',
  },
  {
    id: 'highlight-2',
    icon: <Repeat2 className="h-5 w-5" />,
    title: 'Lễ hội định kỳ',
    description: 'Nhiều lễ hội diễn ra hàng năm, giúp du khách dễ lên kế hoạch trước.',
    colorClass: 'bg-secondary/8',
    iconColorClass: 'text-secondary',
  },
  {
    id: 'highlight-3',
    icon: <Globe className="h-5 w-5" />,
    title: 'Gắn với điểm tham quan',
    description: 'Mỗi lễ hội liên kết địa điểm thực tế và bản đồ để dễ tìm đường.',
    colorClass: 'bg-warning/8',
    iconColorClass: 'text-warning',
  },
];

function SectionHeading({ title, description }) {
  return (
    <div>
      <h2 className="typo-card-title text-foreground truncate">{title}</h2>
      {description ? <p className="typo-body text-muted-foreground mt-1">{description}</p> : null}
    </div>
  );
}

function getFestivalName(festival) {
  return festival?.name_vi || festival?.name_en || festival?.name || 'Lễ hội';
}

function getFestivalDescription(festival) {
  return festival?.description_vi || festival?.description_en || festival?.description || '';
}

function getFestivalTypeLabel(type) {
  if (!type) return '--';
  return FESTIVAL_TYPE_LABELS[type] || type;
}

function formatDate(dateStr) {
  if (!dateStr) return '--';
  try {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export default function FestivalPageContent() {
  const navigate = useNavigate();
  const fallbackImage = withBaseUrl(placeholderImg);

  const [keyword, setKeyword] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [upcomingFilter, setUpcomingFilter] = useState('upcoming');
  const [chipType, setChipType] = useState('all');
  const [debouncedKeyword] = useDebounce(keyword.trim(), 400);

  const upcoming =
    upcomingFilter === 'upcoming' ? true : upcomingFilter === 'past' ? false : undefined;

  const { data, isLoading, isError, isFetching, refetch } = useFestivalsQuery({
    page: 1,
    limit: 12,
    search: debouncedKeyword || undefined,
    festival_type: typeFilter !== 'all' ? typeFilter : undefined,
    upcoming: typeof upcoming === 'boolean' ? upcoming : undefined,
  });

  const { data: typesData } = useFestivalTypesQuery();

  const festivals = useMemo(() => {
    if (!data) return [];
    return data?.data?.items || data?.items || [];
  }, [data]);

  const typeOptions = useMemo(() => {
    const rawValue =
      typesData?.data?.items ||
      typesData?.data?.types ||
      typesData?.items ||
      typesData?.types ||
      typesData?.data ||
      [];
    const raw = Array.isArray(rawValue) ? rawValue : [];

    return raw
      .map((item) => {
        const key = String(
          item?.code ||
            item?.type ||
            item?.slug ||
            item?.value ||
            item?.key ||
            item?.id ||
            item?.name ||
            ''
        ).trim();
        if (!key) return null;
        return {
          key,
          label:
            item?.name_vi ||
            item?.name_en ||
            item?.label ||
            item?.name ||
            FESTIVAL_TYPE_LABELS[key] ||
            key,
        };
      })
      .filter(Boolean);
  }, [typesData]);

  const allTypeKeys = useMemo(() => {
    if (typeOptions.length) return typeOptions.map((t) => t.key);
    const fromFestivals = festivals.map((f) => f?.festival_type).filter(Boolean);
    return [...new Set(fromFestivals)];
  }, [typeOptions, festivals]);

  const typeLabelMap = useMemo(() => {
    const base = { ...FESTIVAL_TYPE_LABELS };
    typeOptions.forEach((item) => {
      if (item?.key) base[item.key] = item.label;
    });
    return base;
  }, [typeOptions]);

  const filteredFestivals = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return festivals.filter((festival) => {
      const type = festival?.festival_type || '';
      const searchText = [
        getFestivalName(festival),
        getFestivalDescription(festival),
        festival?.location_name || '',
        getFestivalTypeLabel(type),
      ]
        .join(' ')
        .toLowerCase();

      const matchKeyword = !normalizedKeyword || searchText.includes(normalizedKeyword);
      const matchType = typeFilter === 'all' || type === typeFilter;
      const matchChip = chipType === 'all' || type === chipType;

      return matchKeyword && matchType && matchChip;
    });
  }, [festivals, keyword, typeFilter, chipType]);

  const total = data?.data?.pagination?.total || festivals.length;

  const upcomingCount = useMemo(() => {
    const now = new Date();
    return festivals.filter((f) => f?.start_date && new Date(f.start_date) >= now).length;
  }, [festivals]);

  const handleReset = () => {
    setKeyword('');
    setTypeFilter('all');
    setUpcomingFilter('upcoming');
    setChipType('all');
  };

  return (
    <RootLayout>
      <div className="bg-background min-h-screen py-4 sm:py-5 lg:py-6">
        <div className="mx-auto w-full px-4 sm:px-6 lg:w-[80%] lg:px-0 xl:w-[70%] 2xl:w-[60%]">
          {/* Hero */}
          <section className="grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
            <Card className="border-border/70 relative gap-0 overflow-hidden rounded-3xl py-0 shadow-sm">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center" />
              <div className="from-card/95 via-card/88 to-card/82 absolute inset-0 bg-linear-to-r" />
              <CardContent className="relative px-6 py-8 sm:px-8 sm:py-9">
                <span className="typo-badge bg-primary/10 text-primary inline-flex rounded-full px-3 py-1">
                  Khám phá lễ hội truyền thống và văn hóa Ninh Bình
                </span>

                <h1 className="typo-hero text-foreground mt-4 max-w-4xl">
                  Trải nghiệm lễ hội đặc sắc, tìm kiếm và lên lịch tham dự dễ dàng.
                </h1>

                <p className="typo-body text-muted-foreground mt-3 max-w-3xl leading-relaxed">
                  Tổng hợp các lễ hội truyền thống, văn hóa và du lịch tại Ninh Bình theo thời gian,
                  địa điểm và loại hình. Dễ dàng tra cứu và lên kế hoạch tham quan.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button
                    className="rounded-xl"
                    onClick={() =>
                      document
                        .getElementById('festival-list')
                        ?.scrollIntoView({ behavior: 'smooth' })
                    }
                  >
                    Xem danh sách lễ hội
                  </Button>
                  <Button variant="outline" className="rounded-xl" onClick={() => navigate('/map')}>
                    Mở bản đồ
                  </Button>
                </div>

                <div className="mt-6 grid gap-2 sm:grid-cols-3">
                  <div className="border-border/60 bg-card/90 rounded-2xl border p-4">
                    <p className="typo-kpi text-foreground">{total}</p>
                    <p className="typo-meta text-muted-foreground">Lễ hội đang giới thiệu</p>
                  </div>
                  <div className="border-border/60 bg-card/90 rounded-2xl border p-4">
                    <p className="typo-kpi text-foreground">{upcomingCount}</p>
                    <p className="typo-meta text-muted-foreground">Lễ hội sắp diễn ra</p>
                  </div>
                  <div className="border-border/60 bg-card/90 rounded-2xl border p-4">
                    <p className="typo-kpi text-foreground">{allTypeKeys.length || '--'}</p>
                    <p className="typo-meta text-muted-foreground">Loại hình lễ hội</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/70 gap-0 rounded-3xl py-0 shadow-sm">
              <CardContent className="px-5 py-5">
                <SectionHeading title="Điểm nổi bật" />
                <div className="mt-4 grid gap-3">
                  {FESTIVAL_HIGHLIGHTS.map((item) => (
                    <div
                      key={item.id}
                      className={`border-border/70 flex gap-3 rounded-2xl border p-4 ${item.colorClass}`}
                    >
                      <div className="bg-card grid h-12 w-12 place-content-center rounded-2xl">
                        <span className={item.iconColorClass}>{item.icon}</span>
                      </div>
                      <div>
                        <p className="typo-section-title text-foreground">{item.title}</p>
                        <p className="typo-meta text-muted-foreground mt-1">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Filters */}
          <section className="mt-4">
            <Card className="border-border/70 gap-0 rounded-3xl py-0 shadow-sm">
              <CardContent className="space-y-4 px-5 py-5">
                <SectionHeading
                  title="Bộ lọc lễ hội"
                  description="Tìm theo tên, loại hình và thời gian"
                />

                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-[2fr_1.2fr_1fr_auto]">
                  <div className="space-y-1.5">
                    <label className="typo-meta text-muted-foreground">Từ khóa</label>
                    <div className="relative">
                      <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                      <Input
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Ví dụ: Hoa Lư, chùa Bái Đính, đình làng..."
                        className="h-11 pl-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="typo-meta text-muted-foreground">Loại lễ hội</label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="h-11 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả loại</SelectItem>
                        {allTypeKeys.map((key) => (
                          <SelectItem key={key} value={key}>
                            {getFestivalTypeLabel(key) !== key
                              ? getFestivalTypeLabel(key)
                              : typeLabelMap[key] || key}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="typo-meta text-muted-foreground">Thời gian</label>
                    <Select value={upcomingFilter} onValueChange={setUpcomingFilter}>
                      <SelectTrigger className="h-11 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upcoming">Sắp diễn ra</SelectItem>
                        <SelectItem value="past">Đã qua</SelectItem>
                        <SelectItem value="all">Tất cả</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end md:col-span-2 lg:col-span-1">
                    <Button className="h-11 w-full rounded-xl lg:w-auto" onClick={handleReset}>
                      Làm mới
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant={chipType === 'all' ? 'default' : 'outline'}
                    className="rounded-full"
                    onClick={() => setChipType('all')}
                  >
                    Tất cả
                  </Button>
                  {allTypeKeys.map((key) => (
                    <Button
                      key={key}
                      size="sm"
                      variant={chipType === key ? 'default' : 'outline'}
                      className="rounded-full"
                      onClick={() => setChipType(key)}
                    >
                      {typeLabelMap[key] || key}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Festival list */}
          <section id="festival-list" className="mt-6">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <SectionHeading
                title="Danh sách lễ hội"
                description={`Đang hiển thị ${filteredFestivals.length} lễ hội phù hợp`}
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
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={`festival-skeleton-${index}`}
                    className="border-border/70 bg-card h-72 animate-pulse rounded-2xl border"
                  />
                ))}
              </div>
            ) : isError ? (
              <div className="text-destructive py-12 text-center text-sm">
                Không thể tải dữ liệu lễ hội lúc này.
              </div>
            ) : filteredFestivals.length === 0 ? (
              <div className="text-muted-foreground py-12 text-center text-sm">
                Chưa có lễ hội phù hợp với bộ lọc hiện tại.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredFestivals.map((festival) => {
                  const name = getFestivalName(festival);
                  const description = getFestivalDescription(festival);
                  const imageSrc = withBaseUrl(festival?.cover_image_url || '') || fallbackImage;
                  const typeLabel =
                    typeLabelMap[festival?.festival_type] || festival?.festival_type || '--';
                  const startDate = formatDate(festival?.start_date);
                  const endDate = formatDate(festival?.end_date);
                  const locationName = festival?.location_name || '--';
                  const isRecurring = Boolean(festival?.is_recurring);

                  return (
                    <Card
                      key={festival?.id || name}
                      className="border-border/70 group cursor-pointer gap-0 overflow-hidden rounded-2xl border py-0 shadow-sm transition-shadow hover:shadow-md"
                      onClick={() => {
                        if (festival?.id) navigate(`/festival/${festival.id}`);
                      }}
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

                        <span className="typo-badge bg-card/90 text-foreground absolute top-3 left-3 rounded-full px-2.5 py-1">
                          {typeLabel}
                        </span>

                        {isRecurring && (
                          <span className="typo-badge bg-primary/90 text-primary-foreground absolute top-3 right-3 flex items-center gap-1 rounded-full px-2.5 py-1">
                            <Repeat2 className="h-3 w-3" />
                            Hàng năm
                          </span>
                        )}
                      </div>

                      <CardContent className="px-4 py-4">
                        <div className="typo-meta text-muted-foreground flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate" title={locationName}>
                            {locationName}
                          </span>
                        </div>

                        <h3
                          className="typo-section-title text-foreground mt-2 truncate"
                          title={name}
                        >
                          {name}
                        </h3>

                        <p
                          className="typo-body text-muted-foreground mt-1 line-clamp-2"
                          title={description || 'Chưa có mô tả'}
                        >
                          {description || 'Chưa có mô tả.'}
                        </p>

                        <div className="border-border/60 bg-muted/30 mt-3 flex items-center gap-1.5 rounded-xl border px-3 py-2">
                          <CalendarDays className="text-primary h-3.5 w-3.5 shrink-0" />
                          <span className="typo-meta text-foreground">
                            {startDate}
                            {endDate && endDate !== startDate ? ` – ${endDate}` : ''}
                          </span>
                        </div>

                        <div className="mt-3 flex items-center justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-lg"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (festival?.id) navigate(`/festival/${festival.id}`);
                            }}
                            disabled={!festival?.id}
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

          {/* Bottom CTA */}
          <section className="mt-6">
            <Card className="from-primary/90 via-primary to-secondary/90 text-primary-foreground gap-0 rounded-3xl border-0 bg-linear-to-r py-0 shadow-sm">
              <CardContent className="px-6 py-6 sm:px-7">
                <span className="typo-badge border-primary-foreground/40 bg-primary-foreground/10 text-primary-foreground inline-flex rounded-full border px-3 py-1">
                  Lên kế hoạch tham quan cùng lễ hội
                </span>
                <h3 className="mt-3 text-3xl leading-tight font-bold">
                  Kết hợp lễ hội với hành trình du lịch Ninh Bình.
                </h3>
                <p className="text-primary-foreground/90 mt-2 text-sm">
                  Xem bản đồ địa điểm, tour tham quan và điểm du lịch để có chuyến đi trọn vẹn hơn.
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
                    onClick={() => navigate('/tour')}
                  >
                    Xem tour du lịch
                  </Button>
                  <Button
                    variant="outline"
                    className="border-primary-foreground/50 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 rounded-xl"
                    onClick={() => navigate('/tourism-point')}
                  >
                    Điểm tham quan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </RootLayout>
  );
}
