import { Calendar, MapPin, Navigation, Satellite } from 'lucide-react';
import Destination from '@/features/map/components/rightSidebar/DetailPoint';
import DirectionDetails from '@/features/map/components/rightSidebar/DirectionDetails';
import EventPanel from '@/features/map/components/rightSidebar/EventPanel';
import TourPanel from '@/features/map/components/rightSidebar/TourPanel';

export const headerSidebar = [
  {
    icon: Navigation,
    label: 'headerAside.destination',
    value: 'destination',
    component: Destination,
    authen: false,
  },
  {
    icon: Navigation,
    label: 'headerAside.direction',
    value: 'direction',
    component: DirectionDetails,
    authen: false,
    requiresDirectionDetails: true,
  },

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
];

export const currentHeaderSidebar = 'destination';
