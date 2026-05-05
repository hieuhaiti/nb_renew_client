import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MessageCircle, Play, Search, Heart, Sparkles } from 'lucide-react';
import { useDebounce } from 'use-debounce';
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
import { Textarea } from '@/components/ui/textarea';
import { VLOG_INITIAL_POSTS, VLOG_TRENDING } from '@/features/vlog/data/vlogData';
import placeholderImg from '@/assets/images/placeholder.png';

function SectionHeading({ title, description }) {
  return (
    <div className="mb-4">
      <h2 className="text-foreground truncate text-2xl font-bold">{title}</h2>
      {description ? <p className="text-muted-foreground mt-1 text-sm">{description}</p> : null}
    </div>
  );
}

export default function VlogPage() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState(VLOG_INITIAL_POSTS);
  const [keyword, setKeyword] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [placeFilter, setPlaceFilter] = useState('all');
  const [topicFilter, setTopicFilter] = useState('all');
  const [debouncedKeyword] = useDebounce(keyword.trim(), 400);

  const [newTitle, setNewTitle] = useState('');
  const [newPlace, setNewPlace] = useState('Tràng An');
  const [newDescription, setNewDescription] = useState('');

  const places = useMemo(() => [...new Set(posts.map((item) => item.place))], [posts]);
  const topics = useMemo(() => [...new Set(posts.map((item) => item.topic))], [posts]);

  const filteredPosts = useMemo(() => {
    const normalizedKeyword = debouncedKeyword.toLowerCase();

    return posts.filter((item) => {
      const haystack = [
        item.title,
        item.place,
        item.type,
        item.topic,
        item.description,
        item.author,
      ]
        .join(' ')
        .toLowerCase();

      const matchedKeyword = !normalizedKeyword || haystack.includes(normalizedKeyword);
      const matchedType = typeFilter === 'all' || item.type === typeFilter;
      const matchedPlace = placeFilter === 'all' || item.place === placeFilter;
      const matchedTopic = topicFilter === 'all' || item.topic === topicFilter;

      return matchedKeyword && matchedType && matchedPlace && matchedTopic;
    });
  }, [posts, debouncedKeyword, typeFilter, placeFilter, topicFilter]);

  const handleResetFilter = () => {
    setKeyword('');
    setTypeFilter('all');
    setPlaceFilter('all');
    setTopicFilter('all');
  };

  const handlePublish = () => {
    const nextTitle = newTitle.trim();
    const nextDescription = newDescription.trim();

    if (!nextTitle || !nextDescription) {
      toast.warn('Vui lòng nhập tiêu đề và nội dung ngắn.');
      return;
    }

    const nextPost = {
      id: Date.now(),
      title: nextTitle,
      place: newPlace,
      type: 'Bài viết',
      topic: 'Trải nghiệm',
      author: 'Bạn',
      likes: 0,
      comments: 0,
      image:
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
      description: nextDescription,
      dateLabel: 'Vừa xong',
    };

    setPosts((prev) => [nextPost, ...prev]);
    setNewTitle('');
    setNewDescription('');
    setTopicFilter('all');
    toast.success('Đăng bài mô phỏng thành công.');
  };

  return (
    <RootLayout>
      <div className="bg-background min-h-screen py-4 lg:py-6">
        <div className="mx-auto w-full px-4 sm:px-6 lg:w-[88%] lg:px-0">
          <section className="grid gap-4 lg:grid-cols-5">
            <Card className="border-border/70 relative gap-0 overflow-hidden rounded-3xl py-0 shadow-sm lg:col-span-3">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center" />
              <div className="absolute inset-0 bg-linear-to-r from-white/95 via-white/85 to-white/75" />
              <CardContent className="relative px-6 py-8 sm:px-8 sm:py-9">
                <span className="inline-flex rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold text-pink-700">
                  Không gian cộng đồng cho trải nghiệm du lịch, ảnh đẹp và chia sẻ hành trình
                </span>
                <h1 className="text-foreground mt-4 max-w-4xl text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                  Khám phá bài viết, video và câu chuyện du lịch sống động từ cộng đồng.
                </h1>
                <p className="text-muted-foreground mt-3 max-w-3xl text-sm leading-relaxed sm:text-base">
                  Trang Vlog mô phỏng khu vực chia sẻ kinh nghiệm trên hệ thống du lịch số, cho phép
                  gắn thẻ địa điểm, lọc theo chủ đề, xem bài nổi bật, video ngắn và các gợi ý điểm
                  đến liên quan.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button
                    className="rounded-xl"
                    onClick={() =>
                      document.getElementById('composer')?.scrollIntoView({ behavior: 'smooth' })
                    }
                  >
                    Viết bài mới
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-xl"
                    onClick={() =>
                      document.getElementById('vlog-posts')?.scrollIntoView({ behavior: 'smooth' })
                    }
                  >
                    Xem bài nổi bật
                  </Button>
                </div>

                <div className="mt-6 grid gap-2 sm:grid-cols-3">
                  <div className="border-border/60 rounded-2xl border bg-white/90 p-4">
                    <p className="text-2xl font-bold">1.240</p>
                    <p className="text-muted-foreground text-xs font-medium">Bài viết đã chia sẻ</p>
                  </div>
                  <div className="border-border/60 rounded-2xl border bg-white/90 p-4">
                    <p className="text-2xl font-bold">286</p>
                    <p className="text-muted-foreground text-xs font-medium">Video ngắn du lịch</p>
                  </div>
                  <div className="border-border/60 rounded-2xl border bg-white/90 p-4">
                    <p className="text-2xl font-bold">18,5K</p>
                    <p className="text-muted-foreground text-xs font-medium">
                      Lượt tương tác tuần này
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              id="composer"
              className="border-border/70 gap-0 rounded-3xl py-0 shadow-sm lg:col-span-2"
            >
              <CardHeader className="px-5 pt-5 pb-0">
                <CardTitle className="text-xl">Đăng bài nhanh</CardTitle>
                <p className="text-muted-foreground text-sm">
                  Tạo bài vlog mẫu trực tiếp trên giao diện
                </p>
              </CardHeader>
              <CardContent className="space-y-3 px-5 py-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-muted-foreground text-xs font-semibold">Tiêu đề</label>
                    <Input
                      value={newTitle}
                      onChange={(event) => setNewTitle(event.target.value)}
                      placeholder="Ví dụ: Một ngày khám phá Tràng An"
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-muted-foreground text-xs font-semibold">
                      Gắn thẻ địa điểm
                    </label>
                    <Select value={newPlace} onValueChange={setNewPlace}>
                      <SelectTrigger className="h-11 w-full">
                        <SelectValue placeholder="Chọn địa điểm" />
                      </SelectTrigger>
                      <SelectContent>
                        {places.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-muted-foreground text-xs font-semibold">
                    Nội dung ngắn
                  </label>
                  <Textarea
                    value={newDescription}
                    onChange={(event) => setNewDescription(event.target.value)}
                    className="min-h-30"
                    placeholder="Chia sẻ cảm nhận, mẹo lịch trình, món ăn ngon hoặc trải nghiệm nổi bật..."
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {['📷 Ảnh', '🎥 Video', '📍 Địa điểm', '🏷 Hashtag'].map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700"
                    >
                      {chip}
                    </span>
                  ))}
                </div>

                <Button className="w-full rounded-xl" onClick={handlePublish}>
                  Đăng bài mô phỏng
                </Button>
              </CardContent>
            </Card>
          </section>

          <section className="mt-4">
            <Card className="border-border/70 gap-0 rounded-3xl py-0 shadow-sm">
              <CardContent className="space-y-4 px-5 py-5">
                <SectionHeading
                  title="Lọc nội dung"
                  description="Tìm theo tiêu đề, loại nội dung và chủ đề"
                />

                <div className="grid gap-3 lg:grid-cols-[2fr_1fr_1fr_auto]">
                  <div className="space-y-1.5">
                    <label className="text-muted-foreground text-xs font-semibold">Từ khóa</label>
                    <div className="relative">
                      <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                      <Input
                        value={keyword}
                        onChange={(event) => setKeyword(event.target.value)}
                        placeholder="Tìm bài viết, video, địa điểm..."
                        className="h-11 pl-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-muted-foreground text-xs font-semibold">
                      Loại nội dung
                    </label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="h-11 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {['all', 'Bài viết', 'Video'].map((item) => (
                          <SelectItem key={item} value={item}>
                            {item === 'all' ? 'Tất cả' : item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-muted-foreground text-xs font-semibold">Địa điểm</label>
                    <Select value={placeFilter} onValueChange={setPlaceFilter}>
                      <SelectTrigger className="h-11 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        {places.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      className="h-11 rounded-xl"
                      onClick={handleResetFilter}
                    >
                      Làm mới
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant={topicFilter === 'all' ? 'default' : 'outline'}
                    className="rounded-full"
                    onClick={() => setTopicFilter('all')}
                  >
                    Tất cả chủ đề
                  </Button>
                  {topics.map((item) => (
                    <Button
                      key={item}
                      size="sm"
                      variant={topicFilter === item ? 'default' : 'outline'}
                      className="rounded-full"
                      onClick={() => setTopicFilter(item)}
                    >
                      {item}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          <section id="vlog-posts" className="mt-6 grid gap-4 lg:grid-cols-[1.05fr_.95fr]">
            <div>
              <SectionHeading
                title="Bài viết và video nổi bật"
                description={`Đang hiển thị ${filteredPosts.length} nội dung phù hợp`}
              />
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredPosts.map((item) => (
                  <Card
                    key={item.id}
                    className="border-border/70 gap-0 overflow-hidden rounded-2xl py-0 shadow-sm"
                  >
                    <div className="relative h-52">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = placeholderImg;
                        }}
                      />
                      <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold">
                        {item.type} · {item.place}
                      </span>
                      <div className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90">
                        {item.type === 'Video' ? (
                          <Play className="h-4 w-4" />
                        ) : (
                          <Sparkles className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                    <CardContent className="space-y-2 px-4 py-4">
                      <div className="text-muted-foreground flex items-center justify-between text-xs font-semibold">
                        <span>{item.author}</span>
                        <span>{item.dateLabel}</span>
                      </div>
                      <h3 className="truncate text-base font-bold">{item.title}</h3>
                      <p className="text-muted-foreground line-clamp-3 text-sm">
                        {item.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="text-muted-foreground flex items-center gap-3 text-xs font-semibold">
                          <span className="inline-flex items-center gap-1">
                            <Heart className="h-3.5 w-3.5" /> {item.likes}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <MessageCircle className="h-3.5 w-3.5" /> {item.comments}
                          </span>
                        </div>
                        <Button variant="outline" size="sm" className="rounded-lg">
                          Xem tiếp
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <aside>
              <SectionHeading
                title="Đang được quan tâm"
                description="Các chủ đề và tuyến trải nghiệm nhiều lượt xem"
              />
              <div className="grid gap-3">
                {VLOG_TRENDING.map((item) => (
                  <Card key={item.id} className="border-border/70 gap-0 rounded-2xl py-0 shadow-sm">
                    <CardContent className="flex gap-3 px-4 py-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-20 w-28 rounded-xl object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = placeholderImg;
                        }}
                      />
                      <div className="min-w-0">
                        <h4 className="truncate font-semibold">{item.title}</h4>
                        <p className="text-muted-foreground line-clamp-3 text-sm">{item.text}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </aside>
          </section>
        </div>
      </div>
    </RootLayout>
  );
}
