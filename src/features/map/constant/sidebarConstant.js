import { Bot, Calendar, MapPin, Satellite } from 'lucide-react';
import EventPanel from '@/features/map/components/rightSidebar/EventPanel';
import ChatbotPanel from '@/features/map/components/rightSidebar/ChatbotPanel';
import TourPanel from '@/features/map/components/rightSidebar/TourPanel';

export const headerSidebar = [
  {
    icon: Calendar,
    label: 'headerAside.event',
    value: 'event',
    component: EventPanel,
    authen: false,
  },
  {
    icon: MapPin,
    label: 'headerAside.tour',
    value: 'tour',
    component: TourPanel,
    authen: false,
  },
  {
    icon: Satellite,
    label: 'headerAside.satellite',
    value: 'satellite',
    component: 'SatelliteImage Placeholder',
    authen: true,
  },
  {
    icon: Bot,
    label: 'headerAside.chatbot',
    value: 'chatbot',
    component: ChatbotPanel,
    authen: true,
  },
];

export const currentHeaderSidebar = 'event';
