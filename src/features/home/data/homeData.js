const HOME_DATA = {
  HERO_STATS: [
    { labelKey: 'home.mock.hero_stats.featured', value: '03' },
    { labelKey: 'home.mock.hero_stats.average_load', value: '70%' },
    { labelKey: 'home.mock.hero_stats.events_offers', value: '12+' },
    { labelKey: 'home.mock.hero_stats.vr360', value: 'Ready' },
  ],
  HERO_EVENTS: [
    {
      titleKey: 'home.mock.hero_events.hoa_lu.title',
      timeKey: 'home.mock.hero_events.hoa_lu.time',
    },
    {
      titleKey: 'home.mock.hero_events.tourism_week.title',
      timeKey: 'home.mock.hero_events.tourism_week.time',
    },
    {
      titleKey: 'home.mock.hero_events.light_show.title',
      timeKey: 'home.mock.hero_events.light_show.time',
    },
  ],
  PROMO_BANNER: {
    titleKey: 'home.mock.promo_banner.title',
    descriptionKey: 'home.mock.promo_banner.description',
    ctaKey: 'home.mock.promo_banner.cta',
    path: '/map',
  },
  QUICK_LINKS: [
    {
      id: 'map',
      icon: 'map',
      titleKey: 'home.mock.quick_links.map.title',
      descriptionKey: 'home.mock.quick_links.map.description',
      path: '/map',
    },
    {
      id: 'vr',
      icon: 'vr',
      titleKey: 'home.mock.quick_links.vr.title',
      descriptionKey: 'home.mock.quick_links.vr.description',
      path: '/vr360',
    },
    {
      id: 'plan',
      icon: 'plan',
      titleKey: 'home.mock.quick_links.plan.title',
      descriptionKey: 'home.mock.quick_links.plan.description',
      path: '/tour',
    },
    {
      id: 'service',
      icon: 'service',
      titleKey: 'home.mock.quick_links.service.title',
      descriptionKey: 'home.mock.quick_links.service.description',
      path: '/tourism-point',
    },
    {
      id: 'ocop',
      icon: 'ocop',
      titleKey: 'home.mock.quick_links.ocop.title',
      descriptionKey: 'home.mock.quick_links.ocop.description',
      path: '/ocop',
    },
  ],
  FEATURED_DESTINATIONS: [
    {
      id: 'trang-an',
      nameKey: 'home.mock.featured_destinations.trang_an.name',
      provinceKey: 'home.mock.common.ninh_binh',
      subtitleKey: 'home.mock.featured_destinations.trang_an.subtitle',
      rating: 4.9,
      descriptionKey: 'home.mock.featured_destinations.trang_an.description',
      image:
        'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'hoa-lu',
      nameKey: 'home.mock.featured_destinations.hoa_lu.name',
      provinceKey: 'home.mock.common.ninh_binh',
      subtitleKey: 'home.mock.featured_destinations.hoa_lu.subtitle',
      rating: 4.7,
      descriptionKey: 'home.mock.featured_destinations.hoa_lu.description',
      image:
        'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'bai-dinh',
      nameKey: 'home.mock.featured_destinations.bai_dinh.name',
      provinceKey: 'home.mock.common.ninh_binh',
      subtitleKey: 'home.mock.featured_destinations.bai_dinh.subtitle',
      rating: 4.8,
      descriptionKey: 'home.mock.featured_destinations.bai_dinh.description',
      image:
        'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=1200&q=80',
    },
  ],
  NEWS_ITEMS: [
    {
      titleKey: 'home.mock.news_items.item_1.title',
      date: '18/04/2026',
      excerptKey: 'home.mock.news_items.item_1.excerpt',
    },
    {
      titleKey: 'home.mock.news_items.item_2.title',
      date: '17/04/2026',
      excerptKey: 'home.mock.news_items.item_2.excerpt',
    },
    {
      titleKey: 'home.mock.news_items.item_3.title',
      date: '15/04/2026',
      excerptKey: 'home.mock.news_items.item_3.excerpt',
    },
  ],
  ITINERARY_ITEMS: [
    { time: '07:30', activityKey: 'home.mock.itinerary.item_1' },
    { time: '08:15', activityKey: 'home.mock.itinerary.item_2' },
    { time: '11:30', activityKey: 'home.mock.itinerary.item_3' },
    { time: '14:00', activityKey: 'home.mock.itinerary.item_4' },
    { time: '17:30', activityKey: 'home.mock.itinerary.item_5' },
  ],
  FOOD_TAGS: [
    'home.mock.food_tags.item_1',
    'home.mock.food_tags.item_2',
    'home.mock.food_tags.item_3',
    'home.mock.food_tags.item_4',
  ],
  FOOD_BULLETS: [
    { labelKey: 'home.mock.food_bullets.item_1.label', value: '⭐ 4.7' },
    {
      labelKey: 'home.mock.food_bullets.item_2.label',
      valueKey: 'home.mock.food_bullets.item_2.value',
    },
    { labelKey: 'home.mock.food_bullets.item_3.label', value: 'DECO20' },
  ],
  SERVICES: [
    {
      nameKey: 'home.mock.services.item_1.name',
      typeKey: 'home.mock.services.item_1.type',
      rating: 4.6,
      priceKey: 'home.mock.services.item_1.price',
      voucher: 'NBSTAY10',
      descriptionKey: 'home.mock.services.item_1.description',
      image:
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    },
    {
      nameKey: 'home.mock.services.item_2.name',
      typeKey: 'home.mock.services.item_2.type',
      rating: 4.7,
      priceKey: 'home.mock.services.item_2.price',
      voucher: 'DECO20',
      descriptionKey: 'home.mock.services.item_2.description',
      image:
        'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80',
    },
    {
      nameKey: 'home.mock.services.item_3.name',
      typeKey: 'home.mock.services.item_3.type',
      rating: 4.5,
      priceKey: 'home.mock.services.item_3.price',
      voucher: 'BOAT15',
      descriptionKey: 'home.mock.services.item_3.description',
      image:
        'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
    },
  ],
  OCOP_PRODUCTS: [
    {
      nameKey: 'home.mock.ocop_products.item_1.name',
      starsKey: 'home.mock.ocop_products.item_1.stars',
      originKey: 'home.mock.common.ninh_binh',
      priceKey: 'home.mock.ocop_products.item_1.price',
      descriptionKey: 'home.mock.ocop_products.item_1.description',
      image:
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
    },
    {
      nameKey: 'home.mock.ocop_products.item_2.name',
      starsKey: 'home.mock.ocop_products.item_2.stars',
      originKey: 'home.mock.common.ninh_binh',
      priceKey: 'home.mock.ocop_products.item_2.price',
      descriptionKey: 'home.mock.ocop_products.item_2.description',
      image:
        'https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=1200&q=80',
    },
    {
      nameKey: 'home.mock.ocop_products.item_3.name',
      starsKey: 'home.mock.ocop_products.item_3.stars',
      originKey: 'home.mock.common.quang_ninh',
      priceKey: 'home.mock.ocop_products.item_3.price',
      descriptionKey: 'home.mock.ocop_products.item_3.description',
      image:
        'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1200&q=80',
    },
  ],
  VLOG_STORIES: [
    {
      titleKey: 'home.mock.vlog_stories.item_1.title',
      author: 'Lan Anh',
      descriptionKey: 'home.mock.vlog_stories.item_1.description',
      image:
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
    },
    {
      titleKey: 'home.mock.vlog_stories.item_2.title',
      author: 'Minh Khoa',
      descriptionKey: 'home.mock.vlog_stories.item_2.description',
      image:
        'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=1200&q=80',
    },
    {
      titleKey: 'home.mock.vlog_stories.item_3.title',
      author: 'Ngoc Mai',
      descriptionKey: 'home.mock.vlog_stories.item_3.description',
      image:
        'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=80',
    },
  ],
};

export function getHomeData() {
  return HOME_DATA;
}
