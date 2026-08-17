# Translation Audit EN/VI

Generated: 2026-06-06T06:25:20.881Z

## Conclusion

FAIL: translation completeness has blocking issues that should be fixed before release.

No unresolved dynamic i18n usages remain.

## Summary

- EN leaf keys: 1283
- VI leaf keys: 1283
- Static i18n usages found: 2647
- Dynamic i18n usages needing manual review: 0
- Inline fallbacks found: 0
- Hardcoded visible text must_i18n: 0
- Hardcoded visible text review: 0
- Unique used keys missing in EN: 182
- Unique used keys missing in VI: 182
- Duplicate JSON keys: 0
- Keys unused by static scan: 293

## Duplicate JSON Keys

- None

## Missing Between Locale Files

### Missing in EN

- None

### Missing in VI

- None

## Type Mismatches

- None

## Empty or Placeholder Values

### EN

- None

### VI

- None

## Used But Missing

### Missing in EN

- `common.errors.carousel_context` (t()) at `src/components/ui/carousel.jsx:15`
- `common.errors.file_upload_root_context` (t()) at `src/components/ui/file-upload.jsx:124`
- `common.errors.file_upload_item_context` (t()) at `src/components/ui/file-upload.jsx:841`
- `common.errors.file_upload_root_context` (t()) at `src/components/ui/file-upload.jsx:93`
- `home.mock.hero_events.hoa_lu.title` (declared:titleKey) at `src/features/home/data/homeData.js:10`
- `home.mock.news_items.item_1.excerpt` (declared:excerptKey) at `src/features/home/data/homeData.js:101`
- `home.mock.news_items.item_2.title` (declared:titleKey) at `src/features/home/data/homeData.js:104`
- `home.mock.news_items.item_2.excerpt` (declared:excerptKey) at `src/features/home/data/homeData.js:106`
- `home.mock.news_items.item_3.title` (declared:titleKey) at `src/features/home/data/homeData.js:109`
- `home.mock.hero_events.hoa_lu.time` (declared:timeKey) at `src/features/home/data/homeData.js:11`
- `home.mock.news_items.item_3.excerpt` (declared:excerptKey) at `src/features/home/data/homeData.js:111`
- `home.mock.itinerary.item_1` (declared:activityKey) at `src/features/home/data/homeData.js:115`
- `home.mock.itinerary.item_2` (declared:activityKey) at `src/features/home/data/homeData.js:116`
- `home.mock.itinerary.item_3` (declared:activityKey) at `src/features/home/data/homeData.js:117`
- `home.mock.itinerary.item_4` (declared:activityKey) at `src/features/home/data/homeData.js:118`
- `home.mock.itinerary.item_5` (declared:activityKey) at `src/features/home/data/homeData.js:119`
- `home.mock.food_bullets.item_1.label` (declared:labelKey) at `src/features/home/data/homeData.js:128`
- `home.mock.food_bullets.item_2.label` (declared:labelKey) at `src/features/home/data/homeData.js:130`
- `home.mock.food_bullets.item_2.value` (declared:valueKey) at `src/features/home/data/homeData.js:131`
- `home.mock.food_bullets.item_3.label` (declared:labelKey) at `src/features/home/data/homeData.js:133`
- `home.mock.services.item_1.name` (declared:nameKey) at `src/features/home/data/homeData.js:137`
- `home.mock.services.item_1.type` (declared:typeKey) at `src/features/home/data/homeData.js:138`
- `home.mock.hero_events.tourism_week.title` (declared:titleKey) at `src/features/home/data/homeData.js:14`
- `home.mock.services.item_1.price` (declared:priceKey) at `src/features/home/data/homeData.js:140`
- `home.mock.services.item_1.description` (declared:descriptionKey) at `src/features/home/data/homeData.js:142`
- `home.mock.services.item_2.name` (declared:nameKey) at `src/features/home/data/homeData.js:147`
- `home.mock.services.item_2.type` (declared:typeKey) at `src/features/home/data/homeData.js:148`
- `home.mock.hero_events.tourism_week.time` (declared:timeKey) at `src/features/home/data/homeData.js:15`
- `home.mock.services.item_2.price` (declared:priceKey) at `src/features/home/data/homeData.js:150`
- `home.mock.services.item_2.description` (declared:descriptionKey) at `src/features/home/data/homeData.js:152`
- `home.mock.services.item_3.name` (declared:nameKey) at `src/features/home/data/homeData.js:157`
- `home.mock.services.item_3.type` (declared:typeKey) at `src/features/home/data/homeData.js:158`
- `home.mock.services.item_3.price` (declared:priceKey) at `src/features/home/data/homeData.js:160`
- `home.mock.services.item_3.description` (declared:descriptionKey) at `src/features/home/data/homeData.js:162`
- `home.mock.ocop_products.item_1.name` (declared:nameKey) at `src/features/home/data/homeData.js:169`
- `home.mock.ocop_products.item_1.stars` (declared:starsKey) at `src/features/home/data/homeData.js:170`
- `home.mock.common.ninh_binh` (declared:originKey) at `src/features/home/data/homeData.js:171`
- `home.mock.ocop_products.item_1.price` (declared:priceKey) at `src/features/home/data/homeData.js:172`
- `home.mock.ocop_products.item_1.description` (declared:descriptionKey) at `src/features/home/data/homeData.js:173`
- `home.mock.ocop_products.item_2.name` (declared:nameKey) at `src/features/home/data/homeData.js:178`
- `home.mock.ocop_products.item_2.stars` (declared:starsKey) at `src/features/home/data/homeData.js:179`
- `home.mock.hero_events.light_show.title` (declared:titleKey) at `src/features/home/data/homeData.js:18`
- `home.mock.common.ninh_binh` (declared:originKey) at `src/features/home/data/homeData.js:180`
- `home.mock.ocop_products.item_2.price` (declared:priceKey) at `src/features/home/data/homeData.js:181`
- `home.mock.ocop_products.item_2.description` (declared:descriptionKey) at `src/features/home/data/homeData.js:182`
- `home.mock.ocop_products.item_3.name` (declared:nameKey) at `src/features/home/data/homeData.js:187`
- `home.mock.ocop_products.item_3.stars` (declared:starsKey) at `src/features/home/data/homeData.js:188`
- `home.mock.common.kim_son` (declared:originKey) at `src/features/home/data/homeData.js:189`
- `home.mock.hero_events.light_show.time` (declared:timeKey) at `src/features/home/data/homeData.js:19`
- `home.mock.ocop_products.item_3.price` (declared:priceKey) at `src/features/home/data/homeData.js:190`
- `home.mock.ocop_products.item_3.description` (declared:descriptionKey) at `src/features/home/data/homeData.js:191`
- `home.mock.vlog_stories.item_1.title` (declared:titleKey) at `src/features/home/data/homeData.js:198`
- `home.mock.vlog_stories.item_1.description` (declared:descriptionKey) at `src/features/home/data/homeData.js:200`
- `home.mock.vlog_stories.item_2.title` (declared:titleKey) at `src/features/home/data/homeData.js:205`
- `home.mock.vlog_stories.item_2.description` (declared:descriptionKey) at `src/features/home/data/homeData.js:207`
- `home.mock.vlog_stories.item_3.title` (declared:titleKey) at `src/features/home/data/homeData.js:212`
- `home.mock.vlog_stories.item_3.description` (declared:descriptionKey) at `src/features/home/data/homeData.js:214`
- `home.mock.promo_banner.title` (declared:titleKey) at `src/features/home/data/homeData.js:23`
- `home.mock.promo_banner.description` (declared:descriptionKey) at `src/features/home/data/homeData.js:24`
- `home.mock.promo_banner.cta` (declared:ctaKey) at `src/features/home/data/homeData.js:25`
- `home.mock.hero_stats.featured` (declared:labelKey) at `src/features/home/data/homeData.js:3`
- `home.mock.quick_links.map.title` (declared:titleKey) at `src/features/home/data/homeData.js:32`
- `home.mock.quick_links.map.description` (declared:descriptionKey) at `src/features/home/data/homeData.js:33`
- `home.mock.quick_links.vr.title` (declared:titleKey) at `src/features/home/data/homeData.js:39`
- `home.mock.hero_stats.average_load` (declared:labelKey) at `src/features/home/data/homeData.js:4`
- `home.mock.quick_links.vr.description` (declared:descriptionKey) at `src/features/home/data/homeData.js:40`
- `home.mock.quick_links.plan.title` (declared:titleKey) at `src/features/home/data/homeData.js:46`
- `home.mock.quick_links.plan.description` (declared:descriptionKey) at `src/features/home/data/homeData.js:47`
- `home.mock.hero_stats.events_offers` (declared:labelKey) at `src/features/home/data/homeData.js:5`
- `home.mock.quick_links.service.title` (declared:titleKey) at `src/features/home/data/homeData.js:53`
- `home.mock.quick_links.service.description` (declared:descriptionKey) at `src/features/home/data/homeData.js:54`
- `home.mock.hero_stats.vr360` (declared:labelKey) at `src/features/home/data/homeData.js:6`
- `home.mock.quick_links.ocop.title` (declared:titleKey) at `src/features/home/data/homeData.js:60`
- `home.mock.quick_links.ocop.description` (declared:descriptionKey) at `src/features/home/data/homeData.js:61`
- `home.mock.featured_destinations.trang_an.name` (declared:nameKey) at `src/features/home/data/homeData.js:68`
- `home.mock.common.ninh_binh` (declared:provinceKey) at `src/features/home/data/homeData.js:69`
- `home.mock.featured_destinations.trang_an.subtitle` (declared:subtitleKey) at `src/features/home/data/homeData.js:70`
- `home.mock.featured_destinations.trang_an.description` (declared:descriptionKey) at `src/features/home/data/homeData.js:72`
- `home.mock.featured_destinations.hoa_lu.name` (declared:nameKey) at `src/features/home/data/homeData.js:78`
- `home.mock.common.ninh_binh` (declared:provinceKey) at `src/features/home/data/homeData.js:79`
- `home.mock.featured_destinations.hoa_lu.subtitle` (declared:subtitleKey) at `src/features/home/data/homeData.js:80`
- `home.mock.featured_destinations.hoa_lu.description` (declared:descriptionKey) at `src/features/home/data/homeData.js:82`
- `home.mock.featured_destinations.bai_dinh.name` (declared:nameKey) at `src/features/home/data/homeData.js:88`
- `home.mock.common.ninh_binh` (declared:provinceKey) at `src/features/home/data/homeData.js:89`
- `home.mock.featured_destinations.bai_dinh.subtitle` (declared:subtitleKey) at `src/features/home/data/homeData.js:90`
- `home.mock.featured_destinations.bai_dinh.description` (declared:descriptionKey) at `src/features/home/data/homeData.js:92`
- `home.mock.news_items.item_1.title` (declared:titleKey) at `src/features/home/data/homeData.js:99`
- `home.mock.hero_events.hoa_lu.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1054`
- `home.mock.hero_events.light_show.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1054`
- `home.mock.hero_events.tourism_week.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1054`
- `home.mock.news_items.item_1.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1054`
- `home.mock.news_items.item_2.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1054`
- `home.mock.news_items.item_3.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1054`
- `home.mock.promo_banner.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1054`
- `home.mock.quick_links.map.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1054`
- `home.mock.quick_links.ocop.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1054`
- `home.mock.quick_links.plan.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1054`
- `home.mock.quick_links.service.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1054`
- `home.mock.quick_links.vr.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1054`
- `home.mock.vlog_stories.item_1.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1054`
- `home.mock.vlog_stories.item_2.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1054`
- `home.mock.vlog_stories.item_3.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1054`
- `vlogPage.mock.posts.item_1.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1054`
- `vlogPage.mock.posts.item_2.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1054`
- `vlogPage.mock.posts.item_3.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1054`
- `vlogPage.mock.posts.item_4.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1054`
- `vlogPage.mock.posts.item_5.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1054`
- `vlogPage.mock.posts.item_6.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1054`
- `vlogPage.mock.trending.item_1.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1054`
- `vlogPage.mock.trending.item_2.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1054`
- `vlogPage.mock.trending.item_3.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1054`
- `home.mock.hero_events.hoa_lu.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1302`
- `home.mock.hero_events.light_show.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1302`
- `home.mock.hero_events.tourism_week.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1302`
- `home.mock.news_items.item_1.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1302`
- `home.mock.news_items.item_2.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1302`
- `home.mock.news_items.item_3.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1302`
- `home.mock.promo_banner.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1302`
- `home.mock.quick_links.map.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1302`
- `home.mock.quick_links.ocop.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1302`
- `home.mock.quick_links.plan.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1302`
- `home.mock.quick_links.service.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1302`
- `home.mock.quick_links.vr.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1302`
- `home.mock.vlog_stories.item_1.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1302`
- `home.mock.vlog_stories.item_2.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1302`
- `home.mock.vlog_stories.item_3.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1302`
- `vlogPage.mock.posts.item_1.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1302`
- `vlogPage.mock.posts.item_2.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1302`
- `vlogPage.mock.posts.item_3.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1302`
- `vlogPage.mock.posts.item_4.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1302`
- `vlogPage.mock.posts.item_5.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1302`
- `vlogPage.mock.posts.item_6.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1302`
- `vlogPage.mock.trending.item_1.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1302`
- `vlogPage.mock.trending.item_2.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1302`
- `vlogPage.mock.trending.item_3.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1302`
- `home.mock.food_bullets.item_1.label` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `home.mock.food_bullets.item_2.label` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `home.mock.food_bullets.item_3.label` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `home.mock.hero_stats.average_load` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `home.mock.hero_stats.events_offers` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `home.mock.hero_stats.featured` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `home.mock.hero_stats.vr360` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `mapPage.capacityPanel.status.low` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `mapPage.capacityPanel.status.moderate` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `mapPage.capacityPanel.status.unknown` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `mapPage.traffic.flowLevels.free_flow` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `mapPage.traffic.flowLevels.heavy` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `mapPage.traffic.flowLevels.moderate` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `mapPage.traffic.flowLevels.severe` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `satellite.legend.change.no_change` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `satellite.legend.change.road_construction` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `satellite.legend.change.vegetation_gain` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `satellite.legend.change.vegetation_loss` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `satellite.legend.change.vegetation_loss_road` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `satellite.legend.classified.agriculture` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `satellite.legend.classified.bare_land` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `satellite.legend.classified.evergreen_forest` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `satellite.legend.classified.open_forest` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `satellite.legend.classified.shrub_grass` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `satellite.legend.classified.urban` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `satellite.legend.classified.water` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `satellite.legend.heatmap.cool` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `satellite.legend.heatmap.hot` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `satellite.legend.heatmap.moderate` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `satellite.legend.heatmap.very_cool` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `satellite.legend.heatmap.very_hot` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `satellite.legend.heatmap.warm` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `home.mock.hero_events.hoa_lu.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:306`
- `home.mock.hero_events.light_show.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:306`
- `home.mock.hero_events.tourism_week.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:306`
- `home.mock.news_items.item_1.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:306`
- `home.mock.news_items.item_2.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:306`
- `home.mock.news_items.item_3.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:306`
- `home.mock.promo_banner.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:306`
- `home.mock.quick_links.map.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:306`
- `home.mock.quick_links.ocop.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:306`
- `home.mock.quick_links.plan.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:306`
- `home.mock.quick_links.service.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:306`
- `home.mock.quick_links.vr.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:306`
- `home.mock.vlog_stories.item_1.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:306`
- `home.mock.vlog_stories.item_2.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:306`
- `home.mock.vlog_stories.item_3.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:306`
- `vlogPage.mock.posts.item_1.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:306`
- `vlogPage.mock.posts.item_2.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:306`
- `vlogPage.mock.posts.item_3.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:306`
- `vlogPage.mock.posts.item_4.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:306`
- `vlogPage.mock.posts.item_5.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:306`
- `vlogPage.mock.posts.item_6.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:306`
- `vlogPage.mock.trending.item_1.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:306`
- `vlogPage.mock.trending.item_2.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:306`
- `vlogPage.mock.trending.item_3.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:306`
- `home.mock.featured_destinations.bai_dinh.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `home.mock.featured_destinations.hoa_lu.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `home.mock.featured_destinations.trang_an.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `home.mock.ocop_products.item_1.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `home.mock.ocop_products.item_2.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `home.mock.ocop_products.item_3.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `home.mock.promo_banner.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `home.mock.quick_links.map.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `home.mock.quick_links.ocop.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `home.mock.quick_links.plan.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `home.mock.quick_links.service.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `home.mock.quick_links.vr.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `home.mock.services.item_1.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `home.mock.services.item_2.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `home.mock.services.item_3.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `home.mock.vlog_stories.item_1.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `home.mock.vlog_stories.item_2.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `home.mock.vlog_stories.item_3.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `mapPage.mock.destinations.hoaLuOldTown.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `mapPage.mock.destinations.tamCoc.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `mapPage.mock.destinations.trangAn.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `vlogPage.mock.posts.item_1.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `vlogPage.mock.posts.item_2.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `vlogPage.mock.posts.item_3.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `vlogPage.mock.posts.item_4.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `vlogPage.mock.posts.item_5.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `vlogPage.mock.posts.item_6.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `home.mock.itinerary.item_1` (t().activityKey) at `src/features/home/pages/HomePageContent.jsx:312`
- `home.mock.itinerary.item_2` (t().activityKey) at `src/features/home/pages/HomePageContent.jsx:312`
- `home.mock.itinerary.item_3` (t().activityKey) at `src/features/home/pages/HomePageContent.jsx:312`
- `home.mock.itinerary.item_4` (t().activityKey) at `src/features/home/pages/HomePageContent.jsx:312`
- `home.mock.itinerary.item_5` (t().activityKey) at `src/features/home/pages/HomePageContent.jsx:312`
- `common.culture` (t().nameKey) at `src/features/home/pages/HomePageContent.jsx:319`
- `common.infrastructure` (t().nameKey) at `src/features/home/pages/HomePageContent.jsx:319`
- `common.natural` (t().nameKey) at `src/features/home/pages/HomePageContent.jsx:319`
- `home.mock.featured_destinations.bai_dinh.name` (t().nameKey) at `src/features/home/pages/HomePageContent.jsx:319`
- `home.mock.featured_destinations.hoa_lu.name` (t().nameKey) at `src/features/home/pages/HomePageContent.jsx:319`
- `home.mock.featured_destinations.trang_an.name` (t().nameKey) at `src/features/home/pages/HomePageContent.jsx:319`
- `home.mock.ocop_products.item_1.name` (t().nameKey) at `src/features/home/pages/HomePageContent.jsx:319`
- `home.mock.ocop_products.item_2.name` (t().nameKey) at `src/features/home/pages/HomePageContent.jsx:319`
- `home.mock.ocop_products.item_3.name` (t().nameKey) at `src/features/home/pages/HomePageContent.jsx:319`
- `home.mock.services.item_1.name` (t().nameKey) at `src/features/home/pages/HomePageContent.jsx:319`
- `home.mock.services.item_2.name` (t().nameKey) at `src/features/home/pages/HomePageContent.jsx:319`
- `home.mock.services.item_3.name` (t().nameKey) at `src/features/home/pages/HomePageContent.jsx:319`
- `home.mock.common.ninh_binh` (t().provinceKey) at `src/features/home/pages/HomePageContent.jsx:320`
- `home.mock.featured_destinations.bai_dinh.subtitle` (t().subtitleKey) at `src/features/home/pages/HomePageContent.jsx:321`
- `home.mock.featured_destinations.hoa_lu.subtitle` (t().subtitleKey) at `src/features/home/pages/HomePageContent.jsx:321`
- `home.mock.featured_destinations.trang_an.subtitle` (t().subtitleKey) at `src/features/home/pages/HomePageContent.jsx:321`
- `home.mock.featured_destinations.bai_dinh.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `home.mock.featured_destinations.hoa_lu.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `home.mock.featured_destinations.trang_an.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `home.mock.ocop_products.item_1.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `home.mock.ocop_products.item_2.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `home.mock.ocop_products.item_3.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `home.mock.promo_banner.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `home.mock.quick_links.map.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `home.mock.quick_links.ocop.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `home.mock.quick_links.plan.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `home.mock.quick_links.service.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `home.mock.quick_links.vr.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `home.mock.services.item_1.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `home.mock.services.item_2.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `home.mock.services.item_3.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `home.mock.vlog_stories.item_1.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `home.mock.vlog_stories.item_2.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `home.mock.vlog_stories.item_3.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `mapPage.mock.destinations.hoaLuOldTown.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `mapPage.mock.destinations.tamCoc.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `mapPage.mock.destinations.trangAn.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `vlogPage.mock.posts.item_1.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `vlogPage.mock.posts.item_2.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `vlogPage.mock.posts.item_3.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `vlogPage.mock.posts.item_4.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `vlogPage.mock.posts.item_5.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `vlogPage.mock.posts.item_6.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `home.mock.hero_events.hoa_lu.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:330`
- `home.mock.hero_events.light_show.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:330`
- `home.mock.hero_events.tourism_week.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:330`
- `home.mock.news_items.item_1.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:330`
- `home.mock.news_items.item_2.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:330`
- `home.mock.news_items.item_3.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:330`
- `home.mock.promo_banner.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:330`
- `home.mock.quick_links.map.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:330`
- `home.mock.quick_links.ocop.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:330`
- `home.mock.quick_links.plan.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:330`
- `home.mock.quick_links.service.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:330`
- `home.mock.quick_links.vr.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:330`
- `home.mock.vlog_stories.item_1.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:330`
- `home.mock.vlog_stories.item_2.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:330`
- `home.mock.vlog_stories.item_3.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:330`
- `vlogPage.mock.posts.item_1.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:330`
- `vlogPage.mock.posts.item_2.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:330`
- `vlogPage.mock.posts.item_3.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:330`
- `vlogPage.mock.posts.item_4.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:330`
- `vlogPage.mock.posts.item_5.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:330`
- `vlogPage.mock.posts.item_6.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:330`
- `vlogPage.mock.trending.item_1.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:330`
- `vlogPage.mock.trending.item_2.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:330`
- `vlogPage.mock.trending.item_3.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:330`
- `home.mock.featured_destinations.bai_dinh.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `home.mock.featured_destinations.hoa_lu.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `home.mock.featured_destinations.trang_an.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `home.mock.ocop_products.item_1.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `home.mock.ocop_products.item_2.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `home.mock.ocop_products.item_3.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `home.mock.promo_banner.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `home.mock.quick_links.map.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `home.mock.quick_links.ocop.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `home.mock.quick_links.plan.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `home.mock.quick_links.service.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `home.mock.quick_links.vr.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `home.mock.services.item_1.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `home.mock.services.item_2.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `home.mock.services.item_3.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `home.mock.vlog_stories.item_1.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `home.mock.vlog_stories.item_2.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `home.mock.vlog_stories.item_3.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `mapPage.mock.destinations.hoaLuOldTown.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `mapPage.mock.destinations.tamCoc.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `mapPage.mock.destinations.trangAn.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `vlogPage.mock.posts.item_1.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `vlogPage.mock.posts.item_2.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `vlogPage.mock.posts.item_3.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `vlogPage.mock.posts.item_4.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `vlogPage.mock.posts.item_5.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `vlogPage.mock.posts.item_6.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `home.mock.hero_events.hoa_lu.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:367`
- `home.mock.hero_events.light_show.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:367`
- `home.mock.hero_events.tourism_week.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:367`
- `home.mock.news_items.item_1.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:367`
- `home.mock.news_items.item_2.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:367`
- `home.mock.news_items.item_3.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:367`
- `home.mock.promo_banner.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:367`
- `home.mock.quick_links.map.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:367`
- `home.mock.quick_links.ocop.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:367`
- `home.mock.quick_links.plan.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:367`
- `home.mock.quick_links.service.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:367`
- `home.mock.quick_links.vr.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:367`
- `home.mock.vlog_stories.item_1.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:367`
- `home.mock.vlog_stories.item_2.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:367`
- `home.mock.vlog_stories.item_3.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:367`
- `vlogPage.mock.posts.item_1.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:367`
- `vlogPage.mock.posts.item_2.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:367`
- `vlogPage.mock.posts.item_3.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:367`
- `vlogPage.mock.posts.item_4.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:367`
- `vlogPage.mock.posts.item_5.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:367`
- `vlogPage.mock.posts.item_6.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:367`
- `vlogPage.mock.trending.item_1.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:367`
- `vlogPage.mock.trending.item_2.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:367`
- `vlogPage.mock.trending.item_3.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:367`
- `home.mock.hero_events.hoa_lu.time` (t().timeKey) at `src/features/home/pages/HomePageContent.jsx:368`
- `home.mock.hero_events.light_show.time` (t().timeKey) at `src/features/home/pages/HomePageContent.jsx:368`
- `home.mock.hero_events.tourism_week.time` (t().timeKey) at `src/features/home/pages/HomePageContent.jsx:368`
- `home.mock.hero_events.hoa_lu.title` (t().titleKey) at `src/features/map/components/leftSidebar/DataLayerMapStylePanel.jsx:72`
- `home.mock.hero_events.light_show.title` (t().titleKey) at `src/features/map/components/leftSidebar/DataLayerMapStylePanel.jsx:72`
- `home.mock.hero_events.tourism_week.title` (t().titleKey) at `src/features/map/components/leftSidebar/DataLayerMapStylePanel.jsx:72`
- `home.mock.news_items.item_1.title` (t().titleKey) at `src/features/map/components/leftSidebar/DataLayerMapStylePanel.jsx:72`
- `home.mock.news_items.item_2.title` (t().titleKey) at `src/features/map/components/leftSidebar/DataLayerMapStylePanel.jsx:72`
- `home.mock.news_items.item_3.title` (t().titleKey) at `src/features/map/components/leftSidebar/DataLayerMapStylePanel.jsx:72`
- `home.mock.promo_banner.title` (t().titleKey) at `src/features/map/components/leftSidebar/DataLayerMapStylePanel.jsx:72`
- `home.mock.quick_links.map.title` (t().titleKey) at `src/features/map/components/leftSidebar/DataLayerMapStylePanel.jsx:72`
- `home.mock.quick_links.ocop.title` (t().titleKey) at `src/features/map/components/leftSidebar/DataLayerMapStylePanel.jsx:72`
- `home.mock.quick_links.plan.title` (t().titleKey) at `src/features/map/components/leftSidebar/DataLayerMapStylePanel.jsx:72`
- `home.mock.quick_links.service.title` (t().titleKey) at `src/features/map/components/leftSidebar/DataLayerMapStylePanel.jsx:72`
- `home.mock.quick_links.vr.title` (t().titleKey) at `src/features/map/components/leftSidebar/DataLayerMapStylePanel.jsx:72`
- `home.mock.vlog_stories.item_1.title` (t().titleKey) at `src/features/map/components/leftSidebar/DataLayerMapStylePanel.jsx:72`
- `home.mock.vlog_stories.item_2.title` (t().titleKey) at `src/features/map/components/leftSidebar/DataLayerMapStylePanel.jsx:72`
- `home.mock.vlog_stories.item_3.title` (t().titleKey) at `src/features/map/components/leftSidebar/DataLayerMapStylePanel.jsx:72`
- `vlogPage.mock.posts.item_1.title` (t().titleKey) at `src/features/map/components/leftSidebar/DataLayerMapStylePanel.jsx:72`
- `vlogPage.mock.posts.item_2.title` (t().titleKey) at `src/features/map/components/leftSidebar/DataLayerMapStylePanel.jsx:72`
- `vlogPage.mock.posts.item_3.title` (t().titleKey) at `src/features/map/components/leftSidebar/DataLayerMapStylePanel.jsx:72`
- `vlogPage.mock.posts.item_4.title` (t().titleKey) at `src/features/map/components/leftSidebar/DataLayerMapStylePanel.jsx:72`
- `vlogPage.mock.posts.item_5.title` (t().titleKey) at `src/features/map/components/leftSidebar/DataLayerMapStylePanel.jsx:72`
- `vlogPage.mock.posts.item_6.title` (t().titleKey) at `src/features/map/components/leftSidebar/DataLayerMapStylePanel.jsx:72`
- `vlogPage.mock.trending.item_1.title` (t().titleKey) at `src/features/map/components/leftSidebar/DataLayerMapStylePanel.jsx:72`
- `vlogPage.mock.trending.item_2.title` (t().titleKey) at `src/features/map/components/leftSidebar/DataLayerMapStylePanel.jsx:72`
- `vlogPage.mock.trending.item_3.title` (t().titleKey) at `src/features/map/components/leftSidebar/DataLayerMapStylePanel.jsx:72`
- `mapPage.ocopPanel.productCertified` (t()) at `src/features/map/components/OcopProductModal.jsx:113`
- `mapPage.ocopPanel.ocopStars` (t()) at `src/features/map/components/OcopProductModal.jsx:115`
- `mapPage.ocopPanel.oneCommuneOneProduct` (t()) at `src/features/map/components/OcopProductModal.jsx:117`
- `mapPage.ocopPanel.viewDestination` (t()) at `src/features/map/components/OcopProductModal.jsx:128`
- `mapPage.ocopPanel.fallbackProductName` (t()) at `src/features/map/components/OcopProductModal.jsx:45`
- `mapPage.ocopPanel.productModalDescription` (t()) at `src/features/map/components/OcopProductModal.jsx:46`
- `mapPage.ocopPanel.ocopStars` (t()) at `src/features/map/components/OcopProductModal.jsx:75`
- `common.just_updated` (t()) at `src/features/map/components/rightSidebar/CapacityPanel.jsx:115`
- `common.minutes_ago` (t()) at `src/features/map/components/rightSidebar/CapacityPanel.jsx:116`
- `common.hours_ago` (t()) at `src/features/map/components/rightSidebar/CapacityPanel.jsx:118`
- `mapPage.capacityPanel.filteredCount` (t()) at `src/features/map/components/rightSidebar/CapacityPanel.jsx:329`
- `mapPage.capacityPanel.trackedCount` (t()) at `src/features/map/components/rightSidebar/CapacityPanel.jsx:333`
- `mapPage.capacityPanel.capacityWithMax` (t()) at `src/features/map/components/rightSidebar/CapacityPanel.jsx:341`
- `mapPage.capacityPanel.capacityCurrent` (t()) at `src/features/map/components/rightSidebar/CapacityPanel.jsx:345`
- `common.open_in_new_tab` (t()) at `src/features/map/components/rightSidebar/ChatbotPanel.jsx:506`
- `mapPage.capacityPanel.status.moderate` (declared:labelKey) at `src/features/map/components/rightSidebar/TourPanel.jsx:167`
- `mapPage.capacityPanel.status.low` (declared:labelKey) at `src/features/map/components/rightSidebar/TourPanel.jsx:177`
- `mapPage.capacityPanel.status.unknown` (declared:labelKey) at `src/features/map/components/rightSidebar/TourPanel.jsx:182`
- `mapPage.capacityPanel.status.low` (t().labelKey) at `src/features/map/components/rightSidebar/TourPanel.jsx:225`
- `mapPage.capacityPanel.status.moderate` (t().labelKey) at `src/features/map/components/rightSidebar/TourPanel.jsx:225`
- `mapPage.capacityPanel.status.unknown` (t().labelKey) at `src/features/map/components/rightSidebar/TourPanel.jsx:225`
- `mapPage.traffic.summary.total` (t()) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:118`
- `mapPage.traffic.summary.accident` (t()) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:125`
- `mapPage.traffic.summary.jam` (t()) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:132`
- `mapPage.traffic.summary.works` (t()) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:139`
- `mapPage.traffic.summary.avg_delay` (t()) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:170`
- `mapPage.traffic.summary.minutes` (t()) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:173`
- `mapPage.traffic.flowLevels.free_flow` (declared:labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:18`
- `mapPage.traffic.flowLevels.moderate` (declared:labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:19`
- `mapPage.traffic.flowLevels.heavy` (declared:labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:20`
- `mapPage.traffic.flowLevels.severe` (declared:labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:21`
- `home.mock.food_bullets.item_1.label` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `home.mock.food_bullets.item_2.label` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `home.mock.food_bullets.item_3.label` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `home.mock.hero_stats.average_load` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `home.mock.hero_stats.events_offers` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `home.mock.hero_stats.featured` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `home.mock.hero_stats.vr360` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `mapPage.capacityPanel.status.low` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `mapPage.capacityPanel.status.moderate` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `mapPage.capacityPanel.status.unknown` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `mapPage.traffic.flowLevels.free_flow` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `mapPage.traffic.flowLevels.heavy` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `mapPage.traffic.flowLevels.moderate` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `mapPage.traffic.flowLevels.severe` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `satellite.legend.change.no_change` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `satellite.legend.change.road_construction` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `satellite.legend.change.vegetation_gain` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `satellite.legend.change.vegetation_loss` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `satellite.legend.change.vegetation_loss_road` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `satellite.legend.classified.agriculture` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `satellite.legend.classified.bare_land` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `satellite.legend.classified.evergreen_forest` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `satellite.legend.classified.open_forest` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `satellite.legend.classified.shrub_grass` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `satellite.legend.classified.urban` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `satellite.legend.classified.water` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `satellite.legend.heatmap.cool` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `satellite.legend.heatmap.hot` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `satellite.legend.heatmap.moderate` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `satellite.legend.heatmap.very_cool` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `satellite.legend.heatmap.very_hot` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `satellite.legend.heatmap.warm` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `common.natural` (declared:nameKey) at `src/features/map/constant/mapColor.js:3`
- `common.culture` (declared:nameKey) at `src/features/map/constant/mapColor.js:4`
- `common.infrastructure` (declared:nameKey) at `src/features/map/constant/mapColor.js:5`
- `mapPage.mock.destinations.tamCoc.description` (declared:descriptionKey) at `src/features/map/constant/mapPageMockData.js:19`
- `mapPage.mock.destinations.hoaLuOldTown.description` (declared:descriptionKey) at `src/features/map/constant/mapPageMockData.js:41`
- `mapPage.mock.destinations.trangAn.description` (declared:descriptionKey) at `src/features/map/constant/mapPageMockData.js:8`
- `mapPage.mock.tourSuggestions.softDay` (declared:textKey) at `src/features/map/constant/mapPageMockData.js:83`
- `mapPage.mock.tourSuggestions.cultureFocus` (declared:textKey) at `src/features/map/constant/mapPageMockData.js:88`
- `home.mock.featured_destinations.bai_dinh.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `home.mock.featured_destinations.hoa_lu.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `home.mock.featured_destinations.trang_an.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `home.mock.ocop_products.item_1.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `home.mock.ocop_products.item_2.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `home.mock.ocop_products.item_3.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `home.mock.promo_banner.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `home.mock.quick_links.map.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `home.mock.quick_links.ocop.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `home.mock.quick_links.plan.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `home.mock.quick_links.service.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `home.mock.quick_links.vr.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `home.mock.services.item_1.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `home.mock.services.item_2.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `home.mock.services.item_3.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `home.mock.vlog_stories.item_1.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `home.mock.vlog_stories.item_2.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `home.mock.vlog_stories.item_3.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `mapPage.mock.destinations.hoaLuOldTown.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `mapPage.mock.destinations.tamCoc.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `mapPage.mock.destinations.trangAn.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `vlogPage.mock.posts.item_1.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `vlogPage.mock.posts.item_2.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `vlogPage.mock.posts.item_3.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `vlogPage.mock.posts.item_4.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `vlogPage.mock.posts.item_5.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `vlogPage.mock.posts.item_6.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `mapPage.mock.tourSuggestions.cultureFocus` (t().textKey) at `src/features/map/pages/MapPageContent.jsx:155`
- `mapPage.mock.tourSuggestions.softDay` (t().textKey) at `src/features/map/pages/MapPageContent.jsx:155`
- `vlogPage.mock.trending.item_1.text` (t().textKey) at `src/features/map/pages/MapPageContent.jsx:155`
- `vlogPage.mock.trending.item_2.text` (t().textKey) at `src/features/map/pages/MapPageContent.jsx:155`
- `vlogPage.mock.trending.item_3.text` (t().textKey) at `src/features/map/pages/MapPageContent.jsx:155`
- `mapPage.capacityPanel.status.moderate` (declared:labelKey) at `src/features/map/utils/capacityStatus.js:34`
- `mapPage.capacityPanel.status.low` (declared:labelKey) at `src/features/map/utils/capacityStatus.js:52`
- `mapPage.capacityPanel.status.unknown` (declared:labelKey) at `src/features/map/utils/capacityStatus.js:59`
- `home.mock.food_bullets.item_1.label` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `home.mock.food_bullets.item_2.label` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `home.mock.food_bullets.item_3.label` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `home.mock.hero_stats.average_load` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `home.mock.hero_stats.events_offers` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `home.mock.hero_stats.featured` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `home.mock.hero_stats.vr360` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `mapPage.capacityPanel.status.low` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `mapPage.capacityPanel.status.moderate` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `mapPage.capacityPanel.status.unknown` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `mapPage.traffic.flowLevels.free_flow` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `mapPage.traffic.flowLevels.heavy` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `mapPage.traffic.flowLevels.moderate` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `mapPage.traffic.flowLevels.severe` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `satellite.legend.change.no_change` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `satellite.legend.change.road_construction` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `satellite.legend.change.vegetation_gain` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `satellite.legend.change.vegetation_loss` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `satellite.legend.change.vegetation_loss_road` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `satellite.legend.classified.agriculture` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `satellite.legend.classified.bare_land` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `satellite.legend.classified.evergreen_forest` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `satellite.legend.classified.open_forest` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `satellite.legend.classified.shrub_grass` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `satellite.legend.classified.urban` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `satellite.legend.classified.water` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `satellite.legend.heatmap.cool` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `satellite.legend.heatmap.hot` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `satellite.legend.heatmap.moderate` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `satellite.legend.heatmap.very_cool` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `satellite.legend.heatmap.very_hot` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `satellite.legend.heatmap.warm` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `common.errors.http_status` (t()) at `src/features/map/utils/highlightRouteUtils.js:126`
- `newsPage.comments.admin_role` (t()) at `src/features/news/components/NewsCommentSection.jsx:160`
- `home.mock.food_bullets.item_1.label` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `home.mock.food_bullets.item_2.label` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `home.mock.food_bullets.item_3.label` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `home.mock.hero_stats.average_load` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `home.mock.hero_stats.events_offers` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `home.mock.hero_stats.featured` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `home.mock.hero_stats.vr360` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `mapPage.capacityPanel.status.low` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `mapPage.capacityPanel.status.moderate` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `mapPage.capacityPanel.status.unknown` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `mapPage.traffic.flowLevels.free_flow` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `mapPage.traffic.flowLevels.heavy` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `mapPage.traffic.flowLevels.moderate` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `mapPage.traffic.flowLevels.severe` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `satellite.legend.change.no_change` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `satellite.legend.change.road_construction` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `satellite.legend.change.vegetation_gain` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `satellite.legend.change.vegetation_loss` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `satellite.legend.change.vegetation_loss_road` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `satellite.legend.classified.agriculture` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `satellite.legend.classified.bare_land` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `satellite.legend.classified.evergreen_forest` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `satellite.legend.classified.open_forest` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `satellite.legend.classified.shrub_grass` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `satellite.legend.classified.urban` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `satellite.legend.classified.water` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `satellite.legend.heatmap.cool` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `satellite.legend.heatmap.hot` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `satellite.legend.heatmap.moderate` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `satellite.legend.heatmap.very_cool` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `satellite.legend.heatmap.very_hot` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `satellite.legend.heatmap.warm` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `home.mock.food_bullets.item_1.label` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `home.mock.food_bullets.item_2.label` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `home.mock.food_bullets.item_3.label` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `home.mock.hero_stats.average_load` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `home.mock.hero_stats.events_offers` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `home.mock.hero_stats.featured` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `home.mock.hero_stats.vr360` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `mapPage.capacityPanel.status.low` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `mapPage.capacityPanel.status.moderate` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `mapPage.capacityPanel.status.unknown` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `mapPage.traffic.flowLevels.free_flow` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `mapPage.traffic.flowLevels.heavy` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `mapPage.traffic.flowLevels.moderate` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `mapPage.traffic.flowLevels.severe` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `satellite.legend.change.no_change` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `satellite.legend.change.road_construction` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `satellite.legend.change.vegetation_gain` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `satellite.legend.change.vegetation_loss` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `satellite.legend.change.vegetation_loss_road` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `satellite.legend.classified.agriculture` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `satellite.legend.classified.bare_land` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `satellite.legend.classified.evergreen_forest` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `satellite.legend.classified.open_forest` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `satellite.legend.classified.shrub_grass` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `satellite.legend.classified.urban` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `satellite.legend.classified.water` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `satellite.legend.heatmap.cool` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `satellite.legend.heatmap.hot` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `satellite.legend.heatmap.moderate` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `satellite.legend.heatmap.very_cool` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `satellite.legend.heatmap.very_hot` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `satellite.legend.heatmap.warm` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `home.mock.food_bullets.item_1.label` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `home.mock.food_bullets.item_2.label` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `home.mock.food_bullets.item_3.label` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `home.mock.hero_stats.average_load` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `home.mock.hero_stats.events_offers` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `home.mock.hero_stats.featured` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `home.mock.hero_stats.vr360` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `mapPage.capacityPanel.status.low` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `mapPage.capacityPanel.status.moderate` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `mapPage.capacityPanel.status.unknown` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `mapPage.traffic.flowLevels.free_flow` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `mapPage.traffic.flowLevels.heavy` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `mapPage.traffic.flowLevels.moderate` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `mapPage.traffic.flowLevels.severe` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `satellite.legend.change.no_change` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `satellite.legend.change.road_construction` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `satellite.legend.change.vegetation_gain` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `satellite.legend.change.vegetation_loss` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `satellite.legend.change.vegetation_loss_road` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `satellite.legend.classified.agriculture` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `satellite.legend.classified.bare_land` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `satellite.legend.classified.evergreen_forest` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `satellite.legend.classified.open_forest` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `satellite.legend.classified.shrub_grass` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `satellite.legend.classified.urban` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `satellite.legend.classified.water` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `satellite.legend.heatmap.cool` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `satellite.legend.heatmap.hot` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `satellite.legend.heatmap.moderate` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `satellite.legend.heatmap.very_cool` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `satellite.legend.heatmap.very_hot` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `satellite.legend.heatmap.warm` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `home.mock.food_bullets.item_1.label` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `home.mock.food_bullets.item_2.label` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `home.mock.food_bullets.item_3.label` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `home.mock.hero_stats.average_load` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `home.mock.hero_stats.events_offers` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `home.mock.hero_stats.featured` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `home.mock.hero_stats.vr360` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `mapPage.capacityPanel.status.low` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `mapPage.capacityPanel.status.moderate` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `mapPage.capacityPanel.status.unknown` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `mapPage.traffic.flowLevels.free_flow` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `mapPage.traffic.flowLevels.heavy` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `mapPage.traffic.flowLevels.moderate` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `mapPage.traffic.flowLevels.severe` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `satellite.legend.change.no_change` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `satellite.legend.change.road_construction` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `satellite.legend.change.vegetation_gain` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `satellite.legend.change.vegetation_loss` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `satellite.legend.change.vegetation_loss_road` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `satellite.legend.classified.agriculture` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `satellite.legend.classified.bare_land` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `satellite.legend.classified.evergreen_forest` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `satellite.legend.classified.open_forest` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `satellite.legend.classified.shrub_grass` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `satellite.legend.classified.urban` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `satellite.legend.classified.water` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `satellite.legend.heatmap.cool` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `satellite.legend.heatmap.hot` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `satellite.legend.heatmap.moderate` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `satellite.legend.heatmap.very_cool` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `satellite.legend.heatmap.very_hot` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `satellite.legend.heatmap.warm` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `home.mock.food_bullets.item_1.label` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `home.mock.food_bullets.item_2.label` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `home.mock.food_bullets.item_3.label` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `home.mock.hero_stats.average_load` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `home.mock.hero_stats.events_offers` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `home.mock.hero_stats.featured` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `home.mock.hero_stats.vr360` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `mapPage.capacityPanel.status.low` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `mapPage.capacityPanel.status.moderate` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `mapPage.capacityPanel.status.unknown` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `mapPage.traffic.flowLevels.free_flow` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `mapPage.traffic.flowLevels.heavy` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `mapPage.traffic.flowLevels.moderate` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `mapPage.traffic.flowLevels.severe` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `satellite.legend.change.no_change` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `satellite.legend.change.road_construction` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `satellite.legend.change.vegetation_gain` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `satellite.legend.change.vegetation_loss` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `satellite.legend.change.vegetation_loss_road` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `satellite.legend.classified.agriculture` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `satellite.legend.classified.bare_land` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `satellite.legend.classified.evergreen_forest` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `satellite.legend.classified.open_forest` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `satellite.legend.classified.shrub_grass` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `satellite.legend.classified.urban` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `satellite.legend.classified.water` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `satellite.legend.heatmap.cool` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `satellite.legend.heatmap.hot` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `satellite.legend.heatmap.moderate` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `satellite.legend.heatmap.very_cool` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `satellite.legend.heatmap.very_hot` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `satellite.legend.heatmap.warm` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `home.mock.food_bullets.item_1.label` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `home.mock.food_bullets.item_2.label` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `home.mock.food_bullets.item_3.label` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `home.mock.hero_stats.average_load` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `home.mock.hero_stats.events_offers` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `home.mock.hero_stats.featured` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `home.mock.hero_stats.vr360` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `mapPage.capacityPanel.status.low` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `mapPage.capacityPanel.status.moderate` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `mapPage.capacityPanel.status.unknown` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `mapPage.traffic.flowLevels.free_flow` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `mapPage.traffic.flowLevels.heavy` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `mapPage.traffic.flowLevels.moderate` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `mapPage.traffic.flowLevels.severe` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `satellite.legend.change.no_change` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `satellite.legend.change.road_construction` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `satellite.legend.change.vegetation_gain` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `satellite.legend.change.vegetation_loss` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `satellite.legend.change.vegetation_loss_road` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `satellite.legend.classified.agriculture` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `satellite.legend.classified.bare_land` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `satellite.legend.classified.evergreen_forest` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `satellite.legend.classified.open_forest` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `satellite.legend.classified.shrub_grass` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `satellite.legend.classified.urban` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `satellite.legend.classified.water` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `satellite.legend.heatmap.cool` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `satellite.legend.heatmap.hot` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `satellite.legend.heatmap.moderate` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `satellite.legend.heatmap.very_cool` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `satellite.legend.heatmap.very_hot` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `satellite.legend.heatmap.warm` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `satellite.legend.change.road_construction` (declared:labelKey) at `src/features/satellite/constants/satelliteConstants.js:100`
- `satellite.legend.change.vegetation_loss_road` (declared:labelKey) at `src/features/satellite/constants/satelliteConstants.js:101`
- `satellite.legend.heatmap.very_cool` (declared:labelKey) at `src/features/satellite/constants/satelliteConstants.js:80`
- `satellite.legend.heatmap.cool` (declared:labelKey) at `src/features/satellite/constants/satelliteConstants.js:81`
- `satellite.legend.heatmap.moderate` (declared:labelKey) at `src/features/satellite/constants/satelliteConstants.js:82`
- `satellite.legend.heatmap.warm` (declared:labelKey) at `src/features/satellite/constants/satelliteConstants.js:83`
- `satellite.legend.heatmap.hot` (declared:labelKey) at `src/features/satellite/constants/satelliteConstants.js:84`
- `satellite.legend.heatmap.very_hot` (declared:labelKey) at `src/features/satellite/constants/satelliteConstants.js:85`
- `satellite.legend.classified.water` (declared:labelKey) at `src/features/satellite/constants/satelliteConstants.js:88`
- `satellite.legend.classified.bare_land` (declared:labelKey) at `src/features/satellite/constants/satelliteConstants.js:89`
- `satellite.legend.classified.shrub_grass` (declared:labelKey) at `src/features/satellite/constants/satelliteConstants.js:90`
- `satellite.legend.classified.agriculture` (declared:labelKey) at `src/features/satellite/constants/satelliteConstants.js:91`
- `satellite.legend.classified.open_forest` (declared:labelKey) at `src/features/satellite/constants/satelliteConstants.js:92`
- `satellite.legend.classified.evergreen_forest` (declared:labelKey) at `src/features/satellite/constants/satelliteConstants.js:93`
- `satellite.legend.classified.urban` (declared:labelKey) at `src/features/satellite/constants/satelliteConstants.js:94`
- `satellite.legend.change.no_change` (declared:labelKey) at `src/features/satellite/constants/satelliteConstants.js:97`
- `satellite.legend.change.vegetation_loss` (declared:labelKey) at `src/features/satellite/constants/satelliteConstants.js:98`
- `satellite.legend.change.vegetation_gain` (declared:labelKey) at `src/features/satellite/constants/satelliteConstants.js:99`
- `common.new` (t()) at `src/features/tourism-points/components/list/TourismPointCards.jsx:123`
- `tourPage.routeOverview` (t()) at `src/features/tours/pages/TourDetailPage.jsx:493`
- `tourPage.defaultSchedule` (t()) at `src/features/tours/pages/TourDetailPage.jsx:529`
- `tourPage.stops` (t()) at `src/features/tours/pages/TourDetailPage.jsx:533`
- `tourPage.guestRange` (t()) at `src/features/tours/pages/TourDetailPage.jsx:547`
- `tourPage.suitableForGroups` (t()) at `src/features/tours/pages/TourDetailPage.jsx:548`
- `tourPage.dayHeading` (t()) at `src/features/tours/pages/TourDetailPage.jsx:589`
- `tourPage.defaultSchedule` (t()) at `src/features/tours/pages/TourDetailPage.jsx:596`
- `tourPage.dayLabel` (t()) at `src/features/tours/pages/TourDetailPage.jsx:597`
- `tourPage.stopLabel` (t()) at `src/features/tours/pages/TourDetailPage.jsx:622`
- `tourPage.minutesLabel` (t()) at `src/features/tours/pages/TourDetailPage.jsx:627`
- `tourPage.capacityLoad` (t()) at `src/features/tours/pages/TourDetailPage.jsx:635`
- `tourPage.capacityLoad` (t()) at `src/features/tours/pages/TourDetailPage.jsx:637`
- `tourPage.capacityLoad` (t()) at `src/features/tours/pages/TourDetailPage.jsx:638`
- `tourPage.priceNote` (t()) at `src/features/tours/pages/TourDetailPage.jsx:748`
- `tourPage.bookTrip` (t()) at `src/features/tours/pages/TourDetailPage.jsx:761`
- `tourPage.bookTrip` (t()) at `src/features/tours/pages/TourDetailPage.jsx:771`
- `vlogPage.mock.trending.item_1.title` (declared:titleKey) at `src/features/vlog/data/vlogData.js:101`
- `vlogPage.mock.trending.item_1.text` (declared:textKey) at `src/features/vlog/data/vlogData.js:102`
- `vlogPage.mock.trending.item_2.title` (declared:titleKey) at `src/features/vlog/data/vlogData.js:108`
- `vlogPage.mock.trending.item_2.text` (declared:textKey) at `src/features/vlog/data/vlogData.js:109`
- `vlogPage.mock.trending.item_3.title` (declared:titleKey) at `src/features/vlog/data/vlogData.js:115`
- `vlogPage.mock.trending.item_3.text` (declared:textKey) at `src/features/vlog/data/vlogData.js:116`
- `vlogPage.mock.posts.item_1.description` (declared:descriptionKey) at `src/features/vlog/data/vlogData.js:13`
- `vlogPage.mock.time.today` (declared:dateLabelKey) at `src/features/vlog/data/vlogData.js:14`
- `vlogPage.mock.posts.item_2.title` (declared:titleKey) at `src/features/vlog/data/vlogData.js:19`
- `vlogPage.mock.places.tam_coc` (declared:placeKey) at `src/features/vlog/data/vlogData.js:20`
- `vlogPage.mock.posts.item_2.description` (declared:descriptionKey) at `src/features/vlog/data/vlogData.js:28`
- `vlogPage.mock.time.hours_ago` (declared:dateLabelKey) at `src/features/vlog/data/vlogData.js:29`
- `vlogPage.mock.posts.item_3.title` (declared:titleKey) at `src/features/vlog/data/vlogData.js:35`
- `vlogPage.mock.places.bai_dinh` (declared:placeKey) at `src/features/vlog/data/vlogData.js:36`
- `vlogPage.mock.posts.item_1.title` (declared:titleKey) at `src/features/vlog/data/vlogData.js:4`
- `vlogPage.mock.posts.item_3.description` (declared:descriptionKey) at `src/features/vlog/data/vlogData.js:44`
- `vlogPage.mock.time.yesterday` (declared:dateLabelKey) at `src/features/vlog/data/vlogData.js:45`
- `vlogPage.mock.places.trang_an` (declared:placeKey) at `src/features/vlog/data/vlogData.js:5`
- `vlogPage.mock.posts.item_4.title` (declared:titleKey) at `src/features/vlog/data/vlogData.js:50`
- `vlogPage.mock.places.ha_long` (declared:placeKey) at `src/features/vlog/data/vlogData.js:51`
- `vlogPage.topics.checkin` (declared:topicKey) at `src/features/vlog/data/vlogData.js:53`
- `vlogPage.mock.posts.item_4.description` (declared:descriptionKey) at `src/features/vlog/data/vlogData.js:59`
- `vlogPage.mock.time.days_ago` (declared:dateLabelKey) at `src/features/vlog/data/vlogData.js:60`
- `vlogPage.mock.posts.item_5.title` (declared:titleKey) at `src/features/vlog/data/vlogData.js:66`
- `vlogPage.mock.places.ninh_binh` (declared:placeKey) at `src/features/vlog/data/vlogData.js:67`
- `vlogPage.topics.nature` (declared:topicKey) at `src/features/vlog/data/vlogData.js:7`
- `vlogPage.mock.posts.item_5.description` (declared:descriptionKey) at `src/features/vlog/data/vlogData.js:75`
- `vlogPage.mock.time.days_ago` (declared:dateLabelKey) at `src/features/vlog/data/vlogData.js:76`
- `vlogPage.mock.posts.item_6.title` (declared:titleKey) at `src/features/vlog/data/vlogData.js:82`
- `vlogPage.mock.places.ninh_binh` (declared:placeKey) at `src/features/vlog/data/vlogData.js:83`
- `vlogPage.mock.posts.item_6.description` (declared:descriptionKey) at `src/features/vlog/data/vlogData.js:91`
- `vlogPage.mock.time.weeks_ago` (declared:dateLabelKey) at `src/features/vlog/data/vlogData.js:92`
- `home.mock.hero_events.hoa_lu.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:38`
- `home.mock.hero_events.light_show.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:38`
- `home.mock.hero_events.tourism_week.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:38`
- `home.mock.news_items.item_1.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:38`
- `home.mock.news_items.item_2.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:38`
- `home.mock.news_items.item_3.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:38`
- `home.mock.promo_banner.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:38`
- `home.mock.quick_links.map.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:38`
- `home.mock.quick_links.ocop.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:38`
- `home.mock.quick_links.plan.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:38`
- `home.mock.quick_links.service.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:38`
- `home.mock.quick_links.vr.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:38`
- `home.mock.vlog_stories.item_1.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:38`
- `home.mock.vlog_stories.item_2.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:38`
- `home.mock.vlog_stories.item_3.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:38`
- `vlogPage.mock.posts.item_1.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:38`
- `vlogPage.mock.posts.item_2.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:38`
- `vlogPage.mock.posts.item_3.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:38`
- `vlogPage.mock.posts.item_4.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:38`
- `vlogPage.mock.posts.item_5.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:38`
- `vlogPage.mock.posts.item_6.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:38`
- `vlogPage.mock.trending.item_1.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:38`
- `vlogPage.mock.trending.item_2.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:38`
- `vlogPage.mock.trending.item_3.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:38`
- `vlogPage.mock.places.bai_dinh` (t().placeKey) at `src/features/vlog/pages/VlogPageContent.jsx:39`
- `vlogPage.mock.places.ha_long` (t().placeKey) at `src/features/vlog/pages/VlogPageContent.jsx:39`
- `vlogPage.mock.places.ninh_binh` (t().placeKey) at `src/features/vlog/pages/VlogPageContent.jsx:39`
- `vlogPage.mock.places.tam_coc` (t().placeKey) at `src/features/vlog/pages/VlogPageContent.jsx:39`
- `vlogPage.mock.places.trang_an` (t().placeKey) at `src/features/vlog/pages/VlogPageContent.jsx:39`
- `home.mock.services.item_1.type` (t().typeKey) at `src/features/vlog/pages/VlogPageContent.jsx:40`
- `home.mock.services.item_2.type` (t().typeKey) at `src/features/vlog/pages/VlogPageContent.jsx:40`
- `home.mock.services.item_3.type` (t().typeKey) at `src/features/vlog/pages/VlogPageContent.jsx:40`
- `vlogPage.topics.checkin` (t().topicKey) at `src/features/vlog/pages/VlogPageContent.jsx:41`
- `vlogPage.topics.nature` (t().topicKey) at `src/features/vlog/pages/VlogPageContent.jsx:41`
- `home.mock.featured_destinations.bai_dinh.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `home.mock.featured_destinations.hoa_lu.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `home.mock.featured_destinations.trang_an.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `home.mock.ocop_products.item_1.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `home.mock.ocop_products.item_2.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `home.mock.ocop_products.item_3.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `home.mock.promo_banner.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `home.mock.quick_links.map.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `home.mock.quick_links.ocop.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `home.mock.quick_links.plan.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `home.mock.quick_links.service.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `home.mock.quick_links.vr.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `home.mock.services.item_1.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `home.mock.services.item_2.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `home.mock.services.item_3.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `home.mock.vlog_stories.item_1.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `home.mock.vlog_stories.item_2.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `home.mock.vlog_stories.item_3.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `mapPage.mock.destinations.hoaLuOldTown.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `mapPage.mock.destinations.tamCoc.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `mapPage.mock.destinations.trangAn.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `vlogPage.mock.posts.item_1.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `vlogPage.mock.posts.item_2.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `vlogPage.mock.posts.item_3.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `vlogPage.mock.posts.item_4.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `vlogPage.mock.posts.item_5.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `vlogPage.mock.posts.item_6.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `vlogPage.mock.time.days_ago` (t().dateLabelKey) at `src/features/vlog/pages/VlogPageContent.jsx:43`
- `vlogPage.mock.time.hours_ago` (t().dateLabelKey) at `src/features/vlog/pages/VlogPageContent.jsx:43`
- `vlogPage.mock.time.today` (t().dateLabelKey) at `src/features/vlog/pages/VlogPageContent.jsx:43`
- `vlogPage.mock.time.weeks_ago` (t().dateLabelKey) at `src/features/vlog/pages/VlogPageContent.jsx:43`
- `vlogPage.mock.time.yesterday` (t().dateLabelKey) at `src/features/vlog/pages/VlogPageContent.jsx:43`
- `home.mock.hero_events.hoa_lu.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:51`
- `home.mock.hero_events.light_show.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:51`
- `home.mock.hero_events.tourism_week.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:51`
- `home.mock.news_items.item_1.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:51`
- `home.mock.news_items.item_2.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:51`
- `home.mock.news_items.item_3.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:51`
- `home.mock.promo_banner.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:51`
- `home.mock.quick_links.map.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:51`
- `home.mock.quick_links.ocop.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:51`
- `home.mock.quick_links.plan.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:51`
- `home.mock.quick_links.service.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:51`
- `home.mock.quick_links.vr.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:51`
- `home.mock.vlog_stories.item_1.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:51`
- `home.mock.vlog_stories.item_2.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:51`
- `home.mock.vlog_stories.item_3.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:51`
- `vlogPage.mock.posts.item_1.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:51`
- `vlogPage.mock.posts.item_2.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:51`
- `vlogPage.mock.posts.item_3.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:51`
- `vlogPage.mock.posts.item_4.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:51`
- `vlogPage.mock.posts.item_5.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:51`
- `vlogPage.mock.posts.item_6.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:51`
- `vlogPage.mock.trending.item_1.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:51`
- `vlogPage.mock.trending.item_2.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:51`
- `vlogPage.mock.trending.item_3.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:51`
- `mapPage.mock.tourSuggestions.cultureFocus` (t().textKey) at `src/features/vlog/pages/VlogPageContent.jsx:52`
- `mapPage.mock.tourSuggestions.softDay` (t().textKey) at `src/features/vlog/pages/VlogPageContent.jsx:52`
- `vlogPage.mock.trending.item_1.text` (t().textKey) at `src/features/vlog/pages/VlogPageContent.jsx:52`
- `vlogPage.mock.trending.item_2.text` (t().textKey) at `src/features/vlog/pages/VlogPageContent.jsx:52`
- `vlogPage.mock.trending.item_3.text` (t().textKey) at `src/features/vlog/pages/VlogPageContent.jsx:52`
- `common.errors.session_expired` (t()) at `src/services/apiClient.js:39`
- `common.errors.occurred` (t()) at `src/services/errorUtils.jsx:5`
- `common.errors.session_expired` (t()) at `src/services/useApi.js:109`
- `common.errors.session_expired` (t()) at `src/services/useApi.js:185`
- `common.errors.session_expired` (t()) at `src/services/useApi.js:247`

### Missing in VI

- `common.errors.carousel_context` (t()) at `src/components/ui/carousel.jsx:15`
- `common.errors.file_upload_root_context` (t()) at `src/components/ui/file-upload.jsx:124`
- `common.errors.file_upload_item_context` (t()) at `src/components/ui/file-upload.jsx:841`
- `common.errors.file_upload_root_context` (t()) at `src/components/ui/file-upload.jsx:93`
- `home.mock.hero_events.hoa_lu.title` (declared:titleKey) at `src/features/home/data/homeData.js:10`
- `home.mock.news_items.item_1.excerpt` (declared:excerptKey) at `src/features/home/data/homeData.js:101`
- `home.mock.news_items.item_2.title` (declared:titleKey) at `src/features/home/data/homeData.js:104`
- `home.mock.news_items.item_2.excerpt` (declared:excerptKey) at `src/features/home/data/homeData.js:106`
- `home.mock.news_items.item_3.title` (declared:titleKey) at `src/features/home/data/homeData.js:109`
- `home.mock.hero_events.hoa_lu.time` (declared:timeKey) at `src/features/home/data/homeData.js:11`
- `home.mock.news_items.item_3.excerpt` (declared:excerptKey) at `src/features/home/data/homeData.js:111`
- `home.mock.itinerary.item_1` (declared:activityKey) at `src/features/home/data/homeData.js:115`
- `home.mock.itinerary.item_2` (declared:activityKey) at `src/features/home/data/homeData.js:116`
- `home.mock.itinerary.item_3` (declared:activityKey) at `src/features/home/data/homeData.js:117`
- `home.mock.itinerary.item_4` (declared:activityKey) at `src/features/home/data/homeData.js:118`
- `home.mock.itinerary.item_5` (declared:activityKey) at `src/features/home/data/homeData.js:119`
- `home.mock.food_bullets.item_1.label` (declared:labelKey) at `src/features/home/data/homeData.js:128`
- `home.mock.food_bullets.item_2.label` (declared:labelKey) at `src/features/home/data/homeData.js:130`
- `home.mock.food_bullets.item_2.value` (declared:valueKey) at `src/features/home/data/homeData.js:131`
- `home.mock.food_bullets.item_3.label` (declared:labelKey) at `src/features/home/data/homeData.js:133`
- `home.mock.services.item_1.name` (declared:nameKey) at `src/features/home/data/homeData.js:137`
- `home.mock.services.item_1.type` (declared:typeKey) at `src/features/home/data/homeData.js:138`
- `home.mock.hero_events.tourism_week.title` (declared:titleKey) at `src/features/home/data/homeData.js:14`
- `home.mock.services.item_1.price` (declared:priceKey) at `src/features/home/data/homeData.js:140`
- `home.mock.services.item_1.description` (declared:descriptionKey) at `src/features/home/data/homeData.js:142`
- `home.mock.services.item_2.name` (declared:nameKey) at `src/features/home/data/homeData.js:147`
- `home.mock.services.item_2.type` (declared:typeKey) at `src/features/home/data/homeData.js:148`
- `home.mock.hero_events.tourism_week.time` (declared:timeKey) at `src/features/home/data/homeData.js:15`
- `home.mock.services.item_2.price` (declared:priceKey) at `src/features/home/data/homeData.js:150`
- `home.mock.services.item_2.description` (declared:descriptionKey) at `src/features/home/data/homeData.js:152`
- `home.mock.services.item_3.name` (declared:nameKey) at `src/features/home/data/homeData.js:157`
- `home.mock.services.item_3.type` (declared:typeKey) at `src/features/home/data/homeData.js:158`
- `home.mock.services.item_3.price` (declared:priceKey) at `src/features/home/data/homeData.js:160`
- `home.mock.services.item_3.description` (declared:descriptionKey) at `src/features/home/data/homeData.js:162`
- `home.mock.ocop_products.item_1.name` (declared:nameKey) at `src/features/home/data/homeData.js:169`
- `home.mock.ocop_products.item_1.stars` (declared:starsKey) at `src/features/home/data/homeData.js:170`
- `home.mock.common.ninh_binh` (declared:originKey) at `src/features/home/data/homeData.js:171`
- `home.mock.ocop_products.item_1.price` (declared:priceKey) at `src/features/home/data/homeData.js:172`
- `home.mock.ocop_products.item_1.description` (declared:descriptionKey) at `src/features/home/data/homeData.js:173`
- `home.mock.ocop_products.item_2.name` (declared:nameKey) at `src/features/home/data/homeData.js:178`
- `home.mock.ocop_products.item_2.stars` (declared:starsKey) at `src/features/home/data/homeData.js:179`
- `home.mock.hero_events.light_show.title` (declared:titleKey) at `src/features/home/data/homeData.js:18`
- `home.mock.common.ninh_binh` (declared:originKey) at `src/features/home/data/homeData.js:180`
- `home.mock.ocop_products.item_2.price` (declared:priceKey) at `src/features/home/data/homeData.js:181`
- `home.mock.ocop_products.item_2.description` (declared:descriptionKey) at `src/features/home/data/homeData.js:182`
- `home.mock.ocop_products.item_3.name` (declared:nameKey) at `src/features/home/data/homeData.js:187`
- `home.mock.ocop_products.item_3.stars` (declared:starsKey) at `src/features/home/data/homeData.js:188`
- `home.mock.common.kim_son` (declared:originKey) at `src/features/home/data/homeData.js:189`
- `home.mock.hero_events.light_show.time` (declared:timeKey) at `src/features/home/data/homeData.js:19`
- `home.mock.ocop_products.item_3.price` (declared:priceKey) at `src/features/home/data/homeData.js:190`
- `home.mock.ocop_products.item_3.description` (declared:descriptionKey) at `src/features/home/data/homeData.js:191`
- `home.mock.vlog_stories.item_1.title` (declared:titleKey) at `src/features/home/data/homeData.js:198`
- `home.mock.vlog_stories.item_1.description` (declared:descriptionKey) at `src/features/home/data/homeData.js:200`
- `home.mock.vlog_stories.item_2.title` (declared:titleKey) at `src/features/home/data/homeData.js:205`
- `home.mock.vlog_stories.item_2.description` (declared:descriptionKey) at `src/features/home/data/homeData.js:207`
- `home.mock.vlog_stories.item_3.title` (declared:titleKey) at `src/features/home/data/homeData.js:212`
- `home.mock.vlog_stories.item_3.description` (declared:descriptionKey) at `src/features/home/data/homeData.js:214`
- `home.mock.promo_banner.title` (declared:titleKey) at `src/features/home/data/homeData.js:23`
- `home.mock.promo_banner.description` (declared:descriptionKey) at `src/features/home/data/homeData.js:24`
- `home.mock.promo_banner.cta` (declared:ctaKey) at `src/features/home/data/homeData.js:25`
- `home.mock.hero_stats.featured` (declared:labelKey) at `src/features/home/data/homeData.js:3`
- `home.mock.quick_links.map.title` (declared:titleKey) at `src/features/home/data/homeData.js:32`
- `home.mock.quick_links.map.description` (declared:descriptionKey) at `src/features/home/data/homeData.js:33`
- `home.mock.quick_links.vr.title` (declared:titleKey) at `src/features/home/data/homeData.js:39`
- `home.mock.hero_stats.average_load` (declared:labelKey) at `src/features/home/data/homeData.js:4`
- `home.mock.quick_links.vr.description` (declared:descriptionKey) at `src/features/home/data/homeData.js:40`
- `home.mock.quick_links.plan.title` (declared:titleKey) at `src/features/home/data/homeData.js:46`
- `home.mock.quick_links.plan.description` (declared:descriptionKey) at `src/features/home/data/homeData.js:47`
- `home.mock.hero_stats.events_offers` (declared:labelKey) at `src/features/home/data/homeData.js:5`
- `home.mock.quick_links.service.title` (declared:titleKey) at `src/features/home/data/homeData.js:53`
- `home.mock.quick_links.service.description` (declared:descriptionKey) at `src/features/home/data/homeData.js:54`
- `home.mock.hero_stats.vr360` (declared:labelKey) at `src/features/home/data/homeData.js:6`
- `home.mock.quick_links.ocop.title` (declared:titleKey) at `src/features/home/data/homeData.js:60`
- `home.mock.quick_links.ocop.description` (declared:descriptionKey) at `src/features/home/data/homeData.js:61`
- `home.mock.featured_destinations.trang_an.name` (declared:nameKey) at `src/features/home/data/homeData.js:68`
- `home.mock.common.ninh_binh` (declared:provinceKey) at `src/features/home/data/homeData.js:69`
- `home.mock.featured_destinations.trang_an.subtitle` (declared:subtitleKey) at `src/features/home/data/homeData.js:70`
- `home.mock.featured_destinations.trang_an.description` (declared:descriptionKey) at `src/features/home/data/homeData.js:72`
- `home.mock.featured_destinations.hoa_lu.name` (declared:nameKey) at `src/features/home/data/homeData.js:78`
- `home.mock.common.ninh_binh` (declared:provinceKey) at `src/features/home/data/homeData.js:79`
- `home.mock.featured_destinations.hoa_lu.subtitle` (declared:subtitleKey) at `src/features/home/data/homeData.js:80`
- `home.mock.featured_destinations.hoa_lu.description` (declared:descriptionKey) at `src/features/home/data/homeData.js:82`
- `home.mock.featured_destinations.bai_dinh.name` (declared:nameKey) at `src/features/home/data/homeData.js:88`
- `home.mock.common.ninh_binh` (declared:provinceKey) at `src/features/home/data/homeData.js:89`
- `home.mock.featured_destinations.bai_dinh.subtitle` (declared:subtitleKey) at `src/features/home/data/homeData.js:90`
- `home.mock.featured_destinations.bai_dinh.description` (declared:descriptionKey) at `src/features/home/data/homeData.js:92`
- `home.mock.news_items.item_1.title` (declared:titleKey) at `src/features/home/data/homeData.js:99`
- `home.mock.hero_events.hoa_lu.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1054`
- `home.mock.hero_events.light_show.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1054`
- `home.mock.hero_events.tourism_week.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1054`
- `home.mock.news_items.item_1.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1054`
- `home.mock.news_items.item_2.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1054`
- `home.mock.news_items.item_3.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1054`
- `home.mock.promo_banner.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1054`
- `home.mock.quick_links.map.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1054`
- `home.mock.quick_links.ocop.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1054`
- `home.mock.quick_links.plan.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1054`
- `home.mock.quick_links.service.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1054`
- `home.mock.quick_links.vr.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1054`
- `home.mock.vlog_stories.item_1.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1054`
- `home.mock.vlog_stories.item_2.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1054`
- `home.mock.vlog_stories.item_3.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1054`
- `vlogPage.mock.posts.item_1.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1054`
- `vlogPage.mock.posts.item_2.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1054`
- `vlogPage.mock.posts.item_3.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1054`
- `vlogPage.mock.posts.item_4.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1054`
- `vlogPage.mock.posts.item_5.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1054`
- `vlogPage.mock.posts.item_6.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1054`
- `vlogPage.mock.trending.item_1.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1054`
- `vlogPage.mock.trending.item_2.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1054`
- `vlogPage.mock.trending.item_3.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1054`
- `home.mock.hero_events.hoa_lu.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1302`
- `home.mock.hero_events.light_show.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1302`
- `home.mock.hero_events.tourism_week.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1302`
- `home.mock.news_items.item_1.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1302`
- `home.mock.news_items.item_2.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1302`
- `home.mock.news_items.item_3.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1302`
- `home.mock.promo_banner.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1302`
- `home.mock.quick_links.map.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1302`
- `home.mock.quick_links.ocop.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1302`
- `home.mock.quick_links.plan.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1302`
- `home.mock.quick_links.service.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1302`
- `home.mock.quick_links.vr.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1302`
- `home.mock.vlog_stories.item_1.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1302`
- `home.mock.vlog_stories.item_2.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1302`
- `home.mock.vlog_stories.item_3.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1302`
- `vlogPage.mock.posts.item_1.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1302`
- `vlogPage.mock.posts.item_2.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1302`
- `vlogPage.mock.posts.item_3.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1302`
- `vlogPage.mock.posts.item_4.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1302`
- `vlogPage.mock.posts.item_5.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1302`
- `vlogPage.mock.posts.item_6.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1302`
- `vlogPage.mock.trending.item_1.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1302`
- `vlogPage.mock.trending.item_2.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1302`
- `vlogPage.mock.trending.item_3.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:1302`
- `home.mock.food_bullets.item_1.label` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `home.mock.food_bullets.item_2.label` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `home.mock.food_bullets.item_3.label` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `home.mock.hero_stats.average_load` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `home.mock.hero_stats.events_offers` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `home.mock.hero_stats.featured` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `home.mock.hero_stats.vr360` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `mapPage.capacityPanel.status.low` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `mapPage.capacityPanel.status.moderate` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `mapPage.capacityPanel.status.unknown` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `mapPage.traffic.flowLevels.free_flow` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `mapPage.traffic.flowLevels.heavy` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `mapPage.traffic.flowLevels.moderate` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `mapPage.traffic.flowLevels.severe` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `satellite.legend.change.no_change` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `satellite.legend.change.road_construction` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `satellite.legend.change.vegetation_gain` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `satellite.legend.change.vegetation_loss` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `satellite.legend.change.vegetation_loss_road` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `satellite.legend.classified.agriculture` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `satellite.legend.classified.bare_land` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `satellite.legend.classified.evergreen_forest` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `satellite.legend.classified.open_forest` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `satellite.legend.classified.shrub_grass` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `satellite.legend.classified.urban` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `satellite.legend.classified.water` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `satellite.legend.heatmap.cool` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `satellite.legend.heatmap.hot` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `satellite.legend.heatmap.moderate` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `satellite.legend.heatmap.very_cool` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `satellite.legend.heatmap.very_hot` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `satellite.legend.heatmap.warm` (t().labelKey) at `src/features/home/pages/HomePageContent.jsx:299`
- `home.mock.hero_events.hoa_lu.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:306`
- `home.mock.hero_events.light_show.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:306`
- `home.mock.hero_events.tourism_week.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:306`
- `home.mock.news_items.item_1.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:306`
- `home.mock.news_items.item_2.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:306`
- `home.mock.news_items.item_3.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:306`
- `home.mock.promo_banner.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:306`
- `home.mock.quick_links.map.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:306`
- `home.mock.quick_links.ocop.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:306`
- `home.mock.quick_links.plan.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:306`
- `home.mock.quick_links.service.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:306`
- `home.mock.quick_links.vr.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:306`
- `home.mock.vlog_stories.item_1.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:306`
- `home.mock.vlog_stories.item_2.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:306`
- `home.mock.vlog_stories.item_3.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:306`
- `vlogPage.mock.posts.item_1.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:306`
- `vlogPage.mock.posts.item_2.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:306`
- `vlogPage.mock.posts.item_3.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:306`
- `vlogPage.mock.posts.item_4.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:306`
- `vlogPage.mock.posts.item_5.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:306`
- `vlogPage.mock.posts.item_6.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:306`
- `vlogPage.mock.trending.item_1.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:306`
- `vlogPage.mock.trending.item_2.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:306`
- `vlogPage.mock.trending.item_3.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:306`
- `home.mock.featured_destinations.bai_dinh.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `home.mock.featured_destinations.hoa_lu.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `home.mock.featured_destinations.trang_an.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `home.mock.ocop_products.item_1.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `home.mock.ocop_products.item_2.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `home.mock.ocop_products.item_3.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `home.mock.promo_banner.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `home.mock.quick_links.map.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `home.mock.quick_links.ocop.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `home.mock.quick_links.plan.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `home.mock.quick_links.service.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `home.mock.quick_links.vr.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `home.mock.services.item_1.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `home.mock.services.item_2.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `home.mock.services.item_3.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `home.mock.vlog_stories.item_1.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `home.mock.vlog_stories.item_2.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `home.mock.vlog_stories.item_3.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `mapPage.mock.destinations.hoaLuOldTown.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `mapPage.mock.destinations.tamCoc.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `mapPage.mock.destinations.trangAn.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `vlogPage.mock.posts.item_1.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `vlogPage.mock.posts.item_2.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `vlogPage.mock.posts.item_3.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `vlogPage.mock.posts.item_4.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `vlogPage.mock.posts.item_5.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `vlogPage.mock.posts.item_6.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:307`
- `home.mock.itinerary.item_1` (t().activityKey) at `src/features/home/pages/HomePageContent.jsx:312`
- `home.mock.itinerary.item_2` (t().activityKey) at `src/features/home/pages/HomePageContent.jsx:312`
- `home.mock.itinerary.item_3` (t().activityKey) at `src/features/home/pages/HomePageContent.jsx:312`
- `home.mock.itinerary.item_4` (t().activityKey) at `src/features/home/pages/HomePageContent.jsx:312`
- `home.mock.itinerary.item_5` (t().activityKey) at `src/features/home/pages/HomePageContent.jsx:312`
- `common.culture` (t().nameKey) at `src/features/home/pages/HomePageContent.jsx:319`
- `common.infrastructure` (t().nameKey) at `src/features/home/pages/HomePageContent.jsx:319`
- `common.natural` (t().nameKey) at `src/features/home/pages/HomePageContent.jsx:319`
- `home.mock.featured_destinations.bai_dinh.name` (t().nameKey) at `src/features/home/pages/HomePageContent.jsx:319`
- `home.mock.featured_destinations.hoa_lu.name` (t().nameKey) at `src/features/home/pages/HomePageContent.jsx:319`
- `home.mock.featured_destinations.trang_an.name` (t().nameKey) at `src/features/home/pages/HomePageContent.jsx:319`
- `home.mock.ocop_products.item_1.name` (t().nameKey) at `src/features/home/pages/HomePageContent.jsx:319`
- `home.mock.ocop_products.item_2.name` (t().nameKey) at `src/features/home/pages/HomePageContent.jsx:319`
- `home.mock.ocop_products.item_3.name` (t().nameKey) at `src/features/home/pages/HomePageContent.jsx:319`
- `home.mock.services.item_1.name` (t().nameKey) at `src/features/home/pages/HomePageContent.jsx:319`
- `home.mock.services.item_2.name` (t().nameKey) at `src/features/home/pages/HomePageContent.jsx:319`
- `home.mock.services.item_3.name` (t().nameKey) at `src/features/home/pages/HomePageContent.jsx:319`
- `home.mock.common.ninh_binh` (t().provinceKey) at `src/features/home/pages/HomePageContent.jsx:320`
- `home.mock.featured_destinations.bai_dinh.subtitle` (t().subtitleKey) at `src/features/home/pages/HomePageContent.jsx:321`
- `home.mock.featured_destinations.hoa_lu.subtitle` (t().subtitleKey) at `src/features/home/pages/HomePageContent.jsx:321`
- `home.mock.featured_destinations.trang_an.subtitle` (t().subtitleKey) at `src/features/home/pages/HomePageContent.jsx:321`
- `home.mock.featured_destinations.bai_dinh.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `home.mock.featured_destinations.hoa_lu.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `home.mock.featured_destinations.trang_an.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `home.mock.ocop_products.item_1.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `home.mock.ocop_products.item_2.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `home.mock.ocop_products.item_3.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `home.mock.promo_banner.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `home.mock.quick_links.map.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `home.mock.quick_links.ocop.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `home.mock.quick_links.plan.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `home.mock.quick_links.service.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `home.mock.quick_links.vr.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `home.mock.services.item_1.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `home.mock.services.item_2.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `home.mock.services.item_3.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `home.mock.vlog_stories.item_1.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `home.mock.vlog_stories.item_2.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `home.mock.vlog_stories.item_3.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `mapPage.mock.destinations.hoaLuOldTown.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `mapPage.mock.destinations.tamCoc.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `mapPage.mock.destinations.trangAn.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `vlogPage.mock.posts.item_1.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `vlogPage.mock.posts.item_2.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `vlogPage.mock.posts.item_3.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `vlogPage.mock.posts.item_4.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `vlogPage.mock.posts.item_5.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `vlogPage.mock.posts.item_6.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:322`
- `home.mock.hero_events.hoa_lu.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:330`
- `home.mock.hero_events.light_show.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:330`
- `home.mock.hero_events.tourism_week.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:330`
- `home.mock.news_items.item_1.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:330`
- `home.mock.news_items.item_2.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:330`
- `home.mock.news_items.item_3.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:330`
- `home.mock.promo_banner.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:330`
- `home.mock.quick_links.map.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:330`
- `home.mock.quick_links.ocop.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:330`
- `home.mock.quick_links.plan.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:330`
- `home.mock.quick_links.service.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:330`
- `home.mock.quick_links.vr.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:330`
- `home.mock.vlog_stories.item_1.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:330`
- `home.mock.vlog_stories.item_2.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:330`
- `home.mock.vlog_stories.item_3.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:330`
- `vlogPage.mock.posts.item_1.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:330`
- `vlogPage.mock.posts.item_2.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:330`
- `vlogPage.mock.posts.item_3.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:330`
- `vlogPage.mock.posts.item_4.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:330`
- `vlogPage.mock.posts.item_5.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:330`
- `vlogPage.mock.posts.item_6.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:330`
- `vlogPage.mock.trending.item_1.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:330`
- `vlogPage.mock.trending.item_2.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:330`
- `vlogPage.mock.trending.item_3.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:330`
- `home.mock.featured_destinations.bai_dinh.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `home.mock.featured_destinations.hoa_lu.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `home.mock.featured_destinations.trang_an.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `home.mock.ocop_products.item_1.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `home.mock.ocop_products.item_2.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `home.mock.ocop_products.item_3.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `home.mock.promo_banner.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `home.mock.quick_links.map.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `home.mock.quick_links.ocop.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `home.mock.quick_links.plan.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `home.mock.quick_links.service.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `home.mock.quick_links.vr.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `home.mock.services.item_1.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `home.mock.services.item_2.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `home.mock.services.item_3.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `home.mock.vlog_stories.item_1.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `home.mock.vlog_stories.item_2.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `home.mock.vlog_stories.item_3.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `mapPage.mock.destinations.hoaLuOldTown.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `mapPage.mock.destinations.tamCoc.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `mapPage.mock.destinations.trangAn.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `vlogPage.mock.posts.item_1.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `vlogPage.mock.posts.item_2.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `vlogPage.mock.posts.item_3.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `vlogPage.mock.posts.item_4.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `vlogPage.mock.posts.item_5.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `vlogPage.mock.posts.item_6.description` (t().descriptionKey) at `src/features/home/pages/HomePageContent.jsx:331`
- `home.mock.hero_events.hoa_lu.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:367`
- `home.mock.hero_events.light_show.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:367`
- `home.mock.hero_events.tourism_week.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:367`
- `home.mock.news_items.item_1.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:367`
- `home.mock.news_items.item_2.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:367`
- `home.mock.news_items.item_3.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:367`
- `home.mock.promo_banner.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:367`
- `home.mock.quick_links.map.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:367`
- `home.mock.quick_links.ocop.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:367`
- `home.mock.quick_links.plan.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:367`
- `home.mock.quick_links.service.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:367`
- `home.mock.quick_links.vr.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:367`
- `home.mock.vlog_stories.item_1.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:367`
- `home.mock.vlog_stories.item_2.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:367`
- `home.mock.vlog_stories.item_3.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:367`
- `vlogPage.mock.posts.item_1.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:367`
- `vlogPage.mock.posts.item_2.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:367`
- `vlogPage.mock.posts.item_3.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:367`
- `vlogPage.mock.posts.item_4.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:367`
- `vlogPage.mock.posts.item_5.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:367`
- `vlogPage.mock.posts.item_6.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:367`
- `vlogPage.mock.trending.item_1.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:367`
- `vlogPage.mock.trending.item_2.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:367`
- `vlogPage.mock.trending.item_3.title` (t().titleKey) at `src/features/home/pages/HomePageContent.jsx:367`
- `home.mock.hero_events.hoa_lu.time` (t().timeKey) at `src/features/home/pages/HomePageContent.jsx:368`
- `home.mock.hero_events.light_show.time` (t().timeKey) at `src/features/home/pages/HomePageContent.jsx:368`
- `home.mock.hero_events.tourism_week.time` (t().timeKey) at `src/features/home/pages/HomePageContent.jsx:368`
- `home.mock.hero_events.hoa_lu.title` (t().titleKey) at `src/features/map/components/leftSidebar/DataLayerMapStylePanel.jsx:72`
- `home.mock.hero_events.light_show.title` (t().titleKey) at `src/features/map/components/leftSidebar/DataLayerMapStylePanel.jsx:72`
- `home.mock.hero_events.tourism_week.title` (t().titleKey) at `src/features/map/components/leftSidebar/DataLayerMapStylePanel.jsx:72`
- `home.mock.news_items.item_1.title` (t().titleKey) at `src/features/map/components/leftSidebar/DataLayerMapStylePanel.jsx:72`
- `home.mock.news_items.item_2.title` (t().titleKey) at `src/features/map/components/leftSidebar/DataLayerMapStylePanel.jsx:72`
- `home.mock.news_items.item_3.title` (t().titleKey) at `src/features/map/components/leftSidebar/DataLayerMapStylePanel.jsx:72`
- `home.mock.promo_banner.title` (t().titleKey) at `src/features/map/components/leftSidebar/DataLayerMapStylePanel.jsx:72`
- `home.mock.quick_links.map.title` (t().titleKey) at `src/features/map/components/leftSidebar/DataLayerMapStylePanel.jsx:72`
- `home.mock.quick_links.ocop.title` (t().titleKey) at `src/features/map/components/leftSidebar/DataLayerMapStylePanel.jsx:72`
- `home.mock.quick_links.plan.title` (t().titleKey) at `src/features/map/components/leftSidebar/DataLayerMapStylePanel.jsx:72`
- `home.mock.quick_links.service.title` (t().titleKey) at `src/features/map/components/leftSidebar/DataLayerMapStylePanel.jsx:72`
- `home.mock.quick_links.vr.title` (t().titleKey) at `src/features/map/components/leftSidebar/DataLayerMapStylePanel.jsx:72`
- `home.mock.vlog_stories.item_1.title` (t().titleKey) at `src/features/map/components/leftSidebar/DataLayerMapStylePanel.jsx:72`
- `home.mock.vlog_stories.item_2.title` (t().titleKey) at `src/features/map/components/leftSidebar/DataLayerMapStylePanel.jsx:72`
- `home.mock.vlog_stories.item_3.title` (t().titleKey) at `src/features/map/components/leftSidebar/DataLayerMapStylePanel.jsx:72`
- `vlogPage.mock.posts.item_1.title` (t().titleKey) at `src/features/map/components/leftSidebar/DataLayerMapStylePanel.jsx:72`
- `vlogPage.mock.posts.item_2.title` (t().titleKey) at `src/features/map/components/leftSidebar/DataLayerMapStylePanel.jsx:72`
- `vlogPage.mock.posts.item_3.title` (t().titleKey) at `src/features/map/components/leftSidebar/DataLayerMapStylePanel.jsx:72`
- `vlogPage.mock.posts.item_4.title` (t().titleKey) at `src/features/map/components/leftSidebar/DataLayerMapStylePanel.jsx:72`
- `vlogPage.mock.posts.item_5.title` (t().titleKey) at `src/features/map/components/leftSidebar/DataLayerMapStylePanel.jsx:72`
- `vlogPage.mock.posts.item_6.title` (t().titleKey) at `src/features/map/components/leftSidebar/DataLayerMapStylePanel.jsx:72`
- `vlogPage.mock.trending.item_1.title` (t().titleKey) at `src/features/map/components/leftSidebar/DataLayerMapStylePanel.jsx:72`
- `vlogPage.mock.trending.item_2.title` (t().titleKey) at `src/features/map/components/leftSidebar/DataLayerMapStylePanel.jsx:72`
- `vlogPage.mock.trending.item_3.title` (t().titleKey) at `src/features/map/components/leftSidebar/DataLayerMapStylePanel.jsx:72`
- `mapPage.ocopPanel.productCertified` (t()) at `src/features/map/components/OcopProductModal.jsx:113`
- `mapPage.ocopPanel.ocopStars` (t()) at `src/features/map/components/OcopProductModal.jsx:115`
- `mapPage.ocopPanel.oneCommuneOneProduct` (t()) at `src/features/map/components/OcopProductModal.jsx:117`
- `mapPage.ocopPanel.viewDestination` (t()) at `src/features/map/components/OcopProductModal.jsx:128`
- `mapPage.ocopPanel.fallbackProductName` (t()) at `src/features/map/components/OcopProductModal.jsx:45`
- `mapPage.ocopPanel.productModalDescription` (t()) at `src/features/map/components/OcopProductModal.jsx:46`
- `mapPage.ocopPanel.ocopStars` (t()) at `src/features/map/components/OcopProductModal.jsx:75`
- `common.just_updated` (t()) at `src/features/map/components/rightSidebar/CapacityPanel.jsx:115`
- `common.minutes_ago` (t()) at `src/features/map/components/rightSidebar/CapacityPanel.jsx:116`
- `common.hours_ago` (t()) at `src/features/map/components/rightSidebar/CapacityPanel.jsx:118`
- `mapPage.capacityPanel.filteredCount` (t()) at `src/features/map/components/rightSidebar/CapacityPanel.jsx:329`
- `mapPage.capacityPanel.trackedCount` (t()) at `src/features/map/components/rightSidebar/CapacityPanel.jsx:333`
- `mapPage.capacityPanel.capacityWithMax` (t()) at `src/features/map/components/rightSidebar/CapacityPanel.jsx:341`
- `mapPage.capacityPanel.capacityCurrent` (t()) at `src/features/map/components/rightSidebar/CapacityPanel.jsx:345`
- `common.open_in_new_tab` (t()) at `src/features/map/components/rightSidebar/ChatbotPanel.jsx:506`
- `mapPage.capacityPanel.status.moderate` (declared:labelKey) at `src/features/map/components/rightSidebar/TourPanel.jsx:167`
- `mapPage.capacityPanel.status.low` (declared:labelKey) at `src/features/map/components/rightSidebar/TourPanel.jsx:177`
- `mapPage.capacityPanel.status.unknown` (declared:labelKey) at `src/features/map/components/rightSidebar/TourPanel.jsx:182`
- `mapPage.capacityPanel.status.low` (t().labelKey) at `src/features/map/components/rightSidebar/TourPanel.jsx:225`
- `mapPage.capacityPanel.status.moderate` (t().labelKey) at `src/features/map/components/rightSidebar/TourPanel.jsx:225`
- `mapPage.capacityPanel.status.unknown` (t().labelKey) at `src/features/map/components/rightSidebar/TourPanel.jsx:225`
- `mapPage.traffic.summary.total` (t()) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:118`
- `mapPage.traffic.summary.accident` (t()) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:125`
- `mapPage.traffic.summary.jam` (t()) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:132`
- `mapPage.traffic.summary.works` (t()) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:139`
- `mapPage.traffic.summary.avg_delay` (t()) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:170`
- `mapPage.traffic.summary.minutes` (t()) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:173`
- `mapPage.traffic.flowLevels.free_flow` (declared:labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:18`
- `mapPage.traffic.flowLevels.moderate` (declared:labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:19`
- `mapPage.traffic.flowLevels.heavy` (declared:labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:20`
- `mapPage.traffic.flowLevels.severe` (declared:labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:21`
- `home.mock.food_bullets.item_1.label` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `home.mock.food_bullets.item_2.label` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `home.mock.food_bullets.item_3.label` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `home.mock.hero_stats.average_load` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `home.mock.hero_stats.events_offers` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `home.mock.hero_stats.featured` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `home.mock.hero_stats.vr360` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `mapPage.capacityPanel.status.low` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `mapPage.capacityPanel.status.moderate` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `mapPage.capacityPanel.status.unknown` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `mapPage.traffic.flowLevels.free_flow` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `mapPage.traffic.flowLevels.heavy` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `mapPage.traffic.flowLevels.moderate` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `mapPage.traffic.flowLevels.severe` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `satellite.legend.change.no_change` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `satellite.legend.change.road_construction` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `satellite.legend.change.vegetation_gain` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `satellite.legend.change.vegetation_loss` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `satellite.legend.change.vegetation_loss_road` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `satellite.legend.classified.agriculture` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `satellite.legend.classified.bare_land` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `satellite.legend.classified.evergreen_forest` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `satellite.legend.classified.open_forest` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `satellite.legend.classified.shrub_grass` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `satellite.legend.classified.urban` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `satellite.legend.classified.water` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `satellite.legend.heatmap.cool` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `satellite.legend.heatmap.hot` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `satellite.legend.heatmap.moderate` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `satellite.legend.heatmap.very_cool` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `satellite.legend.heatmap.very_hot` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `satellite.legend.heatmap.warm` (t().labelKey) at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- `common.natural` (declared:nameKey) at `src/features/map/constant/mapColor.js:3`
- `common.culture` (declared:nameKey) at `src/features/map/constant/mapColor.js:4`
- `common.infrastructure` (declared:nameKey) at `src/features/map/constant/mapColor.js:5`
- `mapPage.mock.destinations.tamCoc.description` (declared:descriptionKey) at `src/features/map/constant/mapPageMockData.js:19`
- `mapPage.mock.destinations.hoaLuOldTown.description` (declared:descriptionKey) at `src/features/map/constant/mapPageMockData.js:41`
- `mapPage.mock.destinations.trangAn.description` (declared:descriptionKey) at `src/features/map/constant/mapPageMockData.js:8`
- `mapPage.mock.tourSuggestions.softDay` (declared:textKey) at `src/features/map/constant/mapPageMockData.js:83`
- `mapPage.mock.tourSuggestions.cultureFocus` (declared:textKey) at `src/features/map/constant/mapPageMockData.js:88`
- `home.mock.featured_destinations.bai_dinh.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `home.mock.featured_destinations.hoa_lu.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `home.mock.featured_destinations.trang_an.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `home.mock.ocop_products.item_1.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `home.mock.ocop_products.item_2.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `home.mock.ocop_products.item_3.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `home.mock.promo_banner.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `home.mock.quick_links.map.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `home.mock.quick_links.ocop.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `home.mock.quick_links.plan.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `home.mock.quick_links.service.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `home.mock.quick_links.vr.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `home.mock.services.item_1.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `home.mock.services.item_2.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `home.mock.services.item_3.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `home.mock.vlog_stories.item_1.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `home.mock.vlog_stories.item_2.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `home.mock.vlog_stories.item_3.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `mapPage.mock.destinations.hoaLuOldTown.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `mapPage.mock.destinations.tamCoc.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `mapPage.mock.destinations.trangAn.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `vlogPage.mock.posts.item_1.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `vlogPage.mock.posts.item_2.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `vlogPage.mock.posts.item_3.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `vlogPage.mock.posts.item_4.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `vlogPage.mock.posts.item_5.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `vlogPage.mock.posts.item_6.description` (t().descriptionKey) at `src/features/map/pages/MapPageContent.jsx:147`
- `mapPage.mock.tourSuggestions.cultureFocus` (t().textKey) at `src/features/map/pages/MapPageContent.jsx:155`
- `mapPage.mock.tourSuggestions.softDay` (t().textKey) at `src/features/map/pages/MapPageContent.jsx:155`
- `vlogPage.mock.trending.item_1.text` (t().textKey) at `src/features/map/pages/MapPageContent.jsx:155`
- `vlogPage.mock.trending.item_2.text` (t().textKey) at `src/features/map/pages/MapPageContent.jsx:155`
- `vlogPage.mock.trending.item_3.text` (t().textKey) at `src/features/map/pages/MapPageContent.jsx:155`
- `mapPage.capacityPanel.status.moderate` (declared:labelKey) at `src/features/map/utils/capacityStatus.js:34`
- `mapPage.capacityPanel.status.low` (declared:labelKey) at `src/features/map/utils/capacityStatus.js:52`
- `mapPage.capacityPanel.status.unknown` (declared:labelKey) at `src/features/map/utils/capacityStatus.js:59`
- `home.mock.food_bullets.item_1.label` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `home.mock.food_bullets.item_2.label` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `home.mock.food_bullets.item_3.label` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `home.mock.hero_stats.average_load` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `home.mock.hero_stats.events_offers` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `home.mock.hero_stats.featured` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `home.mock.hero_stats.vr360` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `mapPage.capacityPanel.status.low` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `mapPage.capacityPanel.status.moderate` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `mapPage.capacityPanel.status.unknown` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `mapPage.traffic.flowLevels.free_flow` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `mapPage.traffic.flowLevels.heavy` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `mapPage.traffic.flowLevels.moderate` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `mapPage.traffic.flowLevels.severe` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `satellite.legend.change.no_change` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `satellite.legend.change.road_construction` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `satellite.legend.change.vegetation_gain` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `satellite.legend.change.vegetation_loss` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `satellite.legend.change.vegetation_loss_road` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `satellite.legend.classified.agriculture` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `satellite.legend.classified.bare_land` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `satellite.legend.classified.evergreen_forest` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `satellite.legend.classified.open_forest` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `satellite.legend.classified.shrub_grass` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `satellite.legend.classified.urban` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `satellite.legend.classified.water` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `satellite.legend.heatmap.cool` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `satellite.legend.heatmap.hot` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `satellite.legend.heatmap.moderate` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `satellite.legend.heatmap.very_cool` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `satellite.legend.heatmap.very_hot` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `satellite.legend.heatmap.warm` (t().labelKey) at `src/features/map/utils/capacityStatus.js:80`
- `common.errors.http_status` (t()) at `src/features/map/utils/highlightRouteUtils.js:126`
- `newsPage.comments.admin_role` (t()) at `src/features/news/components/NewsCommentSection.jsx:160`
- `home.mock.food_bullets.item_1.label` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `home.mock.food_bullets.item_2.label` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `home.mock.food_bullets.item_3.label` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `home.mock.hero_stats.average_load` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `home.mock.hero_stats.events_offers` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `home.mock.hero_stats.featured` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `home.mock.hero_stats.vr360` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `mapPage.capacityPanel.status.low` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `mapPage.capacityPanel.status.moderate` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `mapPage.capacityPanel.status.unknown` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `mapPage.traffic.flowLevels.free_flow` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `mapPage.traffic.flowLevels.heavy` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `mapPage.traffic.flowLevels.moderate` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `mapPage.traffic.flowLevels.severe` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `satellite.legend.change.no_change` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `satellite.legend.change.road_construction` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `satellite.legend.change.vegetation_gain` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `satellite.legend.change.vegetation_loss` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `satellite.legend.change.vegetation_loss_road` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `satellite.legend.classified.agriculture` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `satellite.legend.classified.bare_land` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `satellite.legend.classified.evergreen_forest` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `satellite.legend.classified.open_forest` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `satellite.legend.classified.shrub_grass` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `satellite.legend.classified.urban` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `satellite.legend.classified.water` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `satellite.legend.heatmap.cool` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `satellite.legend.heatmap.hot` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `satellite.legend.heatmap.moderate` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `satellite.legend.heatmap.very_cool` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `satellite.legend.heatmap.very_hot` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `satellite.legend.heatmap.warm` (t().labelKey) at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- `home.mock.food_bullets.item_1.label` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `home.mock.food_bullets.item_2.label` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `home.mock.food_bullets.item_3.label` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `home.mock.hero_stats.average_load` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `home.mock.hero_stats.events_offers` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `home.mock.hero_stats.featured` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `home.mock.hero_stats.vr360` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `mapPage.capacityPanel.status.low` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `mapPage.capacityPanel.status.moderate` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `mapPage.capacityPanel.status.unknown` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `mapPage.traffic.flowLevels.free_flow` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `mapPage.traffic.flowLevels.heavy` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `mapPage.traffic.flowLevels.moderate` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `mapPage.traffic.flowLevels.severe` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `satellite.legend.change.no_change` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `satellite.legend.change.road_construction` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `satellite.legend.change.vegetation_gain` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `satellite.legend.change.vegetation_loss` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `satellite.legend.change.vegetation_loss_road` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `satellite.legend.classified.agriculture` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `satellite.legend.classified.bare_land` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `satellite.legend.classified.evergreen_forest` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `satellite.legend.classified.open_forest` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `satellite.legend.classified.shrub_grass` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `satellite.legend.classified.urban` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `satellite.legend.classified.water` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `satellite.legend.heatmap.cool` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `satellite.legend.heatmap.hot` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `satellite.legend.heatmap.moderate` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `satellite.legend.heatmap.very_cool` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `satellite.legend.heatmap.very_hot` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `satellite.legend.heatmap.warm` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- `home.mock.food_bullets.item_1.label` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `home.mock.food_bullets.item_2.label` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `home.mock.food_bullets.item_3.label` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `home.mock.hero_stats.average_load` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `home.mock.hero_stats.events_offers` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `home.mock.hero_stats.featured` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `home.mock.hero_stats.vr360` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `mapPage.capacityPanel.status.low` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `mapPage.capacityPanel.status.moderate` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `mapPage.capacityPanel.status.unknown` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `mapPage.traffic.flowLevels.free_flow` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `mapPage.traffic.flowLevels.heavy` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `mapPage.traffic.flowLevels.moderate` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `mapPage.traffic.flowLevels.severe` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `satellite.legend.change.no_change` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `satellite.legend.change.road_construction` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `satellite.legend.change.vegetation_gain` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `satellite.legend.change.vegetation_loss` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `satellite.legend.change.vegetation_loss_road` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `satellite.legend.classified.agriculture` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `satellite.legend.classified.bare_land` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `satellite.legend.classified.evergreen_forest` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `satellite.legend.classified.open_forest` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `satellite.legend.classified.shrub_grass` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `satellite.legend.classified.urban` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `satellite.legend.classified.water` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `satellite.legend.heatmap.cool` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `satellite.legend.heatmap.hot` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `satellite.legend.heatmap.moderate` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `satellite.legend.heatmap.very_cool` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `satellite.legend.heatmap.very_hot` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `satellite.legend.heatmap.warm` (t().labelKey) at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- `home.mock.food_bullets.item_1.label` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `home.mock.food_bullets.item_2.label` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `home.mock.food_bullets.item_3.label` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `home.mock.hero_stats.average_load` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `home.mock.hero_stats.events_offers` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `home.mock.hero_stats.featured` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `home.mock.hero_stats.vr360` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `mapPage.capacityPanel.status.low` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `mapPage.capacityPanel.status.moderate` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `mapPage.capacityPanel.status.unknown` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `mapPage.traffic.flowLevels.free_flow` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `mapPage.traffic.flowLevels.heavy` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `mapPage.traffic.flowLevels.moderate` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `mapPage.traffic.flowLevels.severe` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `satellite.legend.change.no_change` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `satellite.legend.change.road_construction` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `satellite.legend.change.vegetation_gain` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `satellite.legend.change.vegetation_loss` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `satellite.legend.change.vegetation_loss_road` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `satellite.legend.classified.agriculture` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `satellite.legend.classified.bare_land` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `satellite.legend.classified.evergreen_forest` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `satellite.legend.classified.open_forest` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `satellite.legend.classified.shrub_grass` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `satellite.legend.classified.urban` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `satellite.legend.classified.water` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `satellite.legend.heatmap.cool` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `satellite.legend.heatmap.hot` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `satellite.legend.heatmap.moderate` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `satellite.legend.heatmap.very_cool` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `satellite.legend.heatmap.very_hot` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `satellite.legend.heatmap.warm` (t().labelKey) at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- `home.mock.food_bullets.item_1.label` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `home.mock.food_bullets.item_2.label` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `home.mock.food_bullets.item_3.label` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `home.mock.hero_stats.average_load` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `home.mock.hero_stats.events_offers` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `home.mock.hero_stats.featured` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `home.mock.hero_stats.vr360` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `mapPage.capacityPanel.status.low` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `mapPage.capacityPanel.status.moderate` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `mapPage.capacityPanel.status.unknown` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `mapPage.traffic.flowLevels.free_flow` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `mapPage.traffic.flowLevels.heavy` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `mapPage.traffic.flowLevels.moderate` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `mapPage.traffic.flowLevels.severe` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `satellite.legend.change.no_change` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `satellite.legend.change.road_construction` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `satellite.legend.change.vegetation_gain` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `satellite.legend.change.vegetation_loss` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `satellite.legend.change.vegetation_loss_road` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `satellite.legend.classified.agriculture` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `satellite.legend.classified.bare_land` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `satellite.legend.classified.evergreen_forest` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `satellite.legend.classified.open_forest` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `satellite.legend.classified.shrub_grass` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `satellite.legend.classified.urban` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `satellite.legend.classified.water` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `satellite.legend.heatmap.cool` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `satellite.legend.heatmap.hot` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `satellite.legend.heatmap.moderate` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `satellite.legend.heatmap.very_cool` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `satellite.legend.heatmap.very_hot` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `satellite.legend.heatmap.warm` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- `home.mock.food_bullets.item_1.label` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `home.mock.food_bullets.item_2.label` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `home.mock.food_bullets.item_3.label` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `home.mock.hero_stats.average_load` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `home.mock.hero_stats.events_offers` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `home.mock.hero_stats.featured` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `home.mock.hero_stats.vr360` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `mapPage.capacityPanel.status.low` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `mapPage.capacityPanel.status.moderate` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `mapPage.capacityPanel.status.unknown` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `mapPage.traffic.flowLevels.free_flow` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `mapPage.traffic.flowLevels.heavy` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `mapPage.traffic.flowLevels.moderate` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `mapPage.traffic.flowLevels.severe` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `satellite.legend.change.no_change` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `satellite.legend.change.road_construction` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `satellite.legend.change.vegetation_gain` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `satellite.legend.change.vegetation_loss` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `satellite.legend.change.vegetation_loss_road` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `satellite.legend.classified.agriculture` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `satellite.legend.classified.bare_land` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `satellite.legend.classified.evergreen_forest` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `satellite.legend.classified.open_forest` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `satellite.legend.classified.shrub_grass` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `satellite.legend.classified.urban` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `satellite.legend.classified.water` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `satellite.legend.heatmap.cool` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `satellite.legend.heatmap.hot` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `satellite.legend.heatmap.moderate` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `satellite.legend.heatmap.very_cool` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `satellite.legend.heatmap.very_hot` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `satellite.legend.heatmap.warm` (t().labelKey) at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- `satellite.legend.change.road_construction` (declared:labelKey) at `src/features/satellite/constants/satelliteConstants.js:100`
- `satellite.legend.change.vegetation_loss_road` (declared:labelKey) at `src/features/satellite/constants/satelliteConstants.js:101`
- `satellite.legend.heatmap.very_cool` (declared:labelKey) at `src/features/satellite/constants/satelliteConstants.js:80`
- `satellite.legend.heatmap.cool` (declared:labelKey) at `src/features/satellite/constants/satelliteConstants.js:81`
- `satellite.legend.heatmap.moderate` (declared:labelKey) at `src/features/satellite/constants/satelliteConstants.js:82`
- `satellite.legend.heatmap.warm` (declared:labelKey) at `src/features/satellite/constants/satelliteConstants.js:83`
- `satellite.legend.heatmap.hot` (declared:labelKey) at `src/features/satellite/constants/satelliteConstants.js:84`
- `satellite.legend.heatmap.very_hot` (declared:labelKey) at `src/features/satellite/constants/satelliteConstants.js:85`
- `satellite.legend.classified.water` (declared:labelKey) at `src/features/satellite/constants/satelliteConstants.js:88`
- `satellite.legend.classified.bare_land` (declared:labelKey) at `src/features/satellite/constants/satelliteConstants.js:89`
- `satellite.legend.classified.shrub_grass` (declared:labelKey) at `src/features/satellite/constants/satelliteConstants.js:90`
- `satellite.legend.classified.agriculture` (declared:labelKey) at `src/features/satellite/constants/satelliteConstants.js:91`
- `satellite.legend.classified.open_forest` (declared:labelKey) at `src/features/satellite/constants/satelliteConstants.js:92`
- `satellite.legend.classified.evergreen_forest` (declared:labelKey) at `src/features/satellite/constants/satelliteConstants.js:93`
- `satellite.legend.classified.urban` (declared:labelKey) at `src/features/satellite/constants/satelliteConstants.js:94`
- `satellite.legend.change.no_change` (declared:labelKey) at `src/features/satellite/constants/satelliteConstants.js:97`
- `satellite.legend.change.vegetation_loss` (declared:labelKey) at `src/features/satellite/constants/satelliteConstants.js:98`
- `satellite.legend.change.vegetation_gain` (declared:labelKey) at `src/features/satellite/constants/satelliteConstants.js:99`
- `common.new` (t()) at `src/features/tourism-points/components/list/TourismPointCards.jsx:123`
- `tourPage.routeOverview` (t()) at `src/features/tours/pages/TourDetailPage.jsx:493`
- `tourPage.defaultSchedule` (t()) at `src/features/tours/pages/TourDetailPage.jsx:529`
- `tourPage.stops` (t()) at `src/features/tours/pages/TourDetailPage.jsx:533`
- `tourPage.guestRange` (t()) at `src/features/tours/pages/TourDetailPage.jsx:547`
- `tourPage.suitableForGroups` (t()) at `src/features/tours/pages/TourDetailPage.jsx:548`
- `tourPage.dayHeading` (t()) at `src/features/tours/pages/TourDetailPage.jsx:589`
- `tourPage.defaultSchedule` (t()) at `src/features/tours/pages/TourDetailPage.jsx:596`
- `tourPage.dayLabel` (t()) at `src/features/tours/pages/TourDetailPage.jsx:597`
- `tourPage.stopLabel` (t()) at `src/features/tours/pages/TourDetailPage.jsx:622`
- `tourPage.minutesLabel` (t()) at `src/features/tours/pages/TourDetailPage.jsx:627`
- `tourPage.capacityLoad` (t()) at `src/features/tours/pages/TourDetailPage.jsx:635`
- `tourPage.capacityLoad` (t()) at `src/features/tours/pages/TourDetailPage.jsx:637`
- `tourPage.capacityLoad` (t()) at `src/features/tours/pages/TourDetailPage.jsx:638`
- `tourPage.priceNote` (t()) at `src/features/tours/pages/TourDetailPage.jsx:748`
- `tourPage.bookTrip` (t()) at `src/features/tours/pages/TourDetailPage.jsx:761`
- `tourPage.bookTrip` (t()) at `src/features/tours/pages/TourDetailPage.jsx:771`
- `vlogPage.mock.trending.item_1.title` (declared:titleKey) at `src/features/vlog/data/vlogData.js:101`
- `vlogPage.mock.trending.item_1.text` (declared:textKey) at `src/features/vlog/data/vlogData.js:102`
- `vlogPage.mock.trending.item_2.title` (declared:titleKey) at `src/features/vlog/data/vlogData.js:108`
- `vlogPage.mock.trending.item_2.text` (declared:textKey) at `src/features/vlog/data/vlogData.js:109`
- `vlogPage.mock.trending.item_3.title` (declared:titleKey) at `src/features/vlog/data/vlogData.js:115`
- `vlogPage.mock.trending.item_3.text` (declared:textKey) at `src/features/vlog/data/vlogData.js:116`
- `vlogPage.mock.posts.item_1.description` (declared:descriptionKey) at `src/features/vlog/data/vlogData.js:13`
- `vlogPage.mock.time.today` (declared:dateLabelKey) at `src/features/vlog/data/vlogData.js:14`
- `vlogPage.mock.posts.item_2.title` (declared:titleKey) at `src/features/vlog/data/vlogData.js:19`
- `vlogPage.mock.places.tam_coc` (declared:placeKey) at `src/features/vlog/data/vlogData.js:20`
- `vlogPage.mock.posts.item_2.description` (declared:descriptionKey) at `src/features/vlog/data/vlogData.js:28`
- `vlogPage.mock.time.hours_ago` (declared:dateLabelKey) at `src/features/vlog/data/vlogData.js:29`
- `vlogPage.mock.posts.item_3.title` (declared:titleKey) at `src/features/vlog/data/vlogData.js:35`
- `vlogPage.mock.places.bai_dinh` (declared:placeKey) at `src/features/vlog/data/vlogData.js:36`
- `vlogPage.mock.posts.item_1.title` (declared:titleKey) at `src/features/vlog/data/vlogData.js:4`
- `vlogPage.mock.posts.item_3.description` (declared:descriptionKey) at `src/features/vlog/data/vlogData.js:44`
- `vlogPage.mock.time.yesterday` (declared:dateLabelKey) at `src/features/vlog/data/vlogData.js:45`
- `vlogPage.mock.places.trang_an` (declared:placeKey) at `src/features/vlog/data/vlogData.js:5`
- `vlogPage.mock.posts.item_4.title` (declared:titleKey) at `src/features/vlog/data/vlogData.js:50`
- `vlogPage.mock.places.ha_long` (declared:placeKey) at `src/features/vlog/data/vlogData.js:51`
- `vlogPage.topics.checkin` (declared:topicKey) at `src/features/vlog/data/vlogData.js:53`
- `vlogPage.mock.posts.item_4.description` (declared:descriptionKey) at `src/features/vlog/data/vlogData.js:59`
- `vlogPage.mock.time.days_ago` (declared:dateLabelKey) at `src/features/vlog/data/vlogData.js:60`
- `vlogPage.mock.posts.item_5.title` (declared:titleKey) at `src/features/vlog/data/vlogData.js:66`
- `vlogPage.mock.places.ninh_binh` (declared:placeKey) at `src/features/vlog/data/vlogData.js:67`
- `vlogPage.topics.nature` (declared:topicKey) at `src/features/vlog/data/vlogData.js:7`
- `vlogPage.mock.posts.item_5.description` (declared:descriptionKey) at `src/features/vlog/data/vlogData.js:75`
- `vlogPage.mock.time.days_ago` (declared:dateLabelKey) at `src/features/vlog/data/vlogData.js:76`
- `vlogPage.mock.posts.item_6.title` (declared:titleKey) at `src/features/vlog/data/vlogData.js:82`
- `vlogPage.mock.places.ninh_binh` (declared:placeKey) at `src/features/vlog/data/vlogData.js:83`
- `vlogPage.mock.posts.item_6.description` (declared:descriptionKey) at `src/features/vlog/data/vlogData.js:91`
- `vlogPage.mock.time.weeks_ago` (declared:dateLabelKey) at `src/features/vlog/data/vlogData.js:92`
- `home.mock.hero_events.hoa_lu.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:38`
- `home.mock.hero_events.light_show.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:38`
- `home.mock.hero_events.tourism_week.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:38`
- `home.mock.news_items.item_1.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:38`
- `home.mock.news_items.item_2.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:38`
- `home.mock.news_items.item_3.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:38`
- `home.mock.promo_banner.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:38`
- `home.mock.quick_links.map.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:38`
- `home.mock.quick_links.ocop.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:38`
- `home.mock.quick_links.plan.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:38`
- `home.mock.quick_links.service.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:38`
- `home.mock.quick_links.vr.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:38`
- `home.mock.vlog_stories.item_1.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:38`
- `home.mock.vlog_stories.item_2.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:38`
- `home.mock.vlog_stories.item_3.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:38`
- `vlogPage.mock.posts.item_1.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:38`
- `vlogPage.mock.posts.item_2.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:38`
- `vlogPage.mock.posts.item_3.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:38`
- `vlogPage.mock.posts.item_4.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:38`
- `vlogPage.mock.posts.item_5.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:38`
- `vlogPage.mock.posts.item_6.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:38`
- `vlogPage.mock.trending.item_1.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:38`
- `vlogPage.mock.trending.item_2.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:38`
- `vlogPage.mock.trending.item_3.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:38`
- `vlogPage.mock.places.bai_dinh` (t().placeKey) at `src/features/vlog/pages/VlogPageContent.jsx:39`
- `vlogPage.mock.places.ha_long` (t().placeKey) at `src/features/vlog/pages/VlogPageContent.jsx:39`
- `vlogPage.mock.places.ninh_binh` (t().placeKey) at `src/features/vlog/pages/VlogPageContent.jsx:39`
- `vlogPage.mock.places.tam_coc` (t().placeKey) at `src/features/vlog/pages/VlogPageContent.jsx:39`
- `vlogPage.mock.places.trang_an` (t().placeKey) at `src/features/vlog/pages/VlogPageContent.jsx:39`
- `home.mock.services.item_1.type` (t().typeKey) at `src/features/vlog/pages/VlogPageContent.jsx:40`
- `home.mock.services.item_2.type` (t().typeKey) at `src/features/vlog/pages/VlogPageContent.jsx:40`
- `home.mock.services.item_3.type` (t().typeKey) at `src/features/vlog/pages/VlogPageContent.jsx:40`
- `vlogPage.topics.checkin` (t().topicKey) at `src/features/vlog/pages/VlogPageContent.jsx:41`
- `vlogPage.topics.nature` (t().topicKey) at `src/features/vlog/pages/VlogPageContent.jsx:41`
- `home.mock.featured_destinations.bai_dinh.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `home.mock.featured_destinations.hoa_lu.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `home.mock.featured_destinations.trang_an.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `home.mock.ocop_products.item_1.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `home.mock.ocop_products.item_2.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `home.mock.ocop_products.item_3.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `home.mock.promo_banner.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `home.mock.quick_links.map.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `home.mock.quick_links.ocop.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `home.mock.quick_links.plan.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `home.mock.quick_links.service.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `home.mock.quick_links.vr.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `home.mock.services.item_1.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `home.mock.services.item_2.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `home.mock.services.item_3.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `home.mock.vlog_stories.item_1.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `home.mock.vlog_stories.item_2.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `home.mock.vlog_stories.item_3.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `mapPage.mock.destinations.hoaLuOldTown.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `mapPage.mock.destinations.tamCoc.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `mapPage.mock.destinations.trangAn.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `vlogPage.mock.posts.item_1.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `vlogPage.mock.posts.item_2.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `vlogPage.mock.posts.item_3.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `vlogPage.mock.posts.item_4.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `vlogPage.mock.posts.item_5.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `vlogPage.mock.posts.item_6.description` (t().descriptionKey) at `src/features/vlog/pages/VlogPageContent.jsx:42`
- `vlogPage.mock.time.days_ago` (t().dateLabelKey) at `src/features/vlog/pages/VlogPageContent.jsx:43`
- `vlogPage.mock.time.hours_ago` (t().dateLabelKey) at `src/features/vlog/pages/VlogPageContent.jsx:43`
- `vlogPage.mock.time.today` (t().dateLabelKey) at `src/features/vlog/pages/VlogPageContent.jsx:43`
- `vlogPage.mock.time.weeks_ago` (t().dateLabelKey) at `src/features/vlog/pages/VlogPageContent.jsx:43`
- `vlogPage.mock.time.yesterday` (t().dateLabelKey) at `src/features/vlog/pages/VlogPageContent.jsx:43`
- `home.mock.hero_events.hoa_lu.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:51`
- `home.mock.hero_events.light_show.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:51`
- `home.mock.hero_events.tourism_week.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:51`
- `home.mock.news_items.item_1.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:51`
- `home.mock.news_items.item_2.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:51`
- `home.mock.news_items.item_3.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:51`
- `home.mock.promo_banner.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:51`
- `home.mock.quick_links.map.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:51`
- `home.mock.quick_links.ocop.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:51`
- `home.mock.quick_links.plan.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:51`
- `home.mock.quick_links.service.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:51`
- `home.mock.quick_links.vr.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:51`
- `home.mock.vlog_stories.item_1.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:51`
- `home.mock.vlog_stories.item_2.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:51`
- `home.mock.vlog_stories.item_3.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:51`
- `vlogPage.mock.posts.item_1.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:51`
- `vlogPage.mock.posts.item_2.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:51`
- `vlogPage.mock.posts.item_3.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:51`
- `vlogPage.mock.posts.item_4.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:51`
- `vlogPage.mock.posts.item_5.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:51`
- `vlogPage.mock.posts.item_6.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:51`
- `vlogPage.mock.trending.item_1.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:51`
- `vlogPage.mock.trending.item_2.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:51`
- `vlogPage.mock.trending.item_3.title` (t().titleKey) at `src/features/vlog/pages/VlogPageContent.jsx:51`
- `mapPage.mock.tourSuggestions.cultureFocus` (t().textKey) at `src/features/vlog/pages/VlogPageContent.jsx:52`
- `mapPage.mock.tourSuggestions.softDay` (t().textKey) at `src/features/vlog/pages/VlogPageContent.jsx:52`
- `vlogPage.mock.trending.item_1.text` (t().textKey) at `src/features/vlog/pages/VlogPageContent.jsx:52`
- `vlogPage.mock.trending.item_2.text` (t().textKey) at `src/features/vlog/pages/VlogPageContent.jsx:52`
- `vlogPage.mock.trending.item_3.text` (t().textKey) at `src/features/vlog/pages/VlogPageContent.jsx:52`
- `common.errors.session_expired` (t()) at `src/services/apiClient.js:39`
- `common.errors.occurred` (t()) at `src/services/errorUtils.jsx:5`
- `common.errors.session_expired` (t()) at `src/services/useApi.js:109`
- `common.errors.session_expired` (t()) at `src/services/useApi.js:185`
- `common.errors.session_expired` (t()) at `src/services/useApi.js:247`

## Tracked JSX Key Props

- `error.400.title` (jsx:titleKey) at `src/pages/Errors/400BadRequestPage.jsx:11`
- `error.400.message` (jsx:messageKey) at `src/pages/Errors/400BadRequestPage.jsx:12`
- `error.back_home` (jsx:actionKey) at `src/pages/Errors/400BadRequestPage.jsx:13`
- `error.401.title` (jsx:titleKey) at `src/pages/Errors/401UnauthorizedPage.jsx:18`
- `error.401.message` (jsx:messageKey) at `src/pages/Errors/401UnauthorizedPage.jsx:19`
- `error.back_home` (jsx:actionKey) at `src/pages/Errors/401UnauthorizedPage.jsx:20`
- `error.403.title` (jsx:titleKey) at `src/pages/Errors/403ForbiddenPage.jsx:11`
- `error.403.message` (jsx:messageKey) at `src/pages/Errors/403ForbiddenPage.jsx:12`
- `error.back_home` (jsx:actionKey) at `src/pages/Errors/403ForbiddenPage.jsx:13`
- `error.404.title` (jsx:titleKey) at `src/pages/Errors/404NotFoundPage.jsx:11`
- `error.404.message` (jsx:messageKey) at `src/pages/Errors/404NotFoundPage.jsx:12`
- `error.back_home` (jsx:actionKey) at `src/pages/Errors/404NotFoundPage.jsx:13`
- `error.500.title` (jsx:titleKey) at `src/pages/Errors/500InternalServerErrorPage.jsx:11`
- `error.500.message` (jsx:messageKey) at `src/pages/Errors/500InternalServerErrorPage.jsx:12`
- `error.back_home` (jsx:actionKey) at `src/pages/Errors/500InternalServerErrorPage.jsx:13`
- `error.503.title` (jsx:titleKey) at `src/pages/Errors/503ServiceUnavailablePage.jsx:11`
- `error.503.message` (jsx:messageKey) at `src/pages/Errors/503ServiceUnavailablePage.jsx:12`
- `error.back_home` (jsx:actionKey) at `src/pages/Errors/503ServiceUnavailablePage.jsx:13`

## Inline Fallbacks

- None

## Hardcoded Visible Text

### must_i18n by file

- None

### must_i18n

- None

### review

- None

## Suggested Missing-Key Additions

These are flat key additions for review. Values are intentionally set to `TODO_REVIEW` so the audit does not invent translation copy.

### EN Candidates

- `common.culture` at `src/features/home/pages/HomePageContent.jsx:319`, `src/features/map/constant/mapColor.js:4` fallback(s): none
- `common.errors.carousel_context` at `src/components/ui/carousel.jsx:15` fallback(s): none
- `common.errors.file_upload_item_context` at `src/components/ui/file-upload.jsx:841` fallback(s): none
- `common.errors.file_upload_root_context` at `src/components/ui/file-upload.jsx:124`, `src/components/ui/file-upload.jsx:93` fallback(s): none
- `common.errors.http_status` at `src/features/map/utils/highlightRouteUtils.js:126` fallback(s): none
- `common.errors.occurred` at `src/services/errorUtils.jsx:5` fallback(s): none
- `common.errors.session_expired` at `src/services/apiClient.js:39`, `src/services/useApi.js:109`, `src/services/useApi.js:185`, `src/services/useApi.js:247` fallback(s): none
- `common.hours_ago` at `src/features/map/components/rightSidebar/CapacityPanel.jsx:118` fallback(s): none
- `common.infrastructure` at `src/features/home/pages/HomePageContent.jsx:319`, `src/features/map/constant/mapColor.js:5` fallback(s): none
- `common.just_updated` at `src/features/map/components/rightSidebar/CapacityPanel.jsx:115` fallback(s): none
- `common.minutes_ago` at `src/features/map/components/rightSidebar/CapacityPanel.jsx:116` fallback(s): none
- `common.natural` at `src/features/home/pages/HomePageContent.jsx:319`, `src/features/map/constant/mapColor.js:3` fallback(s): none
- `common.new` at `src/features/tourism-points/components/list/TourismPointCards.jsx:123` fallback(s): none
- `common.open_in_new_tab` at `src/features/map/components/rightSidebar/ChatbotPanel.jsx:506` fallback(s): none
- `home.mock.common.kim_son` at `src/features/home/data/homeData.js:189` fallback(s): none
- `home.mock.common.ninh_binh` at `src/features/home/data/homeData.js:171`, `src/features/home/data/homeData.js:180`, `src/features/home/data/homeData.js:69`, `src/features/home/data/homeData.js:79`, `src/features/home/data/homeData.js:89` fallback(s): none
- `home.mock.featured_destinations.bai_dinh.description` at `src/features/home/data/homeData.js:92`, `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/pages/MapPageContent.jsx:147` fallback(s): none
- `home.mock.featured_destinations.bai_dinh.name` at `src/features/home/data/homeData.js:88`, `src/features/home/pages/HomePageContent.jsx:319` fallback(s): none
- `home.mock.featured_destinations.bai_dinh.subtitle` at `src/features/home/data/homeData.js:90`, `src/features/home/pages/HomePageContent.jsx:321` fallback(s): none
- `home.mock.featured_destinations.hoa_lu.description` at `src/features/home/data/homeData.js:82`, `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/pages/MapPageContent.jsx:147` fallback(s): none
- `home.mock.featured_destinations.hoa_lu.name` at `src/features/home/data/homeData.js:78`, `src/features/home/pages/HomePageContent.jsx:319` fallback(s): none
- `home.mock.featured_destinations.hoa_lu.subtitle` at `src/features/home/data/homeData.js:80`, `src/features/home/pages/HomePageContent.jsx:321` fallback(s): none
- `home.mock.featured_destinations.trang_an.description` at `src/features/home/data/homeData.js:72`, `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/pages/MapPageContent.jsx:147` fallback(s): none
- `home.mock.featured_destinations.trang_an.name` at `src/features/home/data/homeData.js:68`, `src/features/home/pages/HomePageContent.jsx:319` fallback(s): none
- `home.mock.featured_destinations.trang_an.subtitle` at `src/features/home/data/homeData.js:70`, `src/features/home/pages/HomePageContent.jsx:321` fallback(s): none
- `home.mock.food_bullets.item_1.label` at `src/features/home/data/homeData.js:128`, `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311` fallback(s): none
- `home.mock.food_bullets.item_2.label` at `src/features/home/data/homeData.js:130`, `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311` fallback(s): none
- `home.mock.food_bullets.item_2.value` at `src/features/home/data/homeData.js:131` fallback(s): none
- `home.mock.food_bullets.item_3.label` at `src/features/home/data/homeData.js:133`, `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311` fallback(s): none
- `home.mock.hero_events.hoa_lu.time` at `src/features/home/data/homeData.js:11`, `src/features/home/pages/HomePageContent.jsx:368` fallback(s): none
- `home.mock.hero_events.hoa_lu.title` at `src/features/home/data/homeData.js:10`, `src/features/home/pages/HomePageContent.jsx:1054`, `src/features/home/pages/HomePageContent.jsx:1302`, `src/features/home/pages/HomePageContent.jsx:306`, `src/features/home/pages/HomePageContent.jsx:330` fallback(s): none
- `home.mock.hero_events.light_show.time` at `src/features/home/data/homeData.js:19`, `src/features/home/pages/HomePageContent.jsx:368` fallback(s): none
- `home.mock.hero_events.light_show.title` at `src/features/home/data/homeData.js:18`, `src/features/home/pages/HomePageContent.jsx:1054`, `src/features/home/pages/HomePageContent.jsx:1302`, `src/features/home/pages/HomePageContent.jsx:306`, `src/features/home/pages/HomePageContent.jsx:330` fallback(s): none
- `home.mock.hero_events.tourism_week.time` at `src/features/home/data/homeData.js:15`, `src/features/home/pages/HomePageContent.jsx:368` fallback(s): none
- `home.mock.hero_events.tourism_week.title` at `src/features/home/data/homeData.js:14`, `src/features/home/pages/HomePageContent.jsx:1054`, `src/features/home/pages/HomePageContent.jsx:1302`, `src/features/home/pages/HomePageContent.jsx:306`, `src/features/home/pages/HomePageContent.jsx:330` fallback(s): none
- `home.mock.hero_stats.average_load` at `src/features/home/data/homeData.js:4`, `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311` fallback(s): none
- `home.mock.hero_stats.events_offers` at `src/features/home/data/homeData.js:5`, `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311` fallback(s): none
- `home.mock.hero_stats.featured` at `src/features/home/data/homeData.js:3`, `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311` fallback(s): none
- `home.mock.hero_stats.vr360` at `src/features/home/data/homeData.js:6`, `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311` fallback(s): none
- `home.mock.itinerary.item_1` at `src/features/home/data/homeData.js:115`, `src/features/home/pages/HomePageContent.jsx:312` fallback(s): none
- `home.mock.itinerary.item_2` at `src/features/home/data/homeData.js:116`, `src/features/home/pages/HomePageContent.jsx:312` fallback(s): none
- `home.mock.itinerary.item_3` at `src/features/home/data/homeData.js:117`, `src/features/home/pages/HomePageContent.jsx:312` fallback(s): none
- `home.mock.itinerary.item_4` at `src/features/home/data/homeData.js:118`, `src/features/home/pages/HomePageContent.jsx:312` fallback(s): none
- `home.mock.itinerary.item_5` at `src/features/home/data/homeData.js:119`, `src/features/home/pages/HomePageContent.jsx:312` fallback(s): none
- `home.mock.news_items.item_1.excerpt` at `src/features/home/data/homeData.js:101` fallback(s): none
- `home.mock.news_items.item_1.title` at `src/features/home/data/homeData.js:99`, `src/features/home/pages/HomePageContent.jsx:1054`, `src/features/home/pages/HomePageContent.jsx:1302`, `src/features/home/pages/HomePageContent.jsx:306`, `src/features/home/pages/HomePageContent.jsx:330` fallback(s): none
- `home.mock.news_items.item_2.excerpt` at `src/features/home/data/homeData.js:106` fallback(s): none
- `home.mock.news_items.item_2.title` at `src/features/home/data/homeData.js:104`, `src/features/home/pages/HomePageContent.jsx:1054`, `src/features/home/pages/HomePageContent.jsx:1302`, `src/features/home/pages/HomePageContent.jsx:306`, `src/features/home/pages/HomePageContent.jsx:330` fallback(s): none
- `home.mock.news_items.item_3.excerpt` at `src/features/home/data/homeData.js:111` fallback(s): none
- `home.mock.news_items.item_3.title` at `src/features/home/data/homeData.js:109`, `src/features/home/pages/HomePageContent.jsx:1054`, `src/features/home/pages/HomePageContent.jsx:1302`, `src/features/home/pages/HomePageContent.jsx:306`, `src/features/home/pages/HomePageContent.jsx:330` fallback(s): none
- `home.mock.ocop_products.item_1.description` at `src/features/home/data/homeData.js:173`, `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/pages/MapPageContent.jsx:147` fallback(s): none
- `home.mock.ocop_products.item_1.name` at `src/features/home/data/homeData.js:169`, `src/features/home/pages/HomePageContent.jsx:319` fallback(s): none
- `home.mock.ocop_products.item_1.price` at `src/features/home/data/homeData.js:172` fallback(s): none
- `home.mock.ocop_products.item_1.stars` at `src/features/home/data/homeData.js:170` fallback(s): none
- `home.mock.ocop_products.item_2.description` at `src/features/home/data/homeData.js:182`, `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/pages/MapPageContent.jsx:147` fallback(s): none
- `home.mock.ocop_products.item_2.name` at `src/features/home/data/homeData.js:178`, `src/features/home/pages/HomePageContent.jsx:319` fallback(s): none
- `home.mock.ocop_products.item_2.price` at `src/features/home/data/homeData.js:181` fallback(s): none
- `home.mock.ocop_products.item_2.stars` at `src/features/home/data/homeData.js:179` fallback(s): none
- `home.mock.ocop_products.item_3.description` at `src/features/home/data/homeData.js:191`, `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/pages/MapPageContent.jsx:147` fallback(s): none
- `home.mock.ocop_products.item_3.name` at `src/features/home/data/homeData.js:187`, `src/features/home/pages/HomePageContent.jsx:319` fallback(s): none
- `home.mock.ocop_products.item_3.price` at `src/features/home/data/homeData.js:190` fallback(s): none
- `home.mock.ocop_products.item_3.stars` at `src/features/home/data/homeData.js:188` fallback(s): none
- `home.mock.promo_banner.cta` at `src/features/home/data/homeData.js:25` fallback(s): none
- `home.mock.promo_banner.description` at `src/features/home/data/homeData.js:24`, `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/pages/MapPageContent.jsx:147` fallback(s): none
- `home.mock.promo_banner.title` at `src/features/home/data/homeData.js:23`, `src/features/home/pages/HomePageContent.jsx:1054`, `src/features/home/pages/HomePageContent.jsx:1302`, `src/features/home/pages/HomePageContent.jsx:306`, `src/features/home/pages/HomePageContent.jsx:330` fallback(s): none
- `home.mock.quick_links.map.description` at `src/features/home/data/homeData.js:33`, `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/pages/MapPageContent.jsx:147` fallback(s): none
- `home.mock.quick_links.map.title` at `src/features/home/data/homeData.js:32`, `src/features/home/pages/HomePageContent.jsx:1054`, `src/features/home/pages/HomePageContent.jsx:1302`, `src/features/home/pages/HomePageContent.jsx:306`, `src/features/home/pages/HomePageContent.jsx:330` fallback(s): none
- `home.mock.quick_links.ocop.description` at `src/features/home/data/homeData.js:61`, `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/pages/MapPageContent.jsx:147` fallback(s): none
- `home.mock.quick_links.ocop.title` at `src/features/home/data/homeData.js:60`, `src/features/home/pages/HomePageContent.jsx:1054`, `src/features/home/pages/HomePageContent.jsx:1302`, `src/features/home/pages/HomePageContent.jsx:306`, `src/features/home/pages/HomePageContent.jsx:330` fallback(s): none
- `home.mock.quick_links.plan.description` at `src/features/home/data/homeData.js:47`, `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/pages/MapPageContent.jsx:147` fallback(s): none
- `home.mock.quick_links.plan.title` at `src/features/home/data/homeData.js:46`, `src/features/home/pages/HomePageContent.jsx:1054`, `src/features/home/pages/HomePageContent.jsx:1302`, `src/features/home/pages/HomePageContent.jsx:306`, `src/features/home/pages/HomePageContent.jsx:330` fallback(s): none
- `home.mock.quick_links.service.description` at `src/features/home/data/homeData.js:54`, `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/pages/MapPageContent.jsx:147` fallback(s): none
- `home.mock.quick_links.service.title` at `src/features/home/data/homeData.js:53`, `src/features/home/pages/HomePageContent.jsx:1054`, `src/features/home/pages/HomePageContent.jsx:1302`, `src/features/home/pages/HomePageContent.jsx:306`, `src/features/home/pages/HomePageContent.jsx:330` fallback(s): none
- `home.mock.quick_links.vr.description` at `src/features/home/data/homeData.js:40`, `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/pages/MapPageContent.jsx:147` fallback(s): none
- `home.mock.quick_links.vr.title` at `src/features/home/data/homeData.js:39`, `src/features/home/pages/HomePageContent.jsx:1054`, `src/features/home/pages/HomePageContent.jsx:1302`, `src/features/home/pages/HomePageContent.jsx:306`, `src/features/home/pages/HomePageContent.jsx:330` fallback(s): none
- `home.mock.services.item_1.description` at `src/features/home/data/homeData.js:142`, `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/pages/MapPageContent.jsx:147` fallback(s): none
- `home.mock.services.item_1.name` at `src/features/home/data/homeData.js:137`, `src/features/home/pages/HomePageContent.jsx:319` fallback(s): none
- `home.mock.services.item_1.price` at `src/features/home/data/homeData.js:140` fallback(s): none
- `home.mock.services.item_1.type` at `src/features/home/data/homeData.js:138`, `src/features/vlog/pages/VlogPageContent.jsx:40` fallback(s): none
- `home.mock.services.item_2.description` at `src/features/home/data/homeData.js:152`, `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/pages/MapPageContent.jsx:147` fallback(s): none
- `home.mock.services.item_2.name` at `src/features/home/data/homeData.js:147`, `src/features/home/pages/HomePageContent.jsx:319` fallback(s): none
- `home.mock.services.item_2.price` at `src/features/home/data/homeData.js:150` fallback(s): none
- `home.mock.services.item_2.type` at `src/features/home/data/homeData.js:148`, `src/features/vlog/pages/VlogPageContent.jsx:40` fallback(s): none
- `home.mock.services.item_3.description` at `src/features/home/data/homeData.js:162`, `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/pages/MapPageContent.jsx:147` fallback(s): none
- `home.mock.services.item_3.name` at `src/features/home/data/homeData.js:157`, `src/features/home/pages/HomePageContent.jsx:319` fallback(s): none
- `home.mock.services.item_3.price` at `src/features/home/data/homeData.js:160` fallback(s): none
- `home.mock.services.item_3.type` at `src/features/home/data/homeData.js:158`, `src/features/vlog/pages/VlogPageContent.jsx:40` fallback(s): none
- `home.mock.vlog_stories.item_1.description` at `src/features/home/data/homeData.js:200`, `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/pages/MapPageContent.jsx:147` fallback(s): none
- `home.mock.vlog_stories.item_1.title` at `src/features/home/data/homeData.js:198`, `src/features/home/pages/HomePageContent.jsx:1054`, `src/features/home/pages/HomePageContent.jsx:1302`, `src/features/home/pages/HomePageContent.jsx:306`, `src/features/home/pages/HomePageContent.jsx:330` fallback(s): none
- `home.mock.vlog_stories.item_2.description` at `src/features/home/data/homeData.js:207`, `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/pages/MapPageContent.jsx:147` fallback(s): none
- `home.mock.vlog_stories.item_2.title` at `src/features/home/data/homeData.js:205`, `src/features/home/pages/HomePageContent.jsx:1054`, `src/features/home/pages/HomePageContent.jsx:1302`, `src/features/home/pages/HomePageContent.jsx:306`, `src/features/home/pages/HomePageContent.jsx:330` fallback(s): none
- `home.mock.vlog_stories.item_3.description` at `src/features/home/data/homeData.js:214`, `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/pages/MapPageContent.jsx:147` fallback(s): none
- `home.mock.vlog_stories.item_3.title` at `src/features/home/data/homeData.js:212`, `src/features/home/pages/HomePageContent.jsx:1054`, `src/features/home/pages/HomePageContent.jsx:1302`, `src/features/home/pages/HomePageContent.jsx:306`, `src/features/home/pages/HomePageContent.jsx:330` fallback(s): none
- `mapPage.capacityPanel.capacityCurrent` at `src/features/map/components/rightSidebar/CapacityPanel.jsx:345` fallback(s): none
- `mapPage.capacityPanel.capacityWithMax` at `src/features/map/components/rightSidebar/CapacityPanel.jsx:341` fallback(s): none
- `mapPage.capacityPanel.filteredCount` at `src/features/map/components/rightSidebar/CapacityPanel.jsx:329` fallback(s): none
- `mapPage.capacityPanel.status.low` at `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TourPanel.jsx:177`, `src/features/map/components/rightSidebar/TourPanel.jsx:225`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:52` fallback(s): none
- `mapPage.capacityPanel.status.moderate` at `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TourPanel.jsx:167`, `src/features/map/components/rightSidebar/TourPanel.jsx:225`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:34` fallback(s): none
- `mapPage.capacityPanel.status.unknown` at `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TourPanel.jsx:182`, `src/features/map/components/rightSidebar/TourPanel.jsx:225`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:59` fallback(s): none
- `mapPage.capacityPanel.trackedCount` at `src/features/map/components/rightSidebar/CapacityPanel.jsx:333` fallback(s): none
- `mapPage.mock.destinations.hoaLuOldTown.description` at `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/constant/mapPageMockData.js:41`, `src/features/map/pages/MapPageContent.jsx:147` fallback(s): none
- `mapPage.mock.destinations.tamCoc.description` at `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/constant/mapPageMockData.js:19`, `src/features/map/pages/MapPageContent.jsx:147` fallback(s): none
- `mapPage.mock.destinations.trangAn.description` at `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/constant/mapPageMockData.js:8`, `src/features/map/pages/MapPageContent.jsx:147` fallback(s): none
- `mapPage.mock.tourSuggestions.cultureFocus` at `src/features/map/constant/mapPageMockData.js:88`, `src/features/map/pages/MapPageContent.jsx:155`, `src/features/vlog/pages/VlogPageContent.jsx:52` fallback(s): none
- `mapPage.mock.tourSuggestions.softDay` at `src/features/map/constant/mapPageMockData.js:83`, `src/features/map/pages/MapPageContent.jsx:155`, `src/features/vlog/pages/VlogPageContent.jsx:52` fallback(s): none
- `mapPage.ocopPanel.fallbackProductName` at `src/features/map/components/OcopProductModal.jsx:45` fallback(s): none
- `mapPage.ocopPanel.ocopStars` at `src/features/map/components/OcopProductModal.jsx:115`, `src/features/map/components/OcopProductModal.jsx:75` fallback(s): none
- `mapPage.ocopPanel.oneCommuneOneProduct` at `src/features/map/components/OcopProductModal.jsx:117` fallback(s): none
- `mapPage.ocopPanel.productCertified` at `src/features/map/components/OcopProductModal.jsx:113` fallback(s): none
- `mapPage.ocopPanel.productModalDescription` at `src/features/map/components/OcopProductModal.jsx:46` fallback(s): none
- `mapPage.ocopPanel.viewDestination` at `src/features/map/components/OcopProductModal.jsx:128` fallback(s): none
- `mapPage.traffic.flowLevels.free_flow` at `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:18`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311` fallback(s): none
- `mapPage.traffic.flowLevels.heavy` at `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:20`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311` fallback(s): none
- `mapPage.traffic.flowLevels.moderate` at `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:19`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311` fallback(s): none
- `mapPage.traffic.flowLevels.severe` at `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:21`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311` fallback(s): none
- `mapPage.traffic.summary.accident` at `src/features/map/components/rightSidebar/TrafficPanel.jsx:125` fallback(s): none
- `mapPage.traffic.summary.avg_delay` at `src/features/map/components/rightSidebar/TrafficPanel.jsx:170` fallback(s): none
- `mapPage.traffic.summary.jam` at `src/features/map/components/rightSidebar/TrafficPanel.jsx:132` fallback(s): none
- `mapPage.traffic.summary.minutes` at `src/features/map/components/rightSidebar/TrafficPanel.jsx:173` fallback(s): none
- `mapPage.traffic.summary.total` at `src/features/map/components/rightSidebar/TrafficPanel.jsx:118` fallback(s): none
- `mapPage.traffic.summary.works` at `src/features/map/components/rightSidebar/TrafficPanel.jsx:139` fallback(s): none
- `newsPage.comments.admin_role` at `src/features/news/components/NewsCommentSection.jsx:160` fallback(s): none
- `satellite.legend.change.no_change` at `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`, `src/features/satellite/components/SatelliteLayerControl.jsx:92` fallback(s): none
- `satellite.legend.change.road_construction` at `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`, `src/features/satellite/components/SatelliteLayerControl.jsx:92` fallback(s): none
- `satellite.legend.change.vegetation_gain` at `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`, `src/features/satellite/components/SatelliteLayerControl.jsx:92` fallback(s): none
- `satellite.legend.change.vegetation_loss` at `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`, `src/features/satellite/components/SatelliteLayerControl.jsx:92` fallback(s): none
- `satellite.legend.change.vegetation_loss_road` at `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`, `src/features/satellite/components/SatelliteLayerControl.jsx:92` fallback(s): none
- `satellite.legend.classified.agriculture` at `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`, `src/features/satellite/components/SatelliteLayerControl.jsx:92` fallback(s): none
- `satellite.legend.classified.bare_land` at `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`, `src/features/satellite/components/SatelliteLayerControl.jsx:92` fallback(s): none
- `satellite.legend.classified.evergreen_forest` at `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`, `src/features/satellite/components/SatelliteLayerControl.jsx:92` fallback(s): none
- `satellite.legend.classified.open_forest` at `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`, `src/features/satellite/components/SatelliteLayerControl.jsx:92` fallback(s): none
- `satellite.legend.classified.shrub_grass` at `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`, `src/features/satellite/components/SatelliteLayerControl.jsx:92` fallback(s): none
- `satellite.legend.classified.urban` at `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`, `src/features/satellite/components/SatelliteLayerControl.jsx:92` fallback(s): none
- `satellite.legend.classified.water` at `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`, `src/features/satellite/components/SatelliteLayerControl.jsx:92` fallback(s): none
- `satellite.legend.heatmap.cool` at `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`, `src/features/satellite/components/SatelliteLayerControl.jsx:92` fallback(s): none
- `satellite.legend.heatmap.hot` at `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`, `src/features/satellite/components/SatelliteLayerControl.jsx:92` fallback(s): none
- `satellite.legend.heatmap.moderate` at `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`, `src/features/satellite/components/SatelliteLayerControl.jsx:92` fallback(s): none
- `satellite.legend.heatmap.very_cool` at `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`, `src/features/satellite/components/SatelliteLayerControl.jsx:92` fallback(s): none
- `satellite.legend.heatmap.very_hot` at `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`, `src/features/satellite/components/SatelliteLayerControl.jsx:92` fallback(s): none
- `satellite.legend.heatmap.warm` at `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`, `src/features/satellite/components/SatelliteLayerControl.jsx:92` fallback(s): none
- `tourPage.bookTrip` at `src/features/tours/pages/TourDetailPage.jsx:761`, `src/features/tours/pages/TourDetailPage.jsx:771` fallback(s): none
- `tourPage.capacityLoad` at `src/features/tours/pages/TourDetailPage.jsx:635`, `src/features/tours/pages/TourDetailPage.jsx:637`, `src/features/tours/pages/TourDetailPage.jsx:638` fallback(s): none
- `tourPage.dayHeading` at `src/features/tours/pages/TourDetailPage.jsx:589` fallback(s): none
- `tourPage.dayLabel` at `src/features/tours/pages/TourDetailPage.jsx:597` fallback(s): none
- `tourPage.defaultSchedule` at `src/features/tours/pages/TourDetailPage.jsx:529`, `src/features/tours/pages/TourDetailPage.jsx:596` fallback(s): none
- `tourPage.guestRange` at `src/features/tours/pages/TourDetailPage.jsx:547` fallback(s): none
- `tourPage.minutesLabel` at `src/features/tours/pages/TourDetailPage.jsx:627` fallback(s): none
- `tourPage.priceNote` at `src/features/tours/pages/TourDetailPage.jsx:748` fallback(s): none
- `tourPage.routeOverview` at `src/features/tours/pages/TourDetailPage.jsx:493` fallback(s): none
- `tourPage.stopLabel` at `src/features/tours/pages/TourDetailPage.jsx:622` fallback(s): none
- `tourPage.stops` at `src/features/tours/pages/TourDetailPage.jsx:533` fallback(s): none
- `tourPage.suitableForGroups` at `src/features/tours/pages/TourDetailPage.jsx:548` fallback(s): none
- `vlogPage.mock.places.bai_dinh` at `src/features/vlog/data/vlogData.js:36`, `src/features/vlog/pages/VlogPageContent.jsx:39` fallback(s): none
- `vlogPage.mock.places.ha_long` at `src/features/vlog/data/vlogData.js:51`, `src/features/vlog/pages/VlogPageContent.jsx:39` fallback(s): none
- `vlogPage.mock.places.ninh_binh` at `src/features/vlog/data/vlogData.js:67`, `src/features/vlog/data/vlogData.js:83`, `src/features/vlog/pages/VlogPageContent.jsx:39` fallback(s): none
- `vlogPage.mock.places.tam_coc` at `src/features/vlog/data/vlogData.js:20`, `src/features/vlog/pages/VlogPageContent.jsx:39` fallback(s): none
- `vlogPage.mock.places.trang_an` at `src/features/vlog/data/vlogData.js:5`, `src/features/vlog/pages/VlogPageContent.jsx:39` fallback(s): none
- `vlogPage.mock.posts.item_1.description` at `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/pages/MapPageContent.jsx:147`, `src/features/vlog/data/vlogData.js:13` fallback(s): none
- `vlogPage.mock.posts.item_1.title` at `src/features/home/pages/HomePageContent.jsx:1054`, `src/features/home/pages/HomePageContent.jsx:1302`, `src/features/home/pages/HomePageContent.jsx:306`, `src/features/home/pages/HomePageContent.jsx:330`, `src/features/home/pages/HomePageContent.jsx:367` fallback(s): none
- `vlogPage.mock.posts.item_2.description` at `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/pages/MapPageContent.jsx:147`, `src/features/vlog/data/vlogData.js:28` fallback(s): none
- `vlogPage.mock.posts.item_2.title` at `src/features/home/pages/HomePageContent.jsx:1054`, `src/features/home/pages/HomePageContent.jsx:1302`, `src/features/home/pages/HomePageContent.jsx:306`, `src/features/home/pages/HomePageContent.jsx:330`, `src/features/home/pages/HomePageContent.jsx:367` fallback(s): none
- `vlogPage.mock.posts.item_3.description` at `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/pages/MapPageContent.jsx:147`, `src/features/vlog/data/vlogData.js:44` fallback(s): none
- `vlogPage.mock.posts.item_3.title` at `src/features/home/pages/HomePageContent.jsx:1054`, `src/features/home/pages/HomePageContent.jsx:1302`, `src/features/home/pages/HomePageContent.jsx:306`, `src/features/home/pages/HomePageContent.jsx:330`, `src/features/home/pages/HomePageContent.jsx:367` fallback(s): none
- `vlogPage.mock.posts.item_4.description` at `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/pages/MapPageContent.jsx:147`, `src/features/vlog/data/vlogData.js:59` fallback(s): none
- `vlogPage.mock.posts.item_4.title` at `src/features/home/pages/HomePageContent.jsx:1054`, `src/features/home/pages/HomePageContent.jsx:1302`, `src/features/home/pages/HomePageContent.jsx:306`, `src/features/home/pages/HomePageContent.jsx:330`, `src/features/home/pages/HomePageContent.jsx:367` fallback(s): none
- `vlogPage.mock.posts.item_5.description` at `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/pages/MapPageContent.jsx:147`, `src/features/vlog/data/vlogData.js:75` fallback(s): none
- `vlogPage.mock.posts.item_5.title` at `src/features/home/pages/HomePageContent.jsx:1054`, `src/features/home/pages/HomePageContent.jsx:1302`, `src/features/home/pages/HomePageContent.jsx:306`, `src/features/home/pages/HomePageContent.jsx:330`, `src/features/home/pages/HomePageContent.jsx:367` fallback(s): none
- `vlogPage.mock.posts.item_6.description` at `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/pages/MapPageContent.jsx:147`, `src/features/vlog/data/vlogData.js:91` fallback(s): none
- `vlogPage.mock.posts.item_6.title` at `src/features/home/pages/HomePageContent.jsx:1054`, `src/features/home/pages/HomePageContent.jsx:1302`, `src/features/home/pages/HomePageContent.jsx:306`, `src/features/home/pages/HomePageContent.jsx:330`, `src/features/home/pages/HomePageContent.jsx:367` fallback(s): none
- `vlogPage.mock.time.days_ago` at `src/features/vlog/data/vlogData.js:60`, `src/features/vlog/data/vlogData.js:76`, `src/features/vlog/pages/VlogPageContent.jsx:43` fallback(s): none
- `vlogPage.mock.time.hours_ago` at `src/features/vlog/data/vlogData.js:29`, `src/features/vlog/pages/VlogPageContent.jsx:43` fallback(s): none
- `vlogPage.mock.time.today` at `src/features/vlog/data/vlogData.js:14`, `src/features/vlog/pages/VlogPageContent.jsx:43` fallback(s): none
- `vlogPage.mock.time.weeks_ago` at `src/features/vlog/data/vlogData.js:92`, `src/features/vlog/pages/VlogPageContent.jsx:43` fallback(s): none
- `vlogPage.mock.time.yesterday` at `src/features/vlog/data/vlogData.js:45`, `src/features/vlog/pages/VlogPageContent.jsx:43` fallback(s): none
- `vlogPage.mock.trending.item_1.text` at `src/features/map/pages/MapPageContent.jsx:155`, `src/features/vlog/data/vlogData.js:102`, `src/features/vlog/pages/VlogPageContent.jsx:52` fallback(s): none
- `vlogPage.mock.trending.item_1.title` at `src/features/home/pages/HomePageContent.jsx:1054`, `src/features/home/pages/HomePageContent.jsx:1302`, `src/features/home/pages/HomePageContent.jsx:306`, `src/features/home/pages/HomePageContent.jsx:330`, `src/features/home/pages/HomePageContent.jsx:367` fallback(s): none
- `vlogPage.mock.trending.item_2.text` at `src/features/map/pages/MapPageContent.jsx:155`, `src/features/vlog/data/vlogData.js:109`, `src/features/vlog/pages/VlogPageContent.jsx:52` fallback(s): none
- `vlogPage.mock.trending.item_2.title` at `src/features/home/pages/HomePageContent.jsx:1054`, `src/features/home/pages/HomePageContent.jsx:1302`, `src/features/home/pages/HomePageContent.jsx:306`, `src/features/home/pages/HomePageContent.jsx:330`, `src/features/home/pages/HomePageContent.jsx:367` fallback(s): none
- `vlogPage.mock.trending.item_3.text` at `src/features/map/pages/MapPageContent.jsx:155`, `src/features/vlog/data/vlogData.js:116`, `src/features/vlog/pages/VlogPageContent.jsx:52` fallback(s): none
- `vlogPage.mock.trending.item_3.title` at `src/features/home/pages/HomePageContent.jsx:1054`, `src/features/home/pages/HomePageContent.jsx:1302`, `src/features/home/pages/HomePageContent.jsx:306`, `src/features/home/pages/HomePageContent.jsx:330`, `src/features/home/pages/HomePageContent.jsx:367` fallback(s): none
- `vlogPage.topics.checkin` at `src/features/vlog/data/vlogData.js:53`, `src/features/vlog/pages/VlogPageContent.jsx:41` fallback(s): none
- `vlogPage.topics.nature` at `src/features/vlog/data/vlogData.js:7`, `src/features/vlog/pages/VlogPageContent.jsx:41` fallback(s): none

```json
{
  "common.culture": "TODO_REVIEW",
  "common.errors.carousel_context": "TODO_REVIEW",
  "common.errors.file_upload_item_context": "TODO_REVIEW",
  "common.errors.file_upload_root_context": "TODO_REVIEW",
  "common.errors.http_status": "TODO_REVIEW",
  "common.errors.occurred": "TODO_REVIEW",
  "common.errors.session_expired": "TODO_REVIEW",
  "common.hours_ago": "TODO_REVIEW",
  "common.infrastructure": "TODO_REVIEW",
  "common.just_updated": "TODO_REVIEW",
  "common.minutes_ago": "TODO_REVIEW",
  "common.natural": "TODO_REVIEW",
  "common.new": "TODO_REVIEW",
  "common.open_in_new_tab": "TODO_REVIEW",
  "home.mock.common.kim_son": "TODO_REVIEW",
  "home.mock.common.ninh_binh": "TODO_REVIEW",
  "home.mock.featured_destinations.bai_dinh.description": "TODO_REVIEW",
  "home.mock.featured_destinations.bai_dinh.name": "TODO_REVIEW",
  "home.mock.featured_destinations.bai_dinh.subtitle": "TODO_REVIEW",
  "home.mock.featured_destinations.hoa_lu.description": "TODO_REVIEW",
  "home.mock.featured_destinations.hoa_lu.name": "TODO_REVIEW",
  "home.mock.featured_destinations.hoa_lu.subtitle": "TODO_REVIEW",
  "home.mock.featured_destinations.trang_an.description": "TODO_REVIEW",
  "home.mock.featured_destinations.trang_an.name": "TODO_REVIEW",
  "home.mock.featured_destinations.trang_an.subtitle": "TODO_REVIEW",
  "home.mock.food_bullets.item_1.label": "TODO_REVIEW",
  "home.mock.food_bullets.item_2.label": "TODO_REVIEW",
  "home.mock.food_bullets.item_2.value": "TODO_REVIEW",
  "home.mock.food_bullets.item_3.label": "TODO_REVIEW",
  "home.mock.hero_events.hoa_lu.time": "TODO_REVIEW",
  "home.mock.hero_events.hoa_lu.title": "TODO_REVIEW",
  "home.mock.hero_events.light_show.time": "TODO_REVIEW",
  "home.mock.hero_events.light_show.title": "TODO_REVIEW",
  "home.mock.hero_events.tourism_week.time": "TODO_REVIEW",
  "home.mock.hero_events.tourism_week.title": "TODO_REVIEW",
  "home.mock.hero_stats.average_load": "TODO_REVIEW",
  "home.mock.hero_stats.events_offers": "TODO_REVIEW",
  "home.mock.hero_stats.featured": "TODO_REVIEW",
  "home.mock.hero_stats.vr360": "TODO_REVIEW",
  "home.mock.itinerary.item_1": "TODO_REVIEW",
  "home.mock.itinerary.item_2": "TODO_REVIEW",
  "home.mock.itinerary.item_3": "TODO_REVIEW",
  "home.mock.itinerary.item_4": "TODO_REVIEW",
  "home.mock.itinerary.item_5": "TODO_REVIEW",
  "home.mock.news_items.item_1.excerpt": "TODO_REVIEW",
  "home.mock.news_items.item_1.title": "TODO_REVIEW",
  "home.mock.news_items.item_2.excerpt": "TODO_REVIEW",
  "home.mock.news_items.item_2.title": "TODO_REVIEW",
  "home.mock.news_items.item_3.excerpt": "TODO_REVIEW",
  "home.mock.news_items.item_3.title": "TODO_REVIEW",
  "home.mock.ocop_products.item_1.description": "TODO_REVIEW",
  "home.mock.ocop_products.item_1.name": "TODO_REVIEW",
  "home.mock.ocop_products.item_1.price": "TODO_REVIEW",
  "home.mock.ocop_products.item_1.stars": "TODO_REVIEW",
  "home.mock.ocop_products.item_2.description": "TODO_REVIEW",
  "home.mock.ocop_products.item_2.name": "TODO_REVIEW",
  "home.mock.ocop_products.item_2.price": "TODO_REVIEW",
  "home.mock.ocop_products.item_2.stars": "TODO_REVIEW",
  "home.mock.ocop_products.item_3.description": "TODO_REVIEW",
  "home.mock.ocop_products.item_3.name": "TODO_REVIEW",
  "home.mock.ocop_products.item_3.price": "TODO_REVIEW",
  "home.mock.ocop_products.item_3.stars": "TODO_REVIEW",
  "home.mock.promo_banner.cta": "TODO_REVIEW",
  "home.mock.promo_banner.description": "TODO_REVIEW",
  "home.mock.promo_banner.title": "TODO_REVIEW",
  "home.mock.quick_links.map.description": "TODO_REVIEW",
  "home.mock.quick_links.map.title": "TODO_REVIEW",
  "home.mock.quick_links.ocop.description": "TODO_REVIEW",
  "home.mock.quick_links.ocop.title": "TODO_REVIEW",
  "home.mock.quick_links.plan.description": "TODO_REVIEW",
  "home.mock.quick_links.plan.title": "TODO_REVIEW",
  "home.mock.quick_links.service.description": "TODO_REVIEW",
  "home.mock.quick_links.service.title": "TODO_REVIEW",
  "home.mock.quick_links.vr.description": "TODO_REVIEW",
  "home.mock.quick_links.vr.title": "TODO_REVIEW",
  "home.mock.services.item_1.description": "TODO_REVIEW",
  "home.mock.services.item_1.name": "TODO_REVIEW",
  "home.mock.services.item_1.price": "TODO_REVIEW",
  "home.mock.services.item_1.type": "TODO_REVIEW",
  "home.mock.services.item_2.description": "TODO_REVIEW",
  "home.mock.services.item_2.name": "TODO_REVIEW",
  "home.mock.services.item_2.price": "TODO_REVIEW",
  "home.mock.services.item_2.type": "TODO_REVIEW",
  "home.mock.services.item_3.description": "TODO_REVIEW",
  "home.mock.services.item_3.name": "TODO_REVIEW",
  "home.mock.services.item_3.price": "TODO_REVIEW",
  "home.mock.services.item_3.type": "TODO_REVIEW",
  "home.mock.vlog_stories.item_1.description": "TODO_REVIEW",
  "home.mock.vlog_stories.item_1.title": "TODO_REVIEW",
  "home.mock.vlog_stories.item_2.description": "TODO_REVIEW",
  "home.mock.vlog_stories.item_2.title": "TODO_REVIEW",
  "home.mock.vlog_stories.item_3.description": "TODO_REVIEW",
  "home.mock.vlog_stories.item_3.title": "TODO_REVIEW",
  "mapPage.capacityPanel.capacityCurrent": "TODO_REVIEW",
  "mapPage.capacityPanel.capacityWithMax": "TODO_REVIEW",
  "mapPage.capacityPanel.filteredCount": "TODO_REVIEW",
  "mapPage.capacityPanel.status.low": "TODO_REVIEW",
  "mapPage.capacityPanel.status.moderate": "TODO_REVIEW",
  "mapPage.capacityPanel.status.unknown": "TODO_REVIEW",
  "mapPage.capacityPanel.trackedCount": "TODO_REVIEW",
  "mapPage.mock.destinations.hoaLuOldTown.description": "TODO_REVIEW",
  "mapPage.mock.destinations.tamCoc.description": "TODO_REVIEW",
  "mapPage.mock.destinations.trangAn.description": "TODO_REVIEW",
  "mapPage.mock.tourSuggestions.cultureFocus": "TODO_REVIEW",
  "mapPage.mock.tourSuggestions.softDay": "TODO_REVIEW",
  "mapPage.ocopPanel.fallbackProductName": "TODO_REVIEW",
  "mapPage.ocopPanel.ocopStars": "TODO_REVIEW",
  "mapPage.ocopPanel.oneCommuneOneProduct": "TODO_REVIEW",
  "mapPage.ocopPanel.productCertified": "TODO_REVIEW",
  "mapPage.ocopPanel.productModalDescription": "TODO_REVIEW",
  "mapPage.ocopPanel.viewDestination": "TODO_REVIEW",
  "mapPage.traffic.flowLevels.free_flow": "TODO_REVIEW",
  "mapPage.traffic.flowLevels.heavy": "TODO_REVIEW",
  "mapPage.traffic.flowLevels.moderate": "TODO_REVIEW",
  "mapPage.traffic.flowLevels.severe": "TODO_REVIEW",
  "mapPage.traffic.summary.accident": "TODO_REVIEW",
  "mapPage.traffic.summary.avg_delay": "TODO_REVIEW",
  "mapPage.traffic.summary.jam": "TODO_REVIEW",
  "mapPage.traffic.summary.minutes": "TODO_REVIEW",
  "mapPage.traffic.summary.total": "TODO_REVIEW",
  "mapPage.traffic.summary.works": "TODO_REVIEW",
  "newsPage.comments.admin_role": "TODO_REVIEW",
  "satellite.legend.change.no_change": "TODO_REVIEW",
  "satellite.legend.change.road_construction": "TODO_REVIEW",
  "satellite.legend.change.vegetation_gain": "TODO_REVIEW",
  "satellite.legend.change.vegetation_loss": "TODO_REVIEW",
  "satellite.legend.change.vegetation_loss_road": "TODO_REVIEW",
  "satellite.legend.classified.agriculture": "TODO_REVIEW",
  "satellite.legend.classified.bare_land": "TODO_REVIEW",
  "satellite.legend.classified.evergreen_forest": "TODO_REVIEW",
  "satellite.legend.classified.open_forest": "TODO_REVIEW",
  "satellite.legend.classified.shrub_grass": "TODO_REVIEW",
  "satellite.legend.classified.urban": "TODO_REVIEW",
  "satellite.legend.classified.water": "TODO_REVIEW",
  "satellite.legend.heatmap.cool": "TODO_REVIEW",
  "satellite.legend.heatmap.hot": "TODO_REVIEW",
  "satellite.legend.heatmap.moderate": "TODO_REVIEW",
  "satellite.legend.heatmap.very_cool": "TODO_REVIEW",
  "satellite.legend.heatmap.very_hot": "TODO_REVIEW",
  "satellite.legend.heatmap.warm": "TODO_REVIEW",
  "tourPage.bookTrip": "TODO_REVIEW",
  "tourPage.capacityLoad": "TODO_REVIEW",
  "tourPage.dayHeading": "TODO_REVIEW",
  "tourPage.dayLabel": "TODO_REVIEW",
  "tourPage.defaultSchedule": "TODO_REVIEW",
  "tourPage.guestRange": "TODO_REVIEW",
  "tourPage.minutesLabel": "TODO_REVIEW",
  "tourPage.priceNote": "TODO_REVIEW",
  "tourPage.routeOverview": "TODO_REVIEW",
  "tourPage.stopLabel": "TODO_REVIEW",
  "tourPage.stops": "TODO_REVIEW",
  "tourPage.suitableForGroups": "TODO_REVIEW",
  "vlogPage.mock.places.bai_dinh": "TODO_REVIEW",
  "vlogPage.mock.places.ha_long": "TODO_REVIEW",
  "vlogPage.mock.places.ninh_binh": "TODO_REVIEW",
  "vlogPage.mock.places.tam_coc": "TODO_REVIEW",
  "vlogPage.mock.places.trang_an": "TODO_REVIEW",
  "vlogPage.mock.posts.item_1.description": "TODO_REVIEW",
  "vlogPage.mock.posts.item_1.title": "TODO_REVIEW",
  "vlogPage.mock.posts.item_2.description": "TODO_REVIEW",
  "vlogPage.mock.posts.item_2.title": "TODO_REVIEW",
  "vlogPage.mock.posts.item_3.description": "TODO_REVIEW",
  "vlogPage.mock.posts.item_3.title": "TODO_REVIEW",
  "vlogPage.mock.posts.item_4.description": "TODO_REVIEW",
  "vlogPage.mock.posts.item_4.title": "TODO_REVIEW",
  "vlogPage.mock.posts.item_5.description": "TODO_REVIEW",
  "vlogPage.mock.posts.item_5.title": "TODO_REVIEW",
  "vlogPage.mock.posts.item_6.description": "TODO_REVIEW",
  "vlogPage.mock.posts.item_6.title": "TODO_REVIEW",
  "vlogPage.mock.time.days_ago": "TODO_REVIEW",
  "vlogPage.mock.time.hours_ago": "TODO_REVIEW",
  "vlogPage.mock.time.today": "TODO_REVIEW",
  "vlogPage.mock.time.weeks_ago": "TODO_REVIEW",
  "vlogPage.mock.time.yesterday": "TODO_REVIEW",
  "vlogPage.mock.trending.item_1.text": "TODO_REVIEW",
  "vlogPage.mock.trending.item_1.title": "TODO_REVIEW",
  "vlogPage.mock.trending.item_2.text": "TODO_REVIEW",
  "vlogPage.mock.trending.item_2.title": "TODO_REVIEW",
  "vlogPage.mock.trending.item_3.text": "TODO_REVIEW",
  "vlogPage.mock.trending.item_3.title": "TODO_REVIEW",
  "vlogPage.topics.checkin": "TODO_REVIEW",
  "vlogPage.topics.nature": "TODO_REVIEW"
}
```

### VI Candidates

- `common.culture` at `src/features/home/pages/HomePageContent.jsx:319`, `src/features/map/constant/mapColor.js:4` fallback(s): none
- `common.errors.carousel_context` at `src/components/ui/carousel.jsx:15` fallback(s): none
- `common.errors.file_upload_item_context` at `src/components/ui/file-upload.jsx:841` fallback(s): none
- `common.errors.file_upload_root_context` at `src/components/ui/file-upload.jsx:124`, `src/components/ui/file-upload.jsx:93` fallback(s): none
- `common.errors.http_status` at `src/features/map/utils/highlightRouteUtils.js:126` fallback(s): none
- `common.errors.occurred` at `src/services/errorUtils.jsx:5` fallback(s): none
- `common.errors.session_expired` at `src/services/apiClient.js:39`, `src/services/useApi.js:109`, `src/services/useApi.js:185`, `src/services/useApi.js:247` fallback(s): none
- `common.hours_ago` at `src/features/map/components/rightSidebar/CapacityPanel.jsx:118` fallback(s): none
- `common.infrastructure` at `src/features/home/pages/HomePageContent.jsx:319`, `src/features/map/constant/mapColor.js:5` fallback(s): none
- `common.just_updated` at `src/features/map/components/rightSidebar/CapacityPanel.jsx:115` fallback(s): none
- `common.minutes_ago` at `src/features/map/components/rightSidebar/CapacityPanel.jsx:116` fallback(s): none
- `common.natural` at `src/features/home/pages/HomePageContent.jsx:319`, `src/features/map/constant/mapColor.js:3` fallback(s): none
- `common.new` at `src/features/tourism-points/components/list/TourismPointCards.jsx:123` fallback(s): none
- `common.open_in_new_tab` at `src/features/map/components/rightSidebar/ChatbotPanel.jsx:506` fallback(s): none
- `home.mock.common.kim_son` at `src/features/home/data/homeData.js:189` fallback(s): none
- `home.mock.common.ninh_binh` at `src/features/home/data/homeData.js:171`, `src/features/home/data/homeData.js:180`, `src/features/home/data/homeData.js:69`, `src/features/home/data/homeData.js:79`, `src/features/home/data/homeData.js:89` fallback(s): none
- `home.mock.featured_destinations.bai_dinh.description` at `src/features/home/data/homeData.js:92`, `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/pages/MapPageContent.jsx:147` fallback(s): none
- `home.mock.featured_destinations.bai_dinh.name` at `src/features/home/data/homeData.js:88`, `src/features/home/pages/HomePageContent.jsx:319` fallback(s): none
- `home.mock.featured_destinations.bai_dinh.subtitle` at `src/features/home/data/homeData.js:90`, `src/features/home/pages/HomePageContent.jsx:321` fallback(s): none
- `home.mock.featured_destinations.hoa_lu.description` at `src/features/home/data/homeData.js:82`, `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/pages/MapPageContent.jsx:147` fallback(s): none
- `home.mock.featured_destinations.hoa_lu.name` at `src/features/home/data/homeData.js:78`, `src/features/home/pages/HomePageContent.jsx:319` fallback(s): none
- `home.mock.featured_destinations.hoa_lu.subtitle` at `src/features/home/data/homeData.js:80`, `src/features/home/pages/HomePageContent.jsx:321` fallback(s): none
- `home.mock.featured_destinations.trang_an.description` at `src/features/home/data/homeData.js:72`, `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/pages/MapPageContent.jsx:147` fallback(s): none
- `home.mock.featured_destinations.trang_an.name` at `src/features/home/data/homeData.js:68`, `src/features/home/pages/HomePageContent.jsx:319` fallback(s): none
- `home.mock.featured_destinations.trang_an.subtitle` at `src/features/home/data/homeData.js:70`, `src/features/home/pages/HomePageContent.jsx:321` fallback(s): none
- `home.mock.food_bullets.item_1.label` at `src/features/home/data/homeData.js:128`, `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311` fallback(s): none
- `home.mock.food_bullets.item_2.label` at `src/features/home/data/homeData.js:130`, `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311` fallback(s): none
- `home.mock.food_bullets.item_2.value` at `src/features/home/data/homeData.js:131` fallback(s): none
- `home.mock.food_bullets.item_3.label` at `src/features/home/data/homeData.js:133`, `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311` fallback(s): none
- `home.mock.hero_events.hoa_lu.time` at `src/features/home/data/homeData.js:11`, `src/features/home/pages/HomePageContent.jsx:368` fallback(s): none
- `home.mock.hero_events.hoa_lu.title` at `src/features/home/data/homeData.js:10`, `src/features/home/pages/HomePageContent.jsx:1054`, `src/features/home/pages/HomePageContent.jsx:1302`, `src/features/home/pages/HomePageContent.jsx:306`, `src/features/home/pages/HomePageContent.jsx:330` fallback(s): none
- `home.mock.hero_events.light_show.time` at `src/features/home/data/homeData.js:19`, `src/features/home/pages/HomePageContent.jsx:368` fallback(s): none
- `home.mock.hero_events.light_show.title` at `src/features/home/data/homeData.js:18`, `src/features/home/pages/HomePageContent.jsx:1054`, `src/features/home/pages/HomePageContent.jsx:1302`, `src/features/home/pages/HomePageContent.jsx:306`, `src/features/home/pages/HomePageContent.jsx:330` fallback(s): none
- `home.mock.hero_events.tourism_week.time` at `src/features/home/data/homeData.js:15`, `src/features/home/pages/HomePageContent.jsx:368` fallback(s): none
- `home.mock.hero_events.tourism_week.title` at `src/features/home/data/homeData.js:14`, `src/features/home/pages/HomePageContent.jsx:1054`, `src/features/home/pages/HomePageContent.jsx:1302`, `src/features/home/pages/HomePageContent.jsx:306`, `src/features/home/pages/HomePageContent.jsx:330` fallback(s): none
- `home.mock.hero_stats.average_load` at `src/features/home/data/homeData.js:4`, `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311` fallback(s): none
- `home.mock.hero_stats.events_offers` at `src/features/home/data/homeData.js:5`, `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311` fallback(s): none
- `home.mock.hero_stats.featured` at `src/features/home/data/homeData.js:3`, `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311` fallback(s): none
- `home.mock.hero_stats.vr360` at `src/features/home/data/homeData.js:6`, `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311` fallback(s): none
- `home.mock.itinerary.item_1` at `src/features/home/data/homeData.js:115`, `src/features/home/pages/HomePageContent.jsx:312` fallback(s): none
- `home.mock.itinerary.item_2` at `src/features/home/data/homeData.js:116`, `src/features/home/pages/HomePageContent.jsx:312` fallback(s): none
- `home.mock.itinerary.item_3` at `src/features/home/data/homeData.js:117`, `src/features/home/pages/HomePageContent.jsx:312` fallback(s): none
- `home.mock.itinerary.item_4` at `src/features/home/data/homeData.js:118`, `src/features/home/pages/HomePageContent.jsx:312` fallback(s): none
- `home.mock.itinerary.item_5` at `src/features/home/data/homeData.js:119`, `src/features/home/pages/HomePageContent.jsx:312` fallback(s): none
- `home.mock.news_items.item_1.excerpt` at `src/features/home/data/homeData.js:101` fallback(s): none
- `home.mock.news_items.item_1.title` at `src/features/home/data/homeData.js:99`, `src/features/home/pages/HomePageContent.jsx:1054`, `src/features/home/pages/HomePageContent.jsx:1302`, `src/features/home/pages/HomePageContent.jsx:306`, `src/features/home/pages/HomePageContent.jsx:330` fallback(s): none
- `home.mock.news_items.item_2.excerpt` at `src/features/home/data/homeData.js:106` fallback(s): none
- `home.mock.news_items.item_2.title` at `src/features/home/data/homeData.js:104`, `src/features/home/pages/HomePageContent.jsx:1054`, `src/features/home/pages/HomePageContent.jsx:1302`, `src/features/home/pages/HomePageContent.jsx:306`, `src/features/home/pages/HomePageContent.jsx:330` fallback(s): none
- `home.mock.news_items.item_3.excerpt` at `src/features/home/data/homeData.js:111` fallback(s): none
- `home.mock.news_items.item_3.title` at `src/features/home/data/homeData.js:109`, `src/features/home/pages/HomePageContent.jsx:1054`, `src/features/home/pages/HomePageContent.jsx:1302`, `src/features/home/pages/HomePageContent.jsx:306`, `src/features/home/pages/HomePageContent.jsx:330` fallback(s): none
- `home.mock.ocop_products.item_1.description` at `src/features/home/data/homeData.js:173`, `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/pages/MapPageContent.jsx:147` fallback(s): none
- `home.mock.ocop_products.item_1.name` at `src/features/home/data/homeData.js:169`, `src/features/home/pages/HomePageContent.jsx:319` fallback(s): none
- `home.mock.ocop_products.item_1.price` at `src/features/home/data/homeData.js:172` fallback(s): none
- `home.mock.ocop_products.item_1.stars` at `src/features/home/data/homeData.js:170` fallback(s): none
- `home.mock.ocop_products.item_2.description` at `src/features/home/data/homeData.js:182`, `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/pages/MapPageContent.jsx:147` fallback(s): none
- `home.mock.ocop_products.item_2.name` at `src/features/home/data/homeData.js:178`, `src/features/home/pages/HomePageContent.jsx:319` fallback(s): none
- `home.mock.ocop_products.item_2.price` at `src/features/home/data/homeData.js:181` fallback(s): none
- `home.mock.ocop_products.item_2.stars` at `src/features/home/data/homeData.js:179` fallback(s): none
- `home.mock.ocop_products.item_3.description` at `src/features/home/data/homeData.js:191`, `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/pages/MapPageContent.jsx:147` fallback(s): none
- `home.mock.ocop_products.item_3.name` at `src/features/home/data/homeData.js:187`, `src/features/home/pages/HomePageContent.jsx:319` fallback(s): none
- `home.mock.ocop_products.item_3.price` at `src/features/home/data/homeData.js:190` fallback(s): none
- `home.mock.ocop_products.item_3.stars` at `src/features/home/data/homeData.js:188` fallback(s): none
- `home.mock.promo_banner.cta` at `src/features/home/data/homeData.js:25` fallback(s): none
- `home.mock.promo_banner.description` at `src/features/home/data/homeData.js:24`, `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/pages/MapPageContent.jsx:147` fallback(s): none
- `home.mock.promo_banner.title` at `src/features/home/data/homeData.js:23`, `src/features/home/pages/HomePageContent.jsx:1054`, `src/features/home/pages/HomePageContent.jsx:1302`, `src/features/home/pages/HomePageContent.jsx:306`, `src/features/home/pages/HomePageContent.jsx:330` fallback(s): none
- `home.mock.quick_links.map.description` at `src/features/home/data/homeData.js:33`, `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/pages/MapPageContent.jsx:147` fallback(s): none
- `home.mock.quick_links.map.title` at `src/features/home/data/homeData.js:32`, `src/features/home/pages/HomePageContent.jsx:1054`, `src/features/home/pages/HomePageContent.jsx:1302`, `src/features/home/pages/HomePageContent.jsx:306`, `src/features/home/pages/HomePageContent.jsx:330` fallback(s): none
- `home.mock.quick_links.ocop.description` at `src/features/home/data/homeData.js:61`, `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/pages/MapPageContent.jsx:147` fallback(s): none
- `home.mock.quick_links.ocop.title` at `src/features/home/data/homeData.js:60`, `src/features/home/pages/HomePageContent.jsx:1054`, `src/features/home/pages/HomePageContent.jsx:1302`, `src/features/home/pages/HomePageContent.jsx:306`, `src/features/home/pages/HomePageContent.jsx:330` fallback(s): none
- `home.mock.quick_links.plan.description` at `src/features/home/data/homeData.js:47`, `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/pages/MapPageContent.jsx:147` fallback(s): none
- `home.mock.quick_links.plan.title` at `src/features/home/data/homeData.js:46`, `src/features/home/pages/HomePageContent.jsx:1054`, `src/features/home/pages/HomePageContent.jsx:1302`, `src/features/home/pages/HomePageContent.jsx:306`, `src/features/home/pages/HomePageContent.jsx:330` fallback(s): none
- `home.mock.quick_links.service.description` at `src/features/home/data/homeData.js:54`, `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/pages/MapPageContent.jsx:147` fallback(s): none
- `home.mock.quick_links.service.title` at `src/features/home/data/homeData.js:53`, `src/features/home/pages/HomePageContent.jsx:1054`, `src/features/home/pages/HomePageContent.jsx:1302`, `src/features/home/pages/HomePageContent.jsx:306`, `src/features/home/pages/HomePageContent.jsx:330` fallback(s): none
- `home.mock.quick_links.vr.description` at `src/features/home/data/homeData.js:40`, `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/pages/MapPageContent.jsx:147` fallback(s): none
- `home.mock.quick_links.vr.title` at `src/features/home/data/homeData.js:39`, `src/features/home/pages/HomePageContent.jsx:1054`, `src/features/home/pages/HomePageContent.jsx:1302`, `src/features/home/pages/HomePageContent.jsx:306`, `src/features/home/pages/HomePageContent.jsx:330` fallback(s): none
- `home.mock.services.item_1.description` at `src/features/home/data/homeData.js:142`, `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/pages/MapPageContent.jsx:147` fallback(s): none
- `home.mock.services.item_1.name` at `src/features/home/data/homeData.js:137`, `src/features/home/pages/HomePageContent.jsx:319` fallback(s): none
- `home.mock.services.item_1.price` at `src/features/home/data/homeData.js:140` fallback(s): none
- `home.mock.services.item_1.type` at `src/features/home/data/homeData.js:138`, `src/features/vlog/pages/VlogPageContent.jsx:40` fallback(s): none
- `home.mock.services.item_2.description` at `src/features/home/data/homeData.js:152`, `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/pages/MapPageContent.jsx:147` fallback(s): none
- `home.mock.services.item_2.name` at `src/features/home/data/homeData.js:147`, `src/features/home/pages/HomePageContent.jsx:319` fallback(s): none
- `home.mock.services.item_2.price` at `src/features/home/data/homeData.js:150` fallback(s): none
- `home.mock.services.item_2.type` at `src/features/home/data/homeData.js:148`, `src/features/vlog/pages/VlogPageContent.jsx:40` fallback(s): none
- `home.mock.services.item_3.description` at `src/features/home/data/homeData.js:162`, `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/pages/MapPageContent.jsx:147` fallback(s): none
- `home.mock.services.item_3.name` at `src/features/home/data/homeData.js:157`, `src/features/home/pages/HomePageContent.jsx:319` fallback(s): none
- `home.mock.services.item_3.price` at `src/features/home/data/homeData.js:160` fallback(s): none
- `home.mock.services.item_3.type` at `src/features/home/data/homeData.js:158`, `src/features/vlog/pages/VlogPageContent.jsx:40` fallback(s): none
- `home.mock.vlog_stories.item_1.description` at `src/features/home/data/homeData.js:200`, `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/pages/MapPageContent.jsx:147` fallback(s): none
- `home.mock.vlog_stories.item_1.title` at `src/features/home/data/homeData.js:198`, `src/features/home/pages/HomePageContent.jsx:1054`, `src/features/home/pages/HomePageContent.jsx:1302`, `src/features/home/pages/HomePageContent.jsx:306`, `src/features/home/pages/HomePageContent.jsx:330` fallback(s): none
- `home.mock.vlog_stories.item_2.description` at `src/features/home/data/homeData.js:207`, `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/pages/MapPageContent.jsx:147` fallback(s): none
- `home.mock.vlog_stories.item_2.title` at `src/features/home/data/homeData.js:205`, `src/features/home/pages/HomePageContent.jsx:1054`, `src/features/home/pages/HomePageContent.jsx:1302`, `src/features/home/pages/HomePageContent.jsx:306`, `src/features/home/pages/HomePageContent.jsx:330` fallback(s): none
- `home.mock.vlog_stories.item_3.description` at `src/features/home/data/homeData.js:214`, `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/pages/MapPageContent.jsx:147` fallback(s): none
- `home.mock.vlog_stories.item_3.title` at `src/features/home/data/homeData.js:212`, `src/features/home/pages/HomePageContent.jsx:1054`, `src/features/home/pages/HomePageContent.jsx:1302`, `src/features/home/pages/HomePageContent.jsx:306`, `src/features/home/pages/HomePageContent.jsx:330` fallback(s): none
- `mapPage.capacityPanel.capacityCurrent` at `src/features/map/components/rightSidebar/CapacityPanel.jsx:345` fallback(s): none
- `mapPage.capacityPanel.capacityWithMax` at `src/features/map/components/rightSidebar/CapacityPanel.jsx:341` fallback(s): none
- `mapPage.capacityPanel.filteredCount` at `src/features/map/components/rightSidebar/CapacityPanel.jsx:329` fallback(s): none
- `mapPage.capacityPanel.status.low` at `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TourPanel.jsx:177`, `src/features/map/components/rightSidebar/TourPanel.jsx:225`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:52` fallback(s): none
- `mapPage.capacityPanel.status.moderate` at `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TourPanel.jsx:167`, `src/features/map/components/rightSidebar/TourPanel.jsx:225`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:34` fallback(s): none
- `mapPage.capacityPanel.status.unknown` at `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TourPanel.jsx:182`, `src/features/map/components/rightSidebar/TourPanel.jsx:225`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:59` fallback(s): none
- `mapPage.capacityPanel.trackedCount` at `src/features/map/components/rightSidebar/CapacityPanel.jsx:333` fallback(s): none
- `mapPage.mock.destinations.hoaLuOldTown.description` at `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/constant/mapPageMockData.js:41`, `src/features/map/pages/MapPageContent.jsx:147` fallback(s): none
- `mapPage.mock.destinations.tamCoc.description` at `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/constant/mapPageMockData.js:19`, `src/features/map/pages/MapPageContent.jsx:147` fallback(s): none
- `mapPage.mock.destinations.trangAn.description` at `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/constant/mapPageMockData.js:8`, `src/features/map/pages/MapPageContent.jsx:147` fallback(s): none
- `mapPage.mock.tourSuggestions.cultureFocus` at `src/features/map/constant/mapPageMockData.js:88`, `src/features/map/pages/MapPageContent.jsx:155`, `src/features/vlog/pages/VlogPageContent.jsx:52` fallback(s): none
- `mapPage.mock.tourSuggestions.softDay` at `src/features/map/constant/mapPageMockData.js:83`, `src/features/map/pages/MapPageContent.jsx:155`, `src/features/vlog/pages/VlogPageContent.jsx:52` fallback(s): none
- `mapPage.ocopPanel.fallbackProductName` at `src/features/map/components/OcopProductModal.jsx:45` fallback(s): none
- `mapPage.ocopPanel.ocopStars` at `src/features/map/components/OcopProductModal.jsx:115`, `src/features/map/components/OcopProductModal.jsx:75` fallback(s): none
- `mapPage.ocopPanel.oneCommuneOneProduct` at `src/features/map/components/OcopProductModal.jsx:117` fallback(s): none
- `mapPage.ocopPanel.productCertified` at `src/features/map/components/OcopProductModal.jsx:113` fallback(s): none
- `mapPage.ocopPanel.productModalDescription` at `src/features/map/components/OcopProductModal.jsx:46` fallback(s): none
- `mapPage.ocopPanel.viewDestination` at `src/features/map/components/OcopProductModal.jsx:128` fallback(s): none
- `mapPage.traffic.flowLevels.free_flow` at `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:18`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311` fallback(s): none
- `mapPage.traffic.flowLevels.heavy` at `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:20`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311` fallback(s): none
- `mapPage.traffic.flowLevels.moderate` at `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:19`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311` fallback(s): none
- `mapPage.traffic.flowLevels.severe` at `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:21`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311` fallback(s): none
- `mapPage.traffic.summary.accident` at `src/features/map/components/rightSidebar/TrafficPanel.jsx:125` fallback(s): none
- `mapPage.traffic.summary.avg_delay` at `src/features/map/components/rightSidebar/TrafficPanel.jsx:170` fallback(s): none
- `mapPage.traffic.summary.jam` at `src/features/map/components/rightSidebar/TrafficPanel.jsx:132` fallback(s): none
- `mapPage.traffic.summary.minutes` at `src/features/map/components/rightSidebar/TrafficPanel.jsx:173` fallback(s): none
- `mapPage.traffic.summary.total` at `src/features/map/components/rightSidebar/TrafficPanel.jsx:118` fallback(s): none
- `mapPage.traffic.summary.works` at `src/features/map/components/rightSidebar/TrafficPanel.jsx:139` fallback(s): none
- `newsPage.comments.admin_role` at `src/features/news/components/NewsCommentSection.jsx:160` fallback(s): none
- `satellite.legend.change.no_change` at `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`, `src/features/satellite/components/SatelliteLayerControl.jsx:92` fallback(s): none
- `satellite.legend.change.road_construction` at `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`, `src/features/satellite/components/SatelliteLayerControl.jsx:92` fallback(s): none
- `satellite.legend.change.vegetation_gain` at `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`, `src/features/satellite/components/SatelliteLayerControl.jsx:92` fallback(s): none
- `satellite.legend.change.vegetation_loss` at `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`, `src/features/satellite/components/SatelliteLayerControl.jsx:92` fallback(s): none
- `satellite.legend.change.vegetation_loss_road` at `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`, `src/features/satellite/components/SatelliteLayerControl.jsx:92` fallback(s): none
- `satellite.legend.classified.agriculture` at `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`, `src/features/satellite/components/SatelliteLayerControl.jsx:92` fallback(s): none
- `satellite.legend.classified.bare_land` at `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`, `src/features/satellite/components/SatelliteLayerControl.jsx:92` fallback(s): none
- `satellite.legend.classified.evergreen_forest` at `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`, `src/features/satellite/components/SatelliteLayerControl.jsx:92` fallback(s): none
- `satellite.legend.classified.open_forest` at `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`, `src/features/satellite/components/SatelliteLayerControl.jsx:92` fallback(s): none
- `satellite.legend.classified.shrub_grass` at `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`, `src/features/satellite/components/SatelliteLayerControl.jsx:92` fallback(s): none
- `satellite.legend.classified.urban` at `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`, `src/features/satellite/components/SatelliteLayerControl.jsx:92` fallback(s): none
- `satellite.legend.classified.water` at `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`, `src/features/satellite/components/SatelliteLayerControl.jsx:92` fallback(s): none
- `satellite.legend.heatmap.cool` at `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`, `src/features/satellite/components/SatelliteLayerControl.jsx:92` fallback(s): none
- `satellite.legend.heatmap.hot` at `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`, `src/features/satellite/components/SatelliteLayerControl.jsx:92` fallback(s): none
- `satellite.legend.heatmap.moderate` at `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`, `src/features/satellite/components/SatelliteLayerControl.jsx:92` fallback(s): none
- `satellite.legend.heatmap.very_cool` at `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`, `src/features/satellite/components/SatelliteLayerControl.jsx:92` fallback(s): none
- `satellite.legend.heatmap.very_hot` at `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`, `src/features/satellite/components/SatelliteLayerControl.jsx:92` fallback(s): none
- `satellite.legend.heatmap.warm` at `src/features/home/pages/HomePageContent.jsx:299`, `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`, `src/features/map/utils/capacityStatus.js:80`, `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`, `src/features/satellite/components/SatelliteLayerControl.jsx:92` fallback(s): none
- `tourPage.bookTrip` at `src/features/tours/pages/TourDetailPage.jsx:761`, `src/features/tours/pages/TourDetailPage.jsx:771` fallback(s): none
- `tourPage.capacityLoad` at `src/features/tours/pages/TourDetailPage.jsx:635`, `src/features/tours/pages/TourDetailPage.jsx:637`, `src/features/tours/pages/TourDetailPage.jsx:638` fallback(s): none
- `tourPage.dayHeading` at `src/features/tours/pages/TourDetailPage.jsx:589` fallback(s): none
- `tourPage.dayLabel` at `src/features/tours/pages/TourDetailPage.jsx:597` fallback(s): none
- `tourPage.defaultSchedule` at `src/features/tours/pages/TourDetailPage.jsx:529`, `src/features/tours/pages/TourDetailPage.jsx:596` fallback(s): none
- `tourPage.guestRange` at `src/features/tours/pages/TourDetailPage.jsx:547` fallback(s): none
- `tourPage.minutesLabel` at `src/features/tours/pages/TourDetailPage.jsx:627` fallback(s): none
- `tourPage.priceNote` at `src/features/tours/pages/TourDetailPage.jsx:748` fallback(s): none
- `tourPage.routeOverview` at `src/features/tours/pages/TourDetailPage.jsx:493` fallback(s): none
- `tourPage.stopLabel` at `src/features/tours/pages/TourDetailPage.jsx:622` fallback(s): none
- `tourPage.stops` at `src/features/tours/pages/TourDetailPage.jsx:533` fallback(s): none
- `tourPage.suitableForGroups` at `src/features/tours/pages/TourDetailPage.jsx:548` fallback(s): none
- `vlogPage.mock.places.bai_dinh` at `src/features/vlog/data/vlogData.js:36`, `src/features/vlog/pages/VlogPageContent.jsx:39` fallback(s): none
- `vlogPage.mock.places.ha_long` at `src/features/vlog/data/vlogData.js:51`, `src/features/vlog/pages/VlogPageContent.jsx:39` fallback(s): none
- `vlogPage.mock.places.ninh_binh` at `src/features/vlog/data/vlogData.js:67`, `src/features/vlog/data/vlogData.js:83`, `src/features/vlog/pages/VlogPageContent.jsx:39` fallback(s): none
- `vlogPage.mock.places.tam_coc` at `src/features/vlog/data/vlogData.js:20`, `src/features/vlog/pages/VlogPageContent.jsx:39` fallback(s): none
- `vlogPage.mock.places.trang_an` at `src/features/vlog/data/vlogData.js:5`, `src/features/vlog/pages/VlogPageContent.jsx:39` fallback(s): none
- `vlogPage.mock.posts.item_1.description` at `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/pages/MapPageContent.jsx:147`, `src/features/vlog/data/vlogData.js:13` fallback(s): none
- `vlogPage.mock.posts.item_1.title` at `src/features/home/pages/HomePageContent.jsx:1054`, `src/features/home/pages/HomePageContent.jsx:1302`, `src/features/home/pages/HomePageContent.jsx:306`, `src/features/home/pages/HomePageContent.jsx:330`, `src/features/home/pages/HomePageContent.jsx:367` fallback(s): none
- `vlogPage.mock.posts.item_2.description` at `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/pages/MapPageContent.jsx:147`, `src/features/vlog/data/vlogData.js:28` fallback(s): none
- `vlogPage.mock.posts.item_2.title` at `src/features/home/pages/HomePageContent.jsx:1054`, `src/features/home/pages/HomePageContent.jsx:1302`, `src/features/home/pages/HomePageContent.jsx:306`, `src/features/home/pages/HomePageContent.jsx:330`, `src/features/home/pages/HomePageContent.jsx:367` fallback(s): none
- `vlogPage.mock.posts.item_3.description` at `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/pages/MapPageContent.jsx:147`, `src/features/vlog/data/vlogData.js:44` fallback(s): none
- `vlogPage.mock.posts.item_3.title` at `src/features/home/pages/HomePageContent.jsx:1054`, `src/features/home/pages/HomePageContent.jsx:1302`, `src/features/home/pages/HomePageContent.jsx:306`, `src/features/home/pages/HomePageContent.jsx:330`, `src/features/home/pages/HomePageContent.jsx:367` fallback(s): none
- `vlogPage.mock.posts.item_4.description` at `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/pages/MapPageContent.jsx:147`, `src/features/vlog/data/vlogData.js:59` fallback(s): none
- `vlogPage.mock.posts.item_4.title` at `src/features/home/pages/HomePageContent.jsx:1054`, `src/features/home/pages/HomePageContent.jsx:1302`, `src/features/home/pages/HomePageContent.jsx:306`, `src/features/home/pages/HomePageContent.jsx:330`, `src/features/home/pages/HomePageContent.jsx:367` fallback(s): none
- `vlogPage.mock.posts.item_5.description` at `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/pages/MapPageContent.jsx:147`, `src/features/vlog/data/vlogData.js:75` fallback(s): none
- `vlogPage.mock.posts.item_5.title` at `src/features/home/pages/HomePageContent.jsx:1054`, `src/features/home/pages/HomePageContent.jsx:1302`, `src/features/home/pages/HomePageContent.jsx:306`, `src/features/home/pages/HomePageContent.jsx:330`, `src/features/home/pages/HomePageContent.jsx:367` fallback(s): none
- `vlogPage.mock.posts.item_6.description` at `src/features/home/pages/HomePageContent.jsx:307`, `src/features/home/pages/HomePageContent.jsx:322`, `src/features/home/pages/HomePageContent.jsx:331`, `src/features/map/pages/MapPageContent.jsx:147`, `src/features/vlog/data/vlogData.js:91` fallback(s): none
- `vlogPage.mock.posts.item_6.title` at `src/features/home/pages/HomePageContent.jsx:1054`, `src/features/home/pages/HomePageContent.jsx:1302`, `src/features/home/pages/HomePageContent.jsx:306`, `src/features/home/pages/HomePageContent.jsx:330`, `src/features/home/pages/HomePageContent.jsx:367` fallback(s): none
- `vlogPage.mock.time.days_ago` at `src/features/vlog/data/vlogData.js:60`, `src/features/vlog/data/vlogData.js:76`, `src/features/vlog/pages/VlogPageContent.jsx:43` fallback(s): none
- `vlogPage.mock.time.hours_ago` at `src/features/vlog/data/vlogData.js:29`, `src/features/vlog/pages/VlogPageContent.jsx:43` fallback(s): none
- `vlogPage.mock.time.today` at `src/features/vlog/data/vlogData.js:14`, `src/features/vlog/pages/VlogPageContent.jsx:43` fallback(s): none
- `vlogPage.mock.time.weeks_ago` at `src/features/vlog/data/vlogData.js:92`, `src/features/vlog/pages/VlogPageContent.jsx:43` fallback(s): none
- `vlogPage.mock.time.yesterday` at `src/features/vlog/data/vlogData.js:45`, `src/features/vlog/pages/VlogPageContent.jsx:43` fallback(s): none
- `vlogPage.mock.trending.item_1.text` at `src/features/map/pages/MapPageContent.jsx:155`, `src/features/vlog/data/vlogData.js:102`, `src/features/vlog/pages/VlogPageContent.jsx:52` fallback(s): none
- `vlogPage.mock.trending.item_1.title` at `src/features/home/pages/HomePageContent.jsx:1054`, `src/features/home/pages/HomePageContent.jsx:1302`, `src/features/home/pages/HomePageContent.jsx:306`, `src/features/home/pages/HomePageContent.jsx:330`, `src/features/home/pages/HomePageContent.jsx:367` fallback(s): none
- `vlogPage.mock.trending.item_2.text` at `src/features/map/pages/MapPageContent.jsx:155`, `src/features/vlog/data/vlogData.js:109`, `src/features/vlog/pages/VlogPageContent.jsx:52` fallback(s): none
- `vlogPage.mock.trending.item_2.title` at `src/features/home/pages/HomePageContent.jsx:1054`, `src/features/home/pages/HomePageContent.jsx:1302`, `src/features/home/pages/HomePageContent.jsx:306`, `src/features/home/pages/HomePageContent.jsx:330`, `src/features/home/pages/HomePageContent.jsx:367` fallback(s): none
- `vlogPage.mock.trending.item_3.text` at `src/features/map/pages/MapPageContent.jsx:155`, `src/features/vlog/data/vlogData.js:116`, `src/features/vlog/pages/VlogPageContent.jsx:52` fallback(s): none
- `vlogPage.mock.trending.item_3.title` at `src/features/home/pages/HomePageContent.jsx:1054`, `src/features/home/pages/HomePageContent.jsx:1302`, `src/features/home/pages/HomePageContent.jsx:306`, `src/features/home/pages/HomePageContent.jsx:330`, `src/features/home/pages/HomePageContent.jsx:367` fallback(s): none
- `vlogPage.topics.checkin` at `src/features/vlog/data/vlogData.js:53`, `src/features/vlog/pages/VlogPageContent.jsx:41` fallback(s): none
- `vlogPage.topics.nature` at `src/features/vlog/data/vlogData.js:7`, `src/features/vlog/pages/VlogPageContent.jsx:41` fallback(s): none

```json
{
  "common.culture": "TODO_REVIEW",
  "common.errors.carousel_context": "TODO_REVIEW",
  "common.errors.file_upload_item_context": "TODO_REVIEW",
  "common.errors.file_upload_root_context": "TODO_REVIEW",
  "common.errors.http_status": "TODO_REVIEW",
  "common.errors.occurred": "TODO_REVIEW",
  "common.errors.session_expired": "TODO_REVIEW",
  "common.hours_ago": "TODO_REVIEW",
  "common.infrastructure": "TODO_REVIEW",
  "common.just_updated": "TODO_REVIEW",
  "common.minutes_ago": "TODO_REVIEW",
  "common.natural": "TODO_REVIEW",
  "common.new": "TODO_REVIEW",
  "common.open_in_new_tab": "TODO_REVIEW",
  "home.mock.common.kim_son": "TODO_REVIEW",
  "home.mock.common.ninh_binh": "TODO_REVIEW",
  "home.mock.featured_destinations.bai_dinh.description": "TODO_REVIEW",
  "home.mock.featured_destinations.bai_dinh.name": "TODO_REVIEW",
  "home.mock.featured_destinations.bai_dinh.subtitle": "TODO_REVIEW",
  "home.mock.featured_destinations.hoa_lu.description": "TODO_REVIEW",
  "home.mock.featured_destinations.hoa_lu.name": "TODO_REVIEW",
  "home.mock.featured_destinations.hoa_lu.subtitle": "TODO_REVIEW",
  "home.mock.featured_destinations.trang_an.description": "TODO_REVIEW",
  "home.mock.featured_destinations.trang_an.name": "TODO_REVIEW",
  "home.mock.featured_destinations.trang_an.subtitle": "TODO_REVIEW",
  "home.mock.food_bullets.item_1.label": "TODO_REVIEW",
  "home.mock.food_bullets.item_2.label": "TODO_REVIEW",
  "home.mock.food_bullets.item_2.value": "TODO_REVIEW",
  "home.mock.food_bullets.item_3.label": "TODO_REVIEW",
  "home.mock.hero_events.hoa_lu.time": "TODO_REVIEW",
  "home.mock.hero_events.hoa_lu.title": "TODO_REVIEW",
  "home.mock.hero_events.light_show.time": "TODO_REVIEW",
  "home.mock.hero_events.light_show.title": "TODO_REVIEW",
  "home.mock.hero_events.tourism_week.time": "TODO_REVIEW",
  "home.mock.hero_events.tourism_week.title": "TODO_REVIEW",
  "home.mock.hero_stats.average_load": "TODO_REVIEW",
  "home.mock.hero_stats.events_offers": "TODO_REVIEW",
  "home.mock.hero_stats.featured": "TODO_REVIEW",
  "home.mock.hero_stats.vr360": "TODO_REVIEW",
  "home.mock.itinerary.item_1": "TODO_REVIEW",
  "home.mock.itinerary.item_2": "TODO_REVIEW",
  "home.mock.itinerary.item_3": "TODO_REVIEW",
  "home.mock.itinerary.item_4": "TODO_REVIEW",
  "home.mock.itinerary.item_5": "TODO_REVIEW",
  "home.mock.news_items.item_1.excerpt": "TODO_REVIEW",
  "home.mock.news_items.item_1.title": "TODO_REVIEW",
  "home.mock.news_items.item_2.excerpt": "TODO_REVIEW",
  "home.mock.news_items.item_2.title": "TODO_REVIEW",
  "home.mock.news_items.item_3.excerpt": "TODO_REVIEW",
  "home.mock.news_items.item_3.title": "TODO_REVIEW",
  "home.mock.ocop_products.item_1.description": "TODO_REVIEW",
  "home.mock.ocop_products.item_1.name": "TODO_REVIEW",
  "home.mock.ocop_products.item_1.price": "TODO_REVIEW",
  "home.mock.ocop_products.item_1.stars": "TODO_REVIEW",
  "home.mock.ocop_products.item_2.description": "TODO_REVIEW",
  "home.mock.ocop_products.item_2.name": "TODO_REVIEW",
  "home.mock.ocop_products.item_2.price": "TODO_REVIEW",
  "home.mock.ocop_products.item_2.stars": "TODO_REVIEW",
  "home.mock.ocop_products.item_3.description": "TODO_REVIEW",
  "home.mock.ocop_products.item_3.name": "TODO_REVIEW",
  "home.mock.ocop_products.item_3.price": "TODO_REVIEW",
  "home.mock.ocop_products.item_3.stars": "TODO_REVIEW",
  "home.mock.promo_banner.cta": "TODO_REVIEW",
  "home.mock.promo_banner.description": "TODO_REVIEW",
  "home.mock.promo_banner.title": "TODO_REVIEW",
  "home.mock.quick_links.map.description": "TODO_REVIEW",
  "home.mock.quick_links.map.title": "TODO_REVIEW",
  "home.mock.quick_links.ocop.description": "TODO_REVIEW",
  "home.mock.quick_links.ocop.title": "TODO_REVIEW",
  "home.mock.quick_links.plan.description": "TODO_REVIEW",
  "home.mock.quick_links.plan.title": "TODO_REVIEW",
  "home.mock.quick_links.service.description": "TODO_REVIEW",
  "home.mock.quick_links.service.title": "TODO_REVIEW",
  "home.mock.quick_links.vr.description": "TODO_REVIEW",
  "home.mock.quick_links.vr.title": "TODO_REVIEW",
  "home.mock.services.item_1.description": "TODO_REVIEW",
  "home.mock.services.item_1.name": "TODO_REVIEW",
  "home.mock.services.item_1.price": "TODO_REVIEW",
  "home.mock.services.item_1.type": "TODO_REVIEW",
  "home.mock.services.item_2.description": "TODO_REVIEW",
  "home.mock.services.item_2.name": "TODO_REVIEW",
  "home.mock.services.item_2.price": "TODO_REVIEW",
  "home.mock.services.item_2.type": "TODO_REVIEW",
  "home.mock.services.item_3.description": "TODO_REVIEW",
  "home.mock.services.item_3.name": "TODO_REVIEW",
  "home.mock.services.item_3.price": "TODO_REVIEW",
  "home.mock.services.item_3.type": "TODO_REVIEW",
  "home.mock.vlog_stories.item_1.description": "TODO_REVIEW",
  "home.mock.vlog_stories.item_1.title": "TODO_REVIEW",
  "home.mock.vlog_stories.item_2.description": "TODO_REVIEW",
  "home.mock.vlog_stories.item_2.title": "TODO_REVIEW",
  "home.mock.vlog_stories.item_3.description": "TODO_REVIEW",
  "home.mock.vlog_stories.item_3.title": "TODO_REVIEW",
  "mapPage.capacityPanel.capacityCurrent": "TODO_REVIEW",
  "mapPage.capacityPanel.capacityWithMax": "TODO_REVIEW",
  "mapPage.capacityPanel.filteredCount": "TODO_REVIEW",
  "mapPage.capacityPanel.status.low": "TODO_REVIEW",
  "mapPage.capacityPanel.status.moderate": "TODO_REVIEW",
  "mapPage.capacityPanel.status.unknown": "TODO_REVIEW",
  "mapPage.capacityPanel.trackedCount": "TODO_REVIEW",
  "mapPage.mock.destinations.hoaLuOldTown.description": "TODO_REVIEW",
  "mapPage.mock.destinations.tamCoc.description": "TODO_REVIEW",
  "mapPage.mock.destinations.trangAn.description": "TODO_REVIEW",
  "mapPage.mock.tourSuggestions.cultureFocus": "TODO_REVIEW",
  "mapPage.mock.tourSuggestions.softDay": "TODO_REVIEW",
  "mapPage.ocopPanel.fallbackProductName": "TODO_REVIEW",
  "mapPage.ocopPanel.ocopStars": "TODO_REVIEW",
  "mapPage.ocopPanel.oneCommuneOneProduct": "TODO_REVIEW",
  "mapPage.ocopPanel.productCertified": "TODO_REVIEW",
  "mapPage.ocopPanel.productModalDescription": "TODO_REVIEW",
  "mapPage.ocopPanel.viewDestination": "TODO_REVIEW",
  "mapPage.traffic.flowLevels.free_flow": "TODO_REVIEW",
  "mapPage.traffic.flowLevels.heavy": "TODO_REVIEW",
  "mapPage.traffic.flowLevels.moderate": "TODO_REVIEW",
  "mapPage.traffic.flowLevels.severe": "TODO_REVIEW",
  "mapPage.traffic.summary.accident": "TODO_REVIEW",
  "mapPage.traffic.summary.avg_delay": "TODO_REVIEW",
  "mapPage.traffic.summary.jam": "TODO_REVIEW",
  "mapPage.traffic.summary.minutes": "TODO_REVIEW",
  "mapPage.traffic.summary.total": "TODO_REVIEW",
  "mapPage.traffic.summary.works": "TODO_REVIEW",
  "newsPage.comments.admin_role": "TODO_REVIEW",
  "satellite.legend.change.no_change": "TODO_REVIEW",
  "satellite.legend.change.road_construction": "TODO_REVIEW",
  "satellite.legend.change.vegetation_gain": "TODO_REVIEW",
  "satellite.legend.change.vegetation_loss": "TODO_REVIEW",
  "satellite.legend.change.vegetation_loss_road": "TODO_REVIEW",
  "satellite.legend.classified.agriculture": "TODO_REVIEW",
  "satellite.legend.classified.bare_land": "TODO_REVIEW",
  "satellite.legend.classified.evergreen_forest": "TODO_REVIEW",
  "satellite.legend.classified.open_forest": "TODO_REVIEW",
  "satellite.legend.classified.shrub_grass": "TODO_REVIEW",
  "satellite.legend.classified.urban": "TODO_REVIEW",
  "satellite.legend.classified.water": "TODO_REVIEW",
  "satellite.legend.heatmap.cool": "TODO_REVIEW",
  "satellite.legend.heatmap.hot": "TODO_REVIEW",
  "satellite.legend.heatmap.moderate": "TODO_REVIEW",
  "satellite.legend.heatmap.very_cool": "TODO_REVIEW",
  "satellite.legend.heatmap.very_hot": "TODO_REVIEW",
  "satellite.legend.heatmap.warm": "TODO_REVIEW",
  "tourPage.bookTrip": "TODO_REVIEW",
  "tourPage.capacityLoad": "TODO_REVIEW",
  "tourPage.dayHeading": "TODO_REVIEW",
  "tourPage.dayLabel": "TODO_REVIEW",
  "tourPage.defaultSchedule": "TODO_REVIEW",
  "tourPage.guestRange": "TODO_REVIEW",
  "tourPage.minutesLabel": "TODO_REVIEW",
  "tourPage.priceNote": "TODO_REVIEW",
  "tourPage.routeOverview": "TODO_REVIEW",
  "tourPage.stopLabel": "TODO_REVIEW",
  "tourPage.stops": "TODO_REVIEW",
  "tourPage.suitableForGroups": "TODO_REVIEW",
  "vlogPage.mock.places.bai_dinh": "TODO_REVIEW",
  "vlogPage.mock.places.ha_long": "TODO_REVIEW",
  "vlogPage.mock.places.ninh_binh": "TODO_REVIEW",
  "vlogPage.mock.places.tam_coc": "TODO_REVIEW",
  "vlogPage.mock.places.trang_an": "TODO_REVIEW",
  "vlogPage.mock.posts.item_1.description": "TODO_REVIEW",
  "vlogPage.mock.posts.item_1.title": "TODO_REVIEW",
  "vlogPage.mock.posts.item_2.description": "TODO_REVIEW",
  "vlogPage.mock.posts.item_2.title": "TODO_REVIEW",
  "vlogPage.mock.posts.item_3.description": "TODO_REVIEW",
  "vlogPage.mock.posts.item_3.title": "TODO_REVIEW",
  "vlogPage.mock.posts.item_4.description": "TODO_REVIEW",
  "vlogPage.mock.posts.item_4.title": "TODO_REVIEW",
  "vlogPage.mock.posts.item_5.description": "TODO_REVIEW",
  "vlogPage.mock.posts.item_5.title": "TODO_REVIEW",
  "vlogPage.mock.posts.item_6.description": "TODO_REVIEW",
  "vlogPage.mock.posts.item_6.title": "TODO_REVIEW",
  "vlogPage.mock.time.days_ago": "TODO_REVIEW",
  "vlogPage.mock.time.hours_ago": "TODO_REVIEW",
  "vlogPage.mock.time.today": "TODO_REVIEW",
  "vlogPage.mock.time.weeks_ago": "TODO_REVIEW",
  "vlogPage.mock.time.yesterday": "TODO_REVIEW",
  "vlogPage.mock.trending.item_1.text": "TODO_REVIEW",
  "vlogPage.mock.trending.item_1.title": "TODO_REVIEW",
  "vlogPage.mock.trending.item_2.text": "TODO_REVIEW",
  "vlogPage.mock.trending.item_2.title": "TODO_REVIEW",
  "vlogPage.mock.trending.item_3.text": "TODO_REVIEW",
  "vlogPage.mock.trending.item_3.title": "TODO_REVIEW",
  "vlogPage.topics.checkin": "TODO_REVIEW",
  "vlogPage.topics.nature": "TODO_REVIEW"
}
```

## Dynamic Usages for Manual Review

- None

## Unused Keys by Static Scan

- `common.no`
- `common.search_no_results`
- `common.search_placeholder`
- `common.search_results`
- `common.search_view_all`
- `common.see_all`
- `common.toggle_theme`
- `common.tourism_point`
- `common.yes`
- `feedbackPage.fab_tooltip_unauth`
- `festivalDetail.recurring_label`
- `festivalDetail.recurring_no`
- `festivalPage.filters.all_types`
- `festivalPage.toolbar.count`
- `headerAside.destination`
- `headerAside.direction`
- `headerAside.layerData`
- `home.ad_carousel.next`
- `home.ad_carousel.prev`
- `home.ad_carousel.subtitle`
- `home.ad_carousel.title`
- `home.categories.items`
- `home.categories.subtitle`
- `home.categories.title`
- `home.featured_destinations.description`
- `home.featured_destinations.see_all`
- `home.festivals_card.days_until`
- `home.festivals_card.empty`
- `home.festivals_card.label`
- `home.festivals_card.recurring`
- `home.festivals_card.today`
- `home.food_section.description`
- `home.food_section.label`
- `home.food_section.title`
- `home.footer_section.contact`
- `home.footer_section.follow`
- `home.footer_section.quick_links`
- `home.hero.badge`
- `home.hero.chatbot_cta`
- `home.hero.chatbot_desc`
- `home.hero.chatbot_title`
- `home.hero.cta_discover`
- `home.hero.cta_gis`
- `home.hero.cta_map`
- `home.hero.cta_points`
- `home.hero.cta_vr`
- `home.hero.intro`
- `home.hero.map_cta`
- `home.hero.map_desc`
- `home.hero.map_title`
- `home.hero.scroll_hint`
- `home.hero.subtitle`
- `home.hero.vlog_cta`
- `home.hero.vlog_desc`
- `home.hero.vlog_title`
- `home.itinerary_section.day_label`
- `home.itinerary_section.label`
- `home.news.hot`
- `home.news.read_more`
- `home.news.see_all`
- `home.news.subtitle`
- `home.news.title`
- `home.news_section.hot`
- `home.news_section.read_more`
- `home.news_section.unknown_author`
- `home.ocop_section.description`
- `home.points.subtitle`
- `home.points.title`
- `home.quick_access.description`
- `home.search.label`
- `home.suggestions_card.detail_cta`
- `home.suggestions_card.label`
- `home.suggestions_card.title`
- `home.tour_section.default_desc`
- `home.tour_section.default_title`
- `home.tour_section.from_price`
- `home.tour_section.per_person`
- `home.tour_section.reviews`
- `home.tour_section.schedule`
- `home.tour_section.see_all`
- `home.tour_section.title`
- `home.tours.subtitle`
- `home.tours.title`
- `home.vlog_section.label`
- `home.voucher.cta`
- `home.voucher.desc`
- `home.voucher.partners`
- `home.voucher.title`
- `home.vouchers_section.cta`
- `home.vouchers_section.empty`
- `home.vouchers_section.partners`
- `home.weather_card.label`
- `home.weather_card.view_map`
- `mapPage.capacityPanel.all`
- `mapPage.capacityPanel.peopleOnly`
- `mapPage.capacityPanel.peopleWithCapacity`
- `mapPage.chatbot.description`
- `mapPage.chatbot.quickPrompts.dayTour`
- `mapPage.chatbot.quickPrompts.lessCrowded`
- `mapPage.chatbot.quickPrompts.weatherToday`
- `mapPage.chatbot.sampleMessages.botSuggestion`
- `mapPage.chatbot.sampleMessages.userPreference`
- `mapPage.chatbot.sampleMessages.welcome`
- `mapPage.chatbot.title`
- `mapPage.destination.address`
- `mapPage.destination.category`
- `mapPage.destination.clear`
- `mapPage.destination.elevation`
- `mapPage.destination.email`
- `mapPage.destination.entranceFee`
- `mapPage.destination.facilities`
- `mapPage.destination.featured`
- `mapPage.destination.flyTo`
- `mapPage.destination.free`
- `mapPage.destination.openingHours`
- `mapPage.destination.phone`
- `mapPage.destination.photos`
- `mapPage.destination.rating`
- `mapPage.destination.reviews`
- `mapPage.destination.subcategory`
- `mapPage.destination.viewWebsite`
- `mapPage.destination.visits`
- `mapPage.destination.website`
- `mapPage.direction.searching`
- `mapPage.direction.swap`
- `mapPage.eventPanel.reset`
- `mapPage.eventPanel.upcoming`
- `mapPage.layout.closeSubSidebar`
- `mapPage.layout.collapseSidebar`
- `mapPage.layout.expandSidebar`
- `mapPage.layout.floatLegend`
- `mapPage.layout.floatTool`
- `mapPage.layout.legendCurrent`
- `mapPage.layout.legendPrimary`
- `mapPage.layout.legendSecondary`
- `mapPage.layout.mapArea`
- `mapPage.layout.openSubSidebar`
- `mapPage.layout.subSidebar`
- `mapPage.layout.toolLayer`
- `mapPage.layout.toolZoomIn`
- `mapPage.layout.toolZoomOut`
- `mapPage.layout.weatherAqi`
- `mapPage.layout.weatherHumidity`
- `mapPage.layout.weatherNotConfigured`
- `mapPage.layout.weatherTemperature`
- `mapPage.layout.weatherWind`
- `mapPage.ocopPanel.radiusLabel`
- `mapPage.spotModal.currentVisitors`
- `mapPage.spotModal.maxCapacity`
- `mapPage.spotModal.noDescription`
- `mapPage.toolbar.baseMap`
- `mapPage.toolbar.filter`
- `mapPage.toolbar.geoFailed`
- `mapPage.toolbar.geoUnsupported`
- `mapPage.toolbar.mapNotReady`
- `mapPage.toolbar.routePrototype`
- `mapPage.toolbar.vrPrototype`
- `mapPage.tourPanel.noStopResults`
- `mapPage.tourPanel.openRoute`
- `mapPage.tourPanel.stopSearchPlaceholder`
- `mapPage.tourSuggestModal.openButton`
- `mapPage.tourSuggestModal.title`
- `mapPage.traffic.incidentCount`
- `newsPage.actions.loading`
- `newsPage.detail.cta_map`
- `newsPage.detail.sidebar_desc`
- `newsPage.detail.sidebar_title`
- `newsPage.filters.description`
- `newsPage.filters.featured`
- `newsPage.filters.title`
- `newsPage.list.description`
- `ocopDetail.labels.category`
- `ocopDetail.labels.year`
- `ocopPage.card.certified`
- `ocopPage.stats.page`
- `ocopPage.toolbar.count`
- `satellite.actions.close_panel`
- `satellite.actions.open_panel`
- `satellite.legend.period_current`
- `satellite.legend.period_reference`
- `satellite.legend.title`
- `satellite.map.boundary_layer`
- `satellite.subtitle`
- `satellite.success.loaded`
- `satellite.tabs.compare`
- `satellite.tabs.single`
- `satellite.title`
- `tourPage.budget`
- `tourPage.by`
- `tourPage.card.from_price`
- `tourPage.card.max_guests`
- `tourPage.card.no_description`
- `tourPage.card.rating_count`
- `tourPage.card.view_detail`
- `tourPage.createdAt`
- `tourPage.description`
- `tourPage.duration_options.1day`
- `tourPage.duration_options.2days`
- `tourPage.duration_options.3_4days`
- `tourPage.duration_options.5plus`
- `tourPage.duration_options.all`
- `tourPage.errorLoading`
- `tourPage.featuredSubtitle`
- `tourPage.featuredToday`
- `tourPage.filter`
- `tourPage.filterOpen`
- `tourPage.filters.nonFeatured`
- `tourPage.filters.price`
- `tourPage.filters.provinceCode`
- `tourPage.filters.provincePlaceholder`
- `tourPage.filters.search_btn`
- `tourPage.filters.search_placeholder`
- `tourPage.filters.status`
- `tourPage.gridView`
- `tourPage.listView`
- `tourPage.loading`
- `tourPage.noRating`
- `tourPage.noTours`
- `tourPage.perPerson`
- `tourPage.per_page`
- `tourPage.price_options.1000_2000`
- `tourPage.price_options.500_1000`
- `tourPage.price_options.above2000`
- `tourPage.price_options.all`
- `tourPage.price_options.under500`
- `tourPage.save`
- `tourPage.showing`
- `tourPage.sort_options.default`
- `tourPage.sort_options.newest`
- `tourPage.starCount`
- `tourPage.startLocationPlaceholder`
- `tourPage.states.empty_desc`
- `tourPage.status.draft`
- `tourPage.status.published`
- `tourPage.toursLabel`
- `tourPage.viewTour`
- `tourism.accessibility`
- `tourism.add_schedule`
- `tourism.average_rating`
- `tourism.cleanliness`
- `tourism.description`
- `tourism.hours`
- `tourism.leave_review`
- `tourism.minutes`
- `tourism.open_map`
- `tourism.recommend`
- `tourism.season`
- `tourism.service`
- `tourism.share_experience`
- `tourism.total_reviews`
- `tourism.value`
- `tourism.visit_duration`
- `tourism.visited`
- `tourism.write_review`
- `tourismPointPage.47_points`
- `tourismPointPage.all_subcategories`
- `tourismPointPage.featured`
- `tourismPointPage.filter`
- `tourismPointPage.gridView`
- `tourismPointPage.listView`
- `tourismPointPage.of`
- `tourismPointPage.quick_map`
- `tourismPointPage.refresh`
- `tourismPointPage.showing`
- `tourismPointPage.sort_by`
- `tourismPointPage.subtitle`
- `tourismPointPage.tip_desc`
- `tourismPointPage.tip_title`
- `tourismPointPage.updated_today`
- `vlogPage.composer.topic_label`
- `vlogPage.composer.type_label`
- `vlogPage.post.likes`
- `vlogPage.post.views`
- `vlogPage.topics.tips`
- `vr360.features.interactive`
- `vr360.features.interactive_desc`
- `vr360.features.multilang`
- `vr360.features.multilang_desc`
- `vr360.features.webgis`
- `vr360.features.webgis_desc`
- `vr360.hotspots`
- `vr360.minimap_placeholder`
- `vr360.minimap_title`
- `vr360.mobile_vr_split`
- `vr360.mobile_vr_split_off`
- `vr360.mobile_vr_split_on`
- `vr360.narration`
- `vr360.pick_spot`
- `vr360.pick_spot_placeholder`
- `vr360.play_narration`
- `vr360.scene_badge`
- `vr360.subtitle`
- `vr360.title`
