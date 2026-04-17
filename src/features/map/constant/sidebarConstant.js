import { Calendar, Layers, MapPin, Navigation, Palette, Satellite } from 'lucide-react';

export const componentMapSideBar = {
  layerData: 'DataLayer Placeholder',
  direction: 'DirectionMap Placeholder',
  satellite: 'SatelliteImage Placeholder',
  event: 'EventPanel Placeholder',
  tour: 'TourPanel Placeholder',
};
export const headerSidebar = [
  {
    icon: Layers,
    label: 'headerAside.layerData',
    value: 'layerData',
    authen: false,
  },

  {
    icon: Navigation,
    label: 'headerAside.direction',
    value: 'direction',
    authen: false,
  },
  {
    icon: Satellite,
    label: 'headerAside.satellite',
    value: 'satellite',
    authen: true,
  },
  {
    icon: Calendar,
    label: 'headerAside.event',
    value: 'event',
    authen: false,
  },
  {
    icon: MapPin,
    label: 'headerAside.tour',
    value: 'tour',
    authen: false,
  },
];

export const currentHeaderSidebar = 'layerData';
