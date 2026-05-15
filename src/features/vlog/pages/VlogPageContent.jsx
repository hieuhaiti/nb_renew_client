import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MessageCircle, Play, Search, Heart, Sparkles } from 'lucide-react';
import { useDebounce } from 'use-debounce';
import { useTranslation } from 'react-i18next';
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
      <h2 className="truncate text-lg font-bold text-foreground md:text-xl xl:text-2xl">{title}</h2>
      {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
    </div>
  );
}

export default function VlogPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [posts, setPosts] = useState(VLOG_INITIAL_POSTS);
  const [keyword, setKeyword] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [placeFilter, setPlaceFilter] = useState('all');
  const [topicFilter, setTopicFilter] = useState('all');
  const [debouncedKeyword] = useDebounce(keyword.trim(), 400);

  const [newTitle, setNewTitle] = useState('');
  const [newPlace, setNewPlace] = useState('Tràng An');
  const [newDescription, setNewDescription] = useState('');

  const TYPE_ALL_VALUE = 'all';
  const typePost = t('vlogPage.types.post');
  const typeVideo = t('vlogPage.types.video');

  const places = useMemo(() => [...new Set(posts.map((item) => item.place))], [posts]);
  const topics = useMemo(() => [...new Set(posts.map((item) => item.topic))], [posts]);

  const filteredPosts = useMemo(() => {
    const normalizedKeyword = debouncedKeyword.toLowerCase();
    return posts.filter((item) => {
      const haystack = [item.title, item.place, item.type, item.topic, item.description, item.author]
        .join(' ')
        .toLowerCase();
      const matchedKeyword = !normalizedKeyword || haystack.includes(normalizedKeyword);
      const matchedType =
        typeFilter === TYPE_ALL_VALUE ||
        item.type === typeFilter ||
        item.type === typePost ||
        item.type === typeVideo;
      const matchedPlace = placeFilter === TYPE_ALL_VALUE || item.place === placeFilter;
      const matchedTopic = topicFilter === TYPE_ALL_VALUE || item.topic === topicFilter;
      return matchedKeyword && matchedType && matchedPlace && matchedTopic;
    });
  }, [posts, debouncedKeyword, typeFilter, placeFilter, topicFilter, typePost, typeVideo]);

  const handleResetFilter = () => {
    setKeyword('');
    setTypeFilter(TYPE_ALL_VALUE);
    setPlaceFilter(TYPE_ALL_VALUE);
    setTopicFilter(TYPE_ALL_VALUE);
  };

  const handlePublish = () => {
    const nextTitle = newTitle.trim();
    const nextDescription = newDescription.trim();
    if (!nextTitle || !nextDescription) {
      toast.warn(t('vlogPage.composer.toast_empty_title'));
      return;
    }
    const nextPost = {
      id: Date.now(),
      title: nextTitle,
      place: newPlace,
      type: t('vlogPage.post.type_default'),
      topic: t('vlogPage.post.topic_default'),
      author: t('vlogPage.post.author_default'),
      likes: 0,
      comments: 0,
      image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
      description: nextDescription,
      dateLabel: t('vlogPage.just_now'),
    };
    setPosts((prev) => [nextPost, ...prev]);
    setNewTitle('');
    setNewDescription('');
    setTopicFilter(TYPE_ALL_VALUE);
    toast.success(t('vlogPage.composer.toast_success'));
  };

  return (
    <RootLayout>
      <div className="min-h-screen bg-background py-4 lg:py-6">
        <div className="mx-auto w-full px-4 sm:px-6 lg:w-[88%] lg:px-0">
          {/* Hero + Composer */}
          <section className="grid gap-4 lg:grid-cols-5">
            <Card className="relative gap-0 overflow-hidden rounded-3xl border-border/70 py-0 shadow-sm lg:col-span-3">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center" />
              <div className="absolute inset-0 bg-linear-to-r from-white/95 via-white/85 to-white/75" />
              <CardContent className="relative px-6 py-8 sm:px-8 sm:py-9">
                <span className="inline-flex rounded-full bg-pink-100 px-3 py-1 text-sm font-semibold text-pink-700">
                  {t('vlogPage.hero.badge')}
                </span>
                <h1 className="mt-4 max-w-4xl text-xl font-extrabold tracking-tight text-foreground md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl">
                  {t('vlogPage.hero.title')}
                </h1>
                <p className="mt-3 max-w-3xl text-sm 2xl:text-base leading-relaxed text-muted-foreground">
                  {t('vlogPage.hero.description')}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button
                    className="rounded-xl"
                    onClick={() =>
                      document.getElementById('composer')?.scrollIntoView({ behavior: 'smooth' })
                    }
                  >
                    {t('vlogPage.hero.cta_write')}
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-xl"
                    onClick={() =>
                      document.getElementById('vlog-posts')?.scrollIntoView({ behavior: 'smooth' })
                    }
                  >
                    {t('vlogPage.hero.cta_featured')}
                  </Button>
                </div>

                {/* Stats — values come from static data; these counts are mock/demo figures */}
                <div className="mt-6 grid gap-2 sm:grid-cols-3">
                  <div className="rounded-2xl border border-border/60 bg-white/90 p-4">
                    <p className="text-lg font-bold md:text-xl xl:text-2xl">1.240</p>
                    <p className="text-sm font-medium text-muted-foreground">{t('vlogPage.stats.posts')}</p>
                  </div>
                  <div className="rounded-2xl border border-border/60 bg-white/90 p-4">
                    <p className="text-lg font-bold md:text-xl xl:text-2xl">286</p>
                    <p className="text-sm font-medium text-muted-foreground">{t('vlogPage.stats.authors')}</p>
                  </div>
                  <div className="rounded-2xl border border-border/60 bg-white/90 p-4">
                    <p className="text-lg font-bold md:text-xl xl:text-2xl">18,5K</p>
                    <p className="text-sm font-medium text-muted-foreground">{t('vlogPage.stats.views')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              id="composer"
              className="gap-0 rounded-3xl border-border/70 py-0 shadow-sm lg:col-span-2"
            >
              <CardHeader className="px-5 pb-0 pt-5">
                <CardTitle className="text-xl">{t('vlogPage.composer.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 px-5 py-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-muted-foreground">
                      {t('vlogPage.composer.title_label')}
                    </label>
                    <Input
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder={t('vlogPage.composer.title_placeholder')}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-muted-foreground">
                      {t('vlogPage.filters.location_label')}
                    </label>
                    <Select value={newPlace} onValueChange={setNewPlace}>
                      <SelectTrigger className="h-11 w-full">
                        <SelectValue placeholder={t('vlogPage.filters.location_placeholder')} />
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
                  <label className="text-sm font-semibold text-muted-foreground">
                    {t('vlogPage.composer.content_label')}
                  </label>
                  <Textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="min-h-30"
                    placeholder={t('vlogPage.composer.content_placeholder')}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    t('vlogPage.attach.photo'),
                    t('vlogPage.attach.video'),
                    t('vlogPage.attach.place'),
                    t('vlogPage.attach.hashtag'),
                  ].map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-700"
                    >
                      {chip}
                    </span>
                  ))}
                </div>

                <Button className="w-full rounded-xl" onClick={handlePublish}>
                  {t('vlogPage.composer.submit')}
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* Filters */}
          <section className="mt-4">
            <Card className="gap-0 rounded-3xl border-border/70 py-0 shadow-sm">
              <CardContent className="space-y-4 px-5 py-5">
                <SectionHeading title={t('vlogPage.filters.title')} />

                <div className="grid gap-3 lg:grid-cols-[2fr_1fr_1fr_auto]">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-muted-foreground">
                      {t('vlogPage.filters.keyword_label')}
                    </label>
                    <div className="relative">
                      <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder={t('vlogPage.filters.keyword_placeholder')}
                        className="h-11 pl-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-muted-foreground">
                      {t('vlogPage.filters.type_label')}
                    </label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="h-11 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={TYPE_ALL_VALUE}>{t('vlogPage.types.all')}</SelectItem>
                        <SelectItem value={typePost}>{typePost}</SelectItem>
                        <SelectItem value={typeVideo}>{typeVideo}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-muted-foreground">
                      {t('vlogPage.filters.location_label')}
                    </label>
                    <Select value={placeFilter} onValueChange={setPlaceFilter}>
                      <SelectTrigger className="h-11 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={TYPE_ALL_VALUE}>{t('common.all')}</SelectItem>
                        {places.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button variant="outline" className="h-11 rounded-xl" onClick={handleResetFilter}>
                      {t('vlogPage.filters.refresh')}
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant={topicFilter === TYPE_ALL_VALUE ? 'default' : 'outline'}
                    className="rounded-full"
                    onClick={() => setTopicFilter(TYPE_ALL_VALUE)}
                  >
                    {t('vlogPage.topics.all')}
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

          {/* Posts + Trending */}
          <section id="vlog-posts" className="mt-6 grid gap-4 lg:grid-cols-[1.05fr_.95fr]">
            <div>
              <SectionHeading
                title={t('vlogPage.trending.title')}
                description={`${filteredPosts.length} ${t('vlogPage.stats.posts').toLowerCase()}`}
              />
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredPosts.length === 0 ? (
                  <div className="col-span-full rounded-2xl border border-[#cfe0f4] bg-white py-16 text-center text-muted-foreground">
                    <p className="text-sm 2xl:text-base font-semibold text-foreground">{t('vlogPage.states.empty_title')}</p>
                    <p className="mt-1 text-sm">{t('vlogPage.states.empty_desc')}</p>
                  </div>
                ) : (
                  filteredPosts.map((item) => (
                    <Card
                      key={item.id}
                      className="gap-0 overflow-hidden rounded-2xl border-border/70 py-0 shadow-sm"
                    >
                      <div className="relative h-52">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover"
                          onError={(e) => { e.target.onerror = null; e.target.src = placeholderImg; }}
                        />
                        <span className="typo-badge absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1">
                          {item.type} · {item.place}
                        </span>
                        <div className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90">
                          {item.type === 'Video' || item.type === typeVideo ? (
                            <Play className="h-4 w-4" />
                          ) : (
                            <Sparkles className="h-4 w-4" />
                          )}
                        </div>
                      </div>
                      <CardContent className="space-y-2 px-4 py-4">
                        <div className="typo-meta flex items-center justify-between font-semibold text-muted-foreground">
                          <span>{item.author}</span>
                          <span>{item.dateLabel}</span>
                        </div>
                        <h3 className="typo-section-title truncate">{item.title}</h3>
                        <p className="typo-body line-clamp-3 text-muted-foreground">{item.description}</p>

                        <div className="flex items-center justify-between">
                          <div className="typo-meta flex items-center gap-3 font-semibold text-muted-foreground">
                            <span className="inline-flex items-center gap-1">
                              <Heart className="h-3.5 w-3.5" /> {item.likes}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <MessageCircle className="h-3.5 w-3.5" /> {item.comments}
                            </span>
                          </div>
                          <Button variant="outline" size="sm" className="rounded-lg">
                            {t('vlogPage.post.read_more')}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>

            <aside>
              <SectionHeading title={t('vlogPage.trending.title')} />
              <div className="grid gap-3">
                {VLOG_TRENDING.map((item) => (
                  <Card key={item.id} className="gap-0 rounded-2xl border-border/70 py-0 shadow-sm">
                    <CardContent className="flex gap-3 px-4 py-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-20 w-28 rounded-xl object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.src = placeholderImg; }}
                      />
                      <div className="min-w-0">
                        <h4 className="typo-body truncate font-semibold">{item.title}</h4>
                        <p className="typo-body line-clamp-3 text-muted-foreground">{item.text}</p>
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
