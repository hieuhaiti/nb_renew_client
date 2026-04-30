const HOME_DATA_BY_LANG = {
  vi: {
    HERO_STATS: [
      { label: 'Ði?m n?i b?t', value: '03' },
      { label: 'T?i trung bình', value: '70%' },
      { label: 'S? ki?n & uu dãi', value: '12+' },
      { label: 'VR360', value: 'S?n sàng' },
    ],
    HERO_EVENTS: [
      { title: 'L? h?i Hoa Lu', time: 'Tháng 4' },
      { title: 'Tu?n du l?ch Ninh Bình 2026', time: 'Ðang di?n ra' },
      { title: 'Trình di?n ánh sáng dêm di s?n', time: 'Cu?i tu?n' },
    ],
    PROMO_BANNER: {
      title: 'Uu dãi mùa hè 2026',
      description:
        'Voucher cho tour, khách s?n và tr?i nghi?m ?m th?c dang du?c c?p nh?t trên b?n d?.',
      cta: 'Xem uu dãi g?n b?n',
      path: '/map',
    },
    QUICK_LINKS: [
      {
        id: 'map',
        icon: 'map',
        title: 'B?n d? GIS',
        description:
          'Xem di?m du l?ch, l?p d?ch v?, th?i ti?t, t?i tr?ng và chatbot tuong tác b?n d?.',
        path: '/map',
      },
      {
        id: 'vr',
        icon: 'vr',
        title: 'VR360',
        description: 'Tham quan ?nh và video 360, hotspot, audio thuy?t minh và b?n d? toàn c?nh.',
        path: '/vr360',
      },
      {
        id: 'plan',
        icon: 'plan',
        title: 'L?ch trình',
        description: 'T?o k? ho?ch chuy?n di, luu nhi?u hành trình và chia s? qua liên k?t.',
        path: '/tour',
      },
      {
        id: 'service',
        icon: 'service',
        title: 'D?ch v?',
        description: 'Khách s?n, nhà hàng, v?n chuy?n, voucher khuy?n mãi và dashboard doanh nghi?p.',
        path: '/tourism-point',
      },
      {
        id: 'ocop',
        icon: 'ocop',
        title: 'OCOP',
        description: 'S?n ph?m d?a phuong, x?p h?ng sao, ngu?n g?c và k?t n?i d?t hàng tr?c tuy?n.',
        path: '/ocop',
      },
    ],
    FEATURED_DESTINATIONS: [
      {
        id: 'trang-an',
        name: 'Qu?n th? danh th?ng Tràng An',
        province: 'Ninh Bình',
        subtitle: 'Di s?n thiên nhiên - van hóa',
        rating: 4.9,
        description:
          'Khu du l?ch sinh thái v?i h? th?ng núi dá vôi, hang d?ng và tuy?n dò xuyên th?y n?i ti?ng.',
        image:
          'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'hoa-lu',
        name: 'C? dô Hoa Lu',
        province: 'Ninh Bình',
        subtitle: 'Di tích l?ch s?',
        rating: 4.7,
        description: 'Qu?n th? di tích l?ch s? g?n v?i tri?u Ðinh - Ti?n Lê cùng ki?n trúc c? d?c s?c.',
        image:
          'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'bai-dinh',
        name: 'Chùa Bái Ðính',
        province: 'Ninh Bình',
        subtitle: 'Tâm linh',
        rating: 4.8,
        description: 'Qu?n th? chùa l?n v?i hành lang La Hán, phù h?p tham quan k?t h?p l? h?i.',
        image:
          'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    NEWS_ITEMS: [
      {
        title: 'Tu?n du l?ch Ninh Bình 2026 khai m?c v?i chu?i tr?i nghi?m dêm',
        date: '18/04/2026',
        excerpt:
          'S? ki?n n?i b?t v?i tour dêm di s?n, trình di?n ánh sáng và s?n ph?m OCOP d?a phuong.',
      },
      {
        title: 'C?nh báo n?ng nóng c?c b? t?i m?t s? di?m du l?ch tâm linh',
        date: '17/04/2026',
        excerpt: 'H? th?ng khuy?n ngh? khách ch? d?ng th?i gian tham quan và b? sung nu?c.',
      },
      {
        title: 'Doanh nghi?p du l?ch m? chi?n d?ch voucher liên vùng mùa hè',
        date: '15/04/2026',
        excerpt: 'Nhi?u don v? luu trú, an u?ng và tour n?i t?nh d?ng lo?t phát hành voucher.',
      },
    ],
    ITINERARY_ITEMS: [
      { time: '07:30', activity: 'Kh?i hành t? trung tâm thành ph?' },
      { time: '08:15', activity: 'Check-in Tràng An' },
      { time: '11:30', activity: 'An trua d?c s?n d?a phuong' },
      { time: '14:00', activity: 'C? dô Hoa Lu / Bái Ðính' },
      { time: '17:30', activity: 'M? VR360 d? xem di?m cho ngày mai' },
    ],
    FOOD_TAGS: ['Dê núi Ninh Bình', 'Com cháy', '?c núi', '?m th?c d?a phuong'],
    FOOD_BULLETS: [
      { label: 'Nhà hàng Dê Núi C? Ðô', value: '? 4.7' },
      { label: 'Ph? ?m th?c ven sông', value: 'M? t?i' },
      { label: 'Voucher ?m th?c liên k?t', value: 'DECO20' },
    ],
    SERVICES: [
      {
        name: 'Ninh Bình Heritage Hotel',
        type: 'Khách s?n',
        rating: 4.6,
        price: '950.000d/dêm',
        voucher: 'NBSTAY10',
        description: 'Luu trú g?n trung tâm, thu?n ti?n k?t n?i Tràng An và Hoa Lu.',
        image:
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Nhà hàng Dê Núi C? Ðô',
        type: 'Nhà hàng',
        rating: 4.7,
        price: '120.000d - 350.000d',
        voucher: 'DECO20',
        description: '?m th?c d?c s?n d?a phuong, phù h?p tour gia dình và doàn khách.',
        image:
          'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Eco Boat Tràng An',
        type: 'V?n chuy?n',
        rating: 4.5,
        price: 'Theo tuy?n',
        voucher: 'BOAT15',
        description: 'D?ch v? thuy?n sinh thái và h? tr? d?t ch? tr?c tuy?n.',
        image:
          'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    OCOP_PRODUCTS: [
      {
        name: 'Trà sen d?t ng?p nu?c',
        stars: '4 sao',
        origin: 'Ninh Bình',
        price: '180.000d',
        description: 'S?n ph?m d?a phuong g?n v?i câu chuy?n vùng sinh thái d?c trung.',
        image:
          'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'M?t ong r?ng ng?p m?n',
        stars: '4 sao',
        origin: 'Ninh Bình',
        price: '240.000d',
        description: 'Ngu?n g?c rõ ràng, phù h?p làm quà t?ng du l?ch.',
        image:
          'https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'G?m th? công di s?n',
        stars: '5 sao',
        origin: 'Qu?ng Ninh',
        price: '320.000d',
        description: 'S?n ph?m th? công ph?c v? trung bày và quà luu ni?m.',
        image:
          'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    VLOG_STORIES: [
      {
        title: 'M?t ngày khám phá Tràng An t? sáng d?n dêm',
        author: 'Lan Anh',
        description:
          'G?i ý l?ch trình cân b?ng gi?a tr?i nghi?m, ch?p ?nh và thu?ng th?c ?m th?c d?a phuong.',
        image:
          'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Kinh nghi?m tránh dông khi di Bái Ðính mùa l? h?i',
        author: 'Minh Khoa',
        description:
          'M?o ch?n khung gi?, tuy?n tham quan và di?m thay th? g?n dó khi lu?ng khách tang cao.',
        image:
          'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'VR360 có giúp ch?n di?m d?n chính xác hon không?',
        author: 'Ng?c Mai',
        description:
          'Tr?i nghi?m xem tru?c không gian th?c t? và so sánh tru?c khi lên k? ho?ch chuy?n di.',
        image:
          'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=80',
      },
    ],
  },
  en: {
    HERO_STATS: [
      { label: 'Highlights', value: '03' },
      { label: 'Average load', value: '70%' },
      { label: 'Events & offers', value: '12+' },
      { label: 'VR360', value: 'Ready' },
    ],
    HERO_EVENTS: [
      { title: 'Hoa Lu Festival', time: 'April' },
      { title: 'Ninh Binh Tourism Week 2026', time: 'Ongoing' },
      { title: 'Night heritage light show', time: 'Weekend' },
    ],
    PROMO_BANNER: {
      title: 'Summer Deals 2026',
      description: 'Vouchers for tours, hotels, and food experiences are now available on the map.',
      cta: 'View nearby offers',
      path: '/map',
    },
    QUICK_LINKS: [
      {
        id: 'map',
        icon: 'map',
        title: 'GIS Map',
        description: 'Explore attractions, services, weather, crowd load, and map chatbot support.',
        path: '/map',
      },
      {
        id: 'vr',
        icon: 'vr',
        title: 'VR360',
        description: 'Preview 360 photos/videos, hotspots, voice guide, and panoramic maps.',
        path: '/vr360',
      },
      {
        id: 'plan',
        icon: 'plan',
        title: 'Itinerary',
        description: 'Create trip plans, save multiple schedules, and share by link.',
        path: '/tour',
      },
      {
        id: 'service',
        icon: 'service',
        title: 'Services',
        description: 'Hotels, restaurants, transport, promo vouchers, and business dashboard tools.',
        path: '/tourism-point',
      },
      {
        id: 'ocop',
        icon: 'ocop',
        title: 'OCOP',
        description: 'Local products, star ranking, origin details, and online ordering links.',
        path: '/ocop',
      },
    ],
    FEATURED_DESTINATIONS: [
      {
        id: 'trang-an',
        name: 'Trang An Scenic Landscape Complex',
        province: 'Ninh Binh',
        subtitle: 'Natural and cultural heritage',
        rating: 4.9,
        description:
          'Eco-tourism area with limestone mountains, caves, and iconic boat routes through waterways.',
        image:
          'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'hoa-lu',
        name: 'Hoa Lu Ancient Capital',
        province: 'Ninh Binh',
        subtitle: 'Historical site',
        rating: 4.7,
        description:
          'Historic complex linked to Dinh and Early Le dynasties with unique ancient architecture.',
        image:
          'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'bai-dinh',
        name: 'Bai Dinh Pagoda',
        province: 'Ninh Binh',
        subtitle: 'Spiritual tourism',
        rating: 4.8,
        description: 'Large pagoda complex suitable for worship, sightseeing, and festival journeys.',
        image:
          'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    NEWS_ITEMS: [
      {
        title: 'Ninh Binh Tourism Week 2026 opens with immersive night experiences',
        date: '18/04/2026',
        excerpt: 'Highlights include heritage night tours, light shows, and local OCOP showcases.',
      },
      {
        title: 'Localized heat warning for several spiritual attractions',
        date: '17/04/2026',
        excerpt: 'Visitors are advised to choose suitable time slots and stay hydrated.',
      },
      {
        title: 'Tourism businesses launch summer inter-region voucher campaign',
        date: '15/04/2026',
        excerpt: 'Hotels, food services, and local tours release seasonal promotions together.',
      },
    ],
    ITINERARY_ITEMS: [
      { time: '07:30', activity: 'Depart from city center' },
      { time: '08:15', activity: 'Check in at Trang An' },
      { time: '11:30', activity: 'Local specialty lunch' },
      { time: '14:00', activity: 'Hoa Lu / Bai Dinh' },
      { time: '17:30', activity: 'Preview next-day spots with VR360' },
    ],
    FOOD_TAGS: ['Ninh Binh goat', 'Crispy rice', 'Mountain snails', 'Local cuisine'],
    FOOD_BULLETS: [
      { label: 'Co Do Goat Restaurant', value: '? 4.7' },
      { label: 'Riverside food street', value: 'Open at night' },
      { label: 'Partner food voucher', value: 'DECO20' },
    ],
    SERVICES: [
      {
        name: 'Ninh Binh Heritage Hotel',
        type: 'Hotel',
        rating: 4.6,
        price: '950,000 VND/night',
        voucher: 'NBSTAY10',
        description: 'Central stay with easy access to Trang An and Hoa Lu.',
        image:
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Co Do Goat Restaurant',
        type: 'Restaurant',
        rating: 4.7,
        price: '120,000 - 350,000 VND',
        voucher: 'DECO20',
        description: 'Local specialties suitable for families and group tours.',
        image:
          'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Eco Boat Trang An',
        type: 'Transport',
        rating: 4.5,
        price: 'By route',
        voucher: 'BOAT15',
        description: 'Eco-boat service with online booking support.',
        image:
          'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    OCOP_PRODUCTS: [
      {
        name: 'Wetland lotus tea',
        stars: '4 stars',
        origin: 'Ninh Binh',
        price: '180,000 VND',
        description: 'Local product rooted in the wetland ecosystem story.',
        image:
          'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Mangrove forest honey',
        stars: '4 stars',
        origin: 'Ninh Binh',
        price: '240,000 VND',
        description: 'Clear origin and suitable for travel gifts.',
        image:
          'https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Heritage handmade pottery',
        stars: '5 stars',
        origin: 'Quang Ninh',
        price: '320,000 VND',
        description: 'Craft product for decoration and souvenirs.',
        image:
          'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    VLOG_STORIES: [
      {
        title: 'A full-day Trang An journey from morning to night',
        author: 'Lan Anh',
        description: 'Balanced itinerary with experiences, photography spots, and local cuisine.',
        image:
          'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'How to avoid crowds at Bai Dinh during festival season',
        author: 'Minh Khoa',
        description: 'Tips on time slots, routes, and nearby alternatives when traffic gets high.',
        image:
          'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Can VR360 help choose destinations more accurately?',
        author: 'Ngoc Mai',
        description: 'Preview real spaces and compare options before finalizing your trip plan.',
        image:
          'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=80',
      },
    ],
  },
};

export function getHomeData(lang) {
  return HOME_DATA_BY_LANG[lang === 'en' ? 'en' : 'vi'];
}

