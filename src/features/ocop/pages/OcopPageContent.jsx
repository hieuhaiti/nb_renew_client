import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Star } from 'lucide-react';
import RootLayout from '@/components/layout/RootLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OCOP_FLASH_ITEMS, OCOP_PRODUCTS, OCOP_VENDORS } from '@/features/ocop/data/ocopData';

function SectionHeading({ title, description }) {
  return (
    <div className="mb-4">
      <h2 className="text-foreground truncate text-2xl font-bold">{title}</h2>
      {description ? <p className="text-muted-foreground mt-1 text-sm">{description}</p> : null}
    </div>
  );
}

export default function OcopPage() {
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState('');
  const [provinceFilter, setProvinceFilter] = useState('all');
  const [starFilter, setStarFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [chipCategory, setChipCategory] = useState('all');

  const provinces = useMemo(() => [...new Set(OCOP_PRODUCTS.map((item) => item.province))], []);
  const categories = useMemo(() => [...new Set(OCOP_PRODUCTS.map((item) => item.category))], []);

  const filteredProducts = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return OCOP_PRODUCTS.filter((item) => {
      const haystack = [item.name, item.province, item.category, item.vendor, item.description]
        .join(' ')
        .toLowerCase();

      const matchedKeyword = !normalizedKeyword || haystack.includes(normalizedKeyword);
      const matchedProvince = provinceFilter === 'all' || item.province === provinceFilter;
      const matchedStars = starFilter === 'all' || String(item.stars) === starFilter;
      const matchedCategory = categoryFilter === 'all' || item.category === categoryFilter;
      const matchedChip = chipCategory === 'all' || item.category === chipCategory;

      return matchedKeyword && matchedProvince && matchedStars && matchedCategory && matchedChip;
    });
  }, [keyword, provinceFilter, starFilter, categoryFilter, chipCategory]);

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
          <section className="grid gap-4 lg:grid-cols-5">
            <Card className="border-border/70 relative gap-0 overflow-hidden rounded-3xl py-0 shadow-sm lg:col-span-3">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center" />
              <div className="absolute inset-0 bg-linear-to-r from-white/95 via-white/85 to-white/75" />
              <CardContent className="relative px-6 py-8 sm:px-8 sm:py-9">
                <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                  Gian hàng OCOP gắn với điểm đến du lịch và trải nghiệm địa phương
                </span>
                <h1 className="text-foreground mt-4 max-w-4xl text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                  Khám phá sản phẩm OCOP đặc sắc, dễ tìm, dễ lọc và dễ kết nối mua hàng.
                </h1>
                <p className="text-muted-foreground mt-3 max-w-3xl text-sm leading-relaxed sm:text-base">
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
                  <div className="border-border/60 rounded-2xl border bg-white/90 p-4">
                    <p className="text-2xl font-bold">128</p>
                    <p className="text-muted-foreground text-xs font-medium">
                      Sản phẩm OCOP đang giới thiệu
                    </p>
                  </div>
                  <div className="border-border/60 rounded-2xl border bg-white/90 p-4">
                    <p className="text-2xl font-bold">34</p>
                    <p className="text-muted-foreground text-xs font-medium">
                      Đơn vị cung cấp địa phương
                    </p>
                  </div>
                  <div className="border-border/60 rounded-2xl border bg-white/90 p-4">
                    <p className="text-2xl font-bold">4.8/5</p>
                    <p className="text-muted-foreground text-xs font-medium">
                      Điểm hài lòng trung bình
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/70 gap-0 rounded-3xl py-0 shadow-sm lg:col-span-2">
              <CardHeader className="px-5 pt-5 pb-0">
                <CardTitle className="text-xl">Điểm nhấn hôm nay</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 px-5 py-5">
                {OCOP_FLASH_ITEMS.map((item) => (
                  <div
                    key={item.id}
                    className="border-border/60 flex gap-3 rounded-2xl border bg-linear-to-r from-sky-50 to-white p-3"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-xl">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold">{item.title}</h3>
                      <p className="text-muted-foreground line-clamp-3 text-sm">{item.text}</p>
                    </div>
                  </div>
                ))}
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
                    <label className="text-muted-foreground text-xs font-semibold">Từ khóa</label>
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
                    <label className="text-muted-foreground text-xs font-semibold">
                      Địa phương
                    </label>
                    <Select value={provinceFilter} onValueChange={setProvinceFilter}>
                      <SelectTrigger className="h-11 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả địa phương</SelectItem>
                        {provinces.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-muted-foreground text-xs font-semibold">Hạng sao</label>
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
                    <label className="text-muted-foreground text-xs font-semibold">Danh mục</label>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="h-11 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        {categories.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
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
                      {item}
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
                onClick={() =>
                  document.getElementById('ocop-vendors')?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                Xem đơn vị cung cấp
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {filteredProducts.map((item) => (
                <Card
                  key={item.id}
                  className="border-border/70 gap-0 overflow-hidden rounded-2xl py-0 shadow-sm"
                >
                  <div className="relative h-52">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold">
                      {'★'.repeat(item.stars)} · {item.stars} sao
                    </span>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute top-3 right-3 h-9 w-9 rounded-full"
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardContent className="px-4 py-4">
                    <div className="text-muted-foreground flex items-center justify-between text-xs font-semibold">
                      <span>{item.province}</span>
                      <span>{item.rating} ★</span>
                    </div>
                    <h3 className="mt-2 truncate text-base font-bold">{item.name}</h3>
                    <p className="text-muted-foreground line-clamp-3 text-sm">{item.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-2">
                      <strong className="text-lg font-bold text-orange-500">{item.price}</strong>
                      <Button size="sm" variant="outline" className="rounded-lg">
                        Xem chi tiết
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
            <Card className="gap-0 rounded-3xl border-0 bg-linear-to-r from-blue-500 to-violet-500 py-0 text-white shadow-sm">
              <CardContent className="px-6 py-6 sm:px-7">
                <span className="inline-flex rounded-full border border-white/40 bg-white/10 px-3 py-1 text-xs font-semibold">
                  Ưu đãi theo mùa du lịch
                </span>
                <h3 className="mt-3 text-3xl leading-tight font-bold">
                  Mua quà địa phương ngay trong hành trình khám phá.
                </h3>
                <p className="mt-2 text-sm text-white/90">
                  Kết nối gian hàng OCOP với bản đồ điểm đến, khu trải nghiệm, nhà hàng và tour để
                  du khách mua sắm thuận tiện hơn.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    className="rounded-xl border-white/50 bg-white/10 text-white hover:bg-white/20"
                    onClick={() => navigate('/map')}
                  >
                    Mở bản đồ
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-xl border-white/50 bg-white/10 text-white hover:bg-white/20"
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
                <div className="flex flex-wrap gap-2">
                  {[
                    'Đặc sản thực phẩm',
                    'Đồ uống',
                    'Thảo dược',
                    'Thủ công mỹ nghệ',
                    'Quà tặng du lịch',
                    'Sản phẩm sinh thái',
                  ].map((item, index) => (
                    <Button
                      key={item}
                      size="sm"
                      variant={index === 0 ? 'default' : 'outline'}
                      className="rounded-full"
                    >
                      {item}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          <section id="ocop-vendors" className="mt-6 pb-4">
            <SectionHeading
              title="Đơn vị cung cấp tiêu biểu"
              description="Các cơ sở sản xuất và hợp tác xã gắn với du lịch trải nghiệm"
            />
            <div className="grid gap-4 lg:grid-cols-3">
              {OCOP_VENDORS.map((vendor) => (
                <Card key={vendor.id} className="border-border/70 gap-0 rounded-2xl py-0 shadow-sm">
                  <CardContent className="flex gap-3 px-4 py-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-2xl">
                      {vendor.icon}
                    </div>
                    <div>
                      <h3 className="font-bold">{vendor.name}</h3>
                      <p className="text-muted-foreground line-clamp-3 text-sm">{vendor.info}</p>
                      <Button variant="outline" size="sm" className="mt-3 rounded-lg">
                        Liên hệ đơn vị
                      </Button>
                    </div>
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
