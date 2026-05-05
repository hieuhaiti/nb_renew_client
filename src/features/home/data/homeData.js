const HOME_DATA_BY_LANG = {
  vi: {
    HERO_STATS: [
      { label: 'Điểm nổi bật', value: '03' },
      { label: 'Tải trung bình', value: '70%' },
      { label: 'Sự kiện & ưu đãi', value: '12+' },
      { label: 'VR360', value: 'Sẵn sàng' },
    ],
    HERO_EVENTS: [
      { title: 'Lễ hội Hoa Lũ', time: 'Tháng 4' },
      { title: 'Tuần du lịch Ninh Bình 2026', time: 'Đang diễn ra' },
      { title: 'Trình diễn ánh sáng đêm di sản', time: 'Cuối tuần' },
    ],
    PROMO_BANNER: {
      title: 'Ưu đãi mùa hè 2026',
      description:
        'Voucher cho tour, khách sạn và trải nghiệm ẩm thực đang được cập nhật trên bản đồ.',
      cta: 'Xem ưu đãi gần bạn',
      path: '/map',
    },
    QUICK_LINKS: [
      {
        id: 'map',
        icon: 'map',
        title: 'Bản đồ GIS',
        description:
          'Xem điểm du lịch, lập dịch vụ, thời tiết, tải trọng và chatbot tương tác bản đồ.',
        path: '/map',
      },
      {
        id: 'vr',
        icon: 'vr',
        title: 'VR360',
        description: 'Tham quan ảnh và video 360, hotspot, audio thuyết minh và bản đồ toàn cảnh.',
        path: '/vr360',
      },
      {
        id: 'plan',
        icon: 'plan',
        title: 'Lịch trình',
        description: 'Tạo kế hoạch chuyến đi, lưu nhiều hành trình và chia sẻ qua liên kết.',
        path: '/tour',
      },
      {
        id: 'service',
        icon: 'service',
        title: 'Dịch vụ',
        description:
          'Khách sạn, nhà hàng, vận chuyển, voucher khuyến mãi và dashboard doanh nghiệp.',
        path: '/tourism-point',
      },
      {
        id: 'ocop',
        icon: 'ocop',
        title: 'OCOP',
        description: 'Sản phẩm địa phương, xếp hạng sao, nguồn gốc và kết nối đặt hàng trực tuyến.',
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
          'Khu du lịch sinh thái với hệ thống núi đá vôi, hang động và tuyến dò xuyên thủy nội tiếng',
        image:
          'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'hoa-lu',
        name: 'Cố đô Hoa Lũ',
        province: 'Ninh Bình',
        subtitle: 'Di tích lịch sử',
        rating: 4.7,
        description:
          'Quần thể di tích lịch sử gắn với triều Đinh - Tiền Lê cùng kiến trúc cổ độc sắc',
        image:
          'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'bai-dinh',
        name: 'Chùa Bái Đính',
        province: 'Ninh Bình',
        subtitle: 'Tâm linh',
        rating: 4.8,
        description: 'Quần thể chùa lớn với hành lang La Hán, phù hợp tham quan kết hợp lễ hội',
        image:
          'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    NEWS_ITEMS: [
      {
        title: 'Tuần du lịch Ninh Bình 2026 khai mạc với chuỗi trải nghiệm đêm',
        date: '18/04/2026',
        excerpt:
          'Sự kiện nổi bật với tour đêm di sản, trình diễn ánh sáng và sản phẩm OCOP địa phương',
      },
      {
        title: 'Cảnh báo nóng cực bộ tại một số điểm du lịch tâm linh',
        date: '17/04/2026',
        excerpt: 'Hệ thống khuyên nghị khách chỉ đứng thời gian tham quan và bổ sung nước',
      },
      {
        title: 'Doanh nghiệp du lịch mở chiến dịch voucher liên vùng mùa hè',
        date: '15/04/2026',
        excerpt: 'Nhiều đơn vị lưu trú, ăn uống và tour nội tỉnh đồng loạt phát hành voucher',
      },
    ],
    ITINERARY_ITEMS: [
      { time: '07:30', activity: 'Khởi hành từ trung tâm thành phố' },
      { time: '08:15', activity: 'Check-in Tràng An' },
      { time: '11:30', activity: 'Ăn trưa đặc sản địa phương' },
      { time: '14:00', activity: 'Cố đô Hoa Lũ / Bái Đính' },
      { time: '17:30', activity: 'Mở VR360 để xem điểm cho ngày mai' },
    ],
    FOOD_TAGS: ['Dê núi Ninh Bình', 'Cơm cháy', 'Ốc núi', 'Ẩm thực địa phương'],
    FOOD_BULLETS: [
      { label: 'Nhà hàng Dê Núi Cố Đô', value: '⭐ 4.7' },
      { label: 'Phố ẩm thực ven sông', value: 'Mở tối' },
      { label: 'Voucher ẩm thực liên kết', value: 'DECO20' },
    ],
    SERVICES: [
      {
        name: 'Ninh Bình Heritage Hotel',
        type: 'Khách sạn',
        rating: 4.6,
        price: '950.000đ/đêm',
        voucher: 'NBSTAY10',
        description: 'Lưu trú gần trung tâm, thuận tiện kết nối Tràng An và Hoa Lũ',
        image:
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Nhà hàng Dê Núi Cố Đô',
        type: 'Nhà hàng',
        rating: 4.7,
        price: '120.000đ - 350.000đ',
        voucher: 'DECO20',
        description: 'Ẩm thực đặc sản địa phương, phù hợp tour gia đình và đoàn khách',
        image:
          'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Eco Boat Tràng An',
        type: 'Vận chuyển',
        rating: 4.5,
        price: 'Theo tuyến',
        voucher: 'BOAT15',
        description: 'Dịch vụ thuyền sinh thái và hỗ trợ đặt chỗ trực tuyến',
        image:
          'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    OCOP_PRODUCTS: [
      {
        name: 'Trà sen đất ngập nước',
        stars: '4 sao',
        origin: 'Ninh Bình',
        price: '180.000đ',
        description: 'Sản phẩm địa phương gắn với câu chuyện vùng sinh thái độc trung',
        image:
          'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Mật ong rừng ngập mặn',
        stars: '4 sao',
        origin: 'Ninh Bình',
        price: '240.000đ',
        description: 'Nguồn gốc rõ ràng, phù hợp làm quà tặng du lịch',
        image:
          'https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Gốm thủ công di sản',
        stars: '5 sao',
        origin: 'Quảng Ninh',
        price: '320.000đ',
        description: 'Sản phẩm thủ công phục vụ trưng bày và quà lưu niệm',
        image:
          'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    VLOG_STORIES: [
      {
        title: 'Một ngày khám phá Tràng An từ sáng đến đêm',
        author: 'Lan Anh',
        description:
          'Gợi ý lịch trình cân bằng giữa trải nghiệm, chụp ảnh và thưởng thức ẩm thực địa phương',
        image:
          'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Kinh nghiệm tránh đông khi đi Bái Đính mùa lễ hội',
        author: 'Minh Khoa',
        description:
          'Mẹo chọn khung giờ, tuyến tham quan và điểm thay thế gần đó khi lượng khách tăng cao',
        image:
          'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'VR360 có giúp chọn điểm đến chính xác hơn không?',
        author: 'Ngọc Mai',
        description:
          'Trải nghiệm xem trước không gian thực tế và so sánh trước khi lên kế hoạch chuyến đi',
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
        description:
          'Hotels, restaurants, transport, promo vouchers, and business dashboard tools.',
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
        description:
          'Large pagoda complex suitable for worship, sightseeing, and festival journeys.',
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
