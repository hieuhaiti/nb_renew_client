import {
  AlignHorizontalJustifyCenter,
  Bot,
  Calendar,
  Car,
  MapPin,
  Satellite,
  Users,
} from 'lucide-react';
import EventPanel from '@/features/map/components/rightSidebar/EventPanel';
import ChatbotPanel from '@/features/map/components/rightSidebar/ChatbotPanel';
import TourPanel from '@/features/map/components/rightSidebar/TourPanel';
import CapacityPanel from '@/features/map/components/rightSidebar/CapacityPanel';
import TrafficPanel from '@/features/map/components/rightSidebar/TrafficPanel';

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
    icon: Users,
    label: 'headerAside.capacity',
    value: 'capacity',
    component: CapacityPanel,
    authen: false,
  },
  {
    icon: Car,
    label: 'headerAside.traffic',
    value: 'traffic',
    component: TrafficPanel,
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
    icon: AlignHorizontalJustifyCenter,
    label: 'headerAside.compareSatellite',
    value: 'compareSatellite',
    component: 'compareSatellite Placeholder',
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
