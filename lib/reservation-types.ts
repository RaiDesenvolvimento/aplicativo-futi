export type ReservationStatus = 'active' | 'completed';

export type CompletedBadgeTone = 'accent' | 'muted';

export type ReservationLayoutVariant = 'hero' | 'compact';

export type ReservationRecord = {
  id: string;
  venueId: string;
  venueName: string;
  imageUri: string;
  createdAt: number;
  dateLabel: string;
  timeLabel: string;
  totalPaid: number;
  squadCount: number;
  status: ReservationStatus;
  matchSummary?: string;
  summaryHeading?: string;
  completedBadgeTone?: CompletedBadgeTone;
  layoutVariant?: ReservationLayoutVariant;
};

const PT_SHORT_MONTHS = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
] as const;

export function formatPtShortDate(d: Date): string {
  return `${d.getDate()} ${PT_SHORT_MONTHS[d.getMonth()]}, ${d.getFullYear()}`;
}
