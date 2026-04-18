import { ArenaLinkImages } from '@/constants/arena-link-theme';

export type Surface = 'society' | 'natural' | 'hard';

export type Venue = {
  id: string;
  name: string;
  price: number;
  rating: number;
  image: string;
  lat: number;
  lng: number;
  surface: Surface;
  availableNow: boolean;
};

export const SURFACE_LABEL: Record<Surface, string> = {
  society: 'Society',
  natural: 'Grama natural',
  hard: 'Quadra rápida',
};

export const EXPLORE_VENUES: Venue[] = [
  {
    id: '1',
    name: 'Maracanã Premium',
    price: 120,
    rating: 4.8,
    image: ArenaLinkImages.venueMaracana,
    lat: -25.43,
    lng: -49.27,
    surface: 'society',
    availableNow: true,
  },
  {
    id: '2',
    name: 'Skyline Arena',
    price: 150,
    rating: 4.9,
    image: ArenaLinkImages.venueSkyline,
    lat: -25.44,
    lng: -49.29,
    surface: 'natural',
    availableNow: false,
  },
  {
    id: '3',
    name: 'The Cage Sports',
    price: 90,
    rating: 4.5,
    image: ArenaLinkImages.venueCage,
    lat: -25.47,
    lng: -49.3,
    surface: 'hard',
    availableNow: true,
  },
];

export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export function getVenueById(id: string | undefined): Venue | null {
  if (!id) return null;
  return EXPLORE_VENUES.find((v) => v.id === id) ?? null;
}
