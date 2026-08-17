export const mapDestinations = [
  {
    id: 0,
    name: 'Trang An scenic complex',
    category: 'culture',
    label: 'Culture',
    coords: [105.8865, 20.2507],
    descriptionKey: 'mapPage.mock.destinations.trangAn.description',
    image:
      'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1200&auto=format&fit=crop',
    loadPercent: 62,
  },
  {
    id: 1,
    name: 'Tam Coc - Bich Dong',
    category: 'nature',
    label: 'Nature',
    coords: [105.8948, 20.2157],
    descriptionKey: 'mapPage.mock.destinations.tamCoc.description',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop',
    loadPercent: 78,
  },
  {
    id: 2,
    name: 'Hoa Lu ancient capital',
    category: 'culture',
    label: 'History',
    coords: [105.8793, 20.2529],
    description: 'Historic complex connected with the first centralized feudal capital in Vietnam.',
    image:
      'https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=1200&auto=format&fit=crop',
    loadPercent: 41,
  },
  {
    id: 3,
    name: 'Hoa Lu old town',
    category: 'food',
    label: 'Food',
    coords: [105.9766, 20.2545],
    descriptionKey: 'mapPage.mock.destinations.hoaLuOldTown.description',
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
    loadPercent: 55,
  },
];

export const mapLayerToggles = [
  { key: 'destinations', label: 'Destinations' },
  { key: 'services', label: 'Tourism services' },
  { key: 'weather', label: 'Weather and AQI' },
  { key: 'load', label: 'Load monitoring' },
  { key: 'satellite', label: 'Conservation satellite view' },
];

export const mapBasemapOptions = [
  {
    id: 'outdoor',
    title: 'Outdoor',
    description: 'Suitable for nature trips',
  },
  {
    id: 'street',
    title: 'Street',
    description: 'Good for service visibility',
  },
  {
    id: 'satellite',
    title: 'Satellite',
    description: 'Satellite imagery for conservation insights',
  },
  {
    id: 'satelliteStreet',
    title: 'Satellite street',
    description: 'Current field status',
  },
];

export const mapTourSuggestions = [
  {
    id: 'soft-day',
    title: 'Soft day tour',
    textKey: 'mapPage.mock.tourSuggestions.softDay',
  },
  {
    id: 'culture-focus',
    title: 'Culture focus route',
    textKey: 'mapPage.mock.tourSuggestions.cultureFocus',
  },
  {
    id: 'eco-photo',
    title: 'Eco photo route',
    text: 'Tam Coc riverside check-in and landscape viewpoints.',
  },
];
