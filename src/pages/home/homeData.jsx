import React from 'react';
import { Route, ShoppingBag, Calendar, Hotel } from 'lucide-react';

export const AD_SLIDES = [
  {
    id: 1,
    tag: 'Khách sạn nổi bật',
    tagIcon: <Hotel size={14} />,
    title: 'Emeralda Resort Ninh Bình',
    desc: 'Resort 5 sao giữa lòng thiên nhiên hùng vĩ — Ưu đãi đặc biệt đến 40% dịp hè 2025',
    cta: 'Xem ưu đãi',
    gradient: 'from-primary/80 to-primary/40',
    accent: '#10b981',
    path: '/tourism-point',
  },
  {
    id: 2,
    tag: 'Sự kiện OCOP',
    tagIcon: <ShoppingBag size={14} />,
    title: 'Hội chợ OCOP Ninh Bình 2025',
    desc: 'Trải nghiệm tinh hoa ẩm thực và sản phẩm OCOP đặc trưng vùng đất cố đô',
    cta: 'Khám phá sự kiện',
    gradient: 'from-secondary/80 to-primary/60',
    accent: '#f59e0b',
    path: '/ocop',
  },
  {
    id: 3,
    tag: 'Tour nổi bật',
    tagIcon: <Route size={14} />,
    title: 'Tuyến du thuyền Tràng An – Bích Động',
    desc: 'Hành trình ngắm cảnh trên sông qua hàng trăm hang đá kỳ vĩ — Giá từ 220.000đ/người',
    cta: 'Đặt tour ngay',
    gradient: 'from-primary/80 to-accent/60',
    accent: '#6366f1',
    path: '/tour',
  },
  {
    id: 4,
    tag: 'Lễ hội OCOP',
    tagIcon: <Calendar size={14} />,
    title: 'Lễ hội văn hoá cố đô Hoa Lư 2025',
    desc: 'Tái hiện vương triều Đinh – Lê với nghi lễ truyền thống và không gian văn hoá đặc sắc',
    cta: 'Tìm hiểu thêm',
    gradient: 'from-destructive/80 to-primary/60',
    accent: '#ef4444',
    path: '/ocop',
  },
];

export const NEWS_ITEMS = [
  {
    id: 1,
    source: 'Báo Ninh Bình',
    date: '12/04/2025',
    title: 'Ninh Bình đón 1,2 triệu lượt khách trong quý I/2025, tăng 18% so với cùng kỳ',
    excerpt:
      'Theo Sở Du lịch Ninh Bình, trong quý I năm 2025, tỉnh đã đón hơn 1,2 triệu lượt khách, trong đó có 85 nghìn lượt khách quốc tế...',
    category: 'Du lịch',
    hot: true,
  },
  {
    id: 2,
    source: 'VnExpress',
    date: '11/04/2025',
    title: 'Tràng An được công nhận thêm 3 hang động mới, mở rộng tuyến tham quan năm 2025',
    excerpt:
      'Ban Quản lý Quần thể danh thắng Tràng An công bố mở rộng quần thể với ba hang động chưa từng được khai thác, dự kiến đón khách từ tháng 6...',
    category: 'Điểm đến',
    hot: false,
  },
  {
    id: 3,
    source: 'Tuổi Trẻ Online',
    date: '10/04/2025',
    title: 'Hội chợ OCOP 2025 tại Ninh Bình: Hơn 200 gian hàng, nhiều sản phẩm 4-5 sao',
    excerpt:
      'Hội chợ OCOP tỉnh Ninh Bình năm 2025 thu hút hơn 200 gian hàng đến từ 30 tỉnh thành, trưng bày gần 1.000 sản phẩm đạt tiêu chuẩn OCOP...',
    category: 'OCOP',
    hot: true,
  },
  {
    id: 4,
    source: 'Nhân Dân',
    date: '09/04/2025',
    title: 'Đầu tư hạ tầng giao thông kết nối vùng di sản Tràng An – Tam Cốc – Bích Động',
    excerpt:
      'Dự án nâng cấp tuyến đường bộ kết nối các khu di sản trọng điểm được UBND tỉnh Ninh Bình phê duyệt với tổng vốn đầu tư 450 tỷ đồng...',
    category: 'Hạ tầng',
    hot: false,
  },
];

export const CATEGORIES = [
  {
    id: 1,
    label: 'Danh lam thắng cảnh',
    icon: '🏞️',
    path: '/tourism-point?cat=scenery',
    count: 24,
  },
  { id: 2, label: 'Ẩm thực OCOP', icon: '🍜', path: '/ocop', count: 18 },
  { id: 3, label: 'Khách sạn & Resort', icon: '🏨', path: '/tourism-point?cat=hotel', count: 31 },
  { id: 4, label: 'Di tích lịch sử', icon: '🏯', path: '/tourism-point?cat=heritage', count: 15 },
  { id: 5, label: 'Hoạt động thể thao', icon: '🚵', path: '/tourism-point?cat=sport', count: 9 },
  { id: 6, label: 'Lễ hội & Sự kiện', icon: '🎊', path: '/ocop', count: 7 },
];

export const SUGGEST_POINTS = [
  {
    id: 1,
    name: 'Tràng An',
    area: 'Hoa Lư',
    rating: 4.9,
    reviews: 2341,
    tag: 'Di sản UNESCO',
    emoji: '🚣',
  },
  {
    id: 2,
    name: 'Tam Cốc – Bích Động',
    area: 'Hoa Lư',
    rating: 4.8,
    reviews: 1876,
    tag: 'Đặc sắc',
    emoji: '⛵',
  },
  {
    id: 3,
    name: 'Cố đô Hoa Lư',
    area: 'Hoa Lư',
    rating: 4.7,
    reviews: 1120,
    tag: 'Lịch sử',
    emoji: '🏯',
  },
  {
    id: 4,
    name: 'Nhà thờ đá Phát Diệm',
    area: 'Kim Sơn',
    rating: 4.6,
    reviews: 890,
    tag: 'Kiến trúc',
    emoji: '⛪',
  },
  {
    id: 5,
    name: 'Tháp Báo Thiên',
    area: 'Nho Quan',
    rating: 4.5,
    reviews: 543,
    tag: 'Văn hoá',
    emoji: '🏛️',
  },
];

export const SUGGEST_TOURS = [
  {
    id: 1,
    name: 'Hành trình Tràng An 1 ngày',
    duration: '1 ngày',
    price: '350.000đ',
    rating: 4.9,
    tag: 'Bán chạy',
    emoji: '🛶',
  },
  {
    id: 2,
    name: 'Trải nghiệm cố đô Hoa Lư – Tràng An',
    duration: '2 ngày 1 đêm',
    price: '890.000đ',
    rating: 4.8,
    tag: 'Cao cấp',
    emoji: '🏰',
  },
  {
    id: 3,
    name: 'Khám phá Tam Cốc & Động Thiên Hà',
    duration: '1 ngày',
    price: '420.000đ',
    rating: 4.7,
    tag: 'Mới',
    emoji: '🕳️',
  },
  {
    id: 4,
    name: 'Tour OCOP & Làng nghề truyền thống',
    duration: '1 ngày',
    price: '280.000đ',
    rating: 4.6,
    tag: 'Văn hoá',
    emoji: '🎨',
  },
];

export const PARTNER_LOGOS = [
  { id: 1, name: 'Sở Du lịch Ninh Bình', abbr: 'SDL' },
  { id: 2, name: 'Emeralda Resort', abbr: 'EMR' },
  { id: 3, name: 'Tràng An Boats', abbr: 'TAB' },
  { id: 4, name: 'VinGroup Tourism', abbr: 'VIN' },
  { id: 5, name: 'OCOP Ninh Bình', abbr: 'OCP' },
  { id: 6, name: 'Ninh Bình Express', abbr: 'NBX' },
];
