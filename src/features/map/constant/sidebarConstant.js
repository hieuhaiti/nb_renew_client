import { Calendar, Layers, MapPin, Navigation, Satellite } from 'lucide-react';
import DataLayer from '@/features/map/components/sidebar/DataLayer';

export const headerSidebar = [
  {
    icon: Layers,
    label: 'headerAside.layerData',
    value: 'layerData',
    component: DataLayer,
    authen: false,
  },

  {
    icon: Navigation,
    label: 'headerAside.direction',
    value: 'direction',
    component: 'DirectionMap Placeholder',
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
    icon: Calendar,
    label: 'headerAside.event',
    value: 'event',
    component: 'EventPanel Placeholder',
    authen: false,
  },
  {
    icon: MapPin,
    label: 'headerAside.tour',
    value: 'tour',
    component: 'TourPanel Placeholder',
    authen: false,
  },
];

export const currentHeaderSidebar = 'layerData';
