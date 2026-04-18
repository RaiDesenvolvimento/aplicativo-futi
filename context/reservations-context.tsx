import type { ReservationRecord, ReservationStatus } from '@/lib/reservation-types';
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

type AddReservationInput = Omit<
  ReservationRecord,
  'id' | 'status' | 'matchSummary' | 'summaryHeading' | 'completedBadgeTone' | 'layoutVariant' | 'createdAt'
> & { createdAt?: number };

type ReservationsContextValue = {
  reservations: ReservationRecord[];
  addReservation: (input: AddReservationInput) => void;
  finalizeReservation: (id: string) => void;
};

const ReservationsContext = createContext<ReservationsContextValue | null>(null);

export function ReservationsProvider({ children }: { children: React.ReactNode }) {
  const [reservations, setReservations] = useState<ReservationRecord[]>([]);

  const addReservation = useCallback((input: AddReservationInput) => {
    const id = `res-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const row: ReservationRecord = {
      ...input,
      id,
      status: 'active',
      createdAt: input.createdAt ?? Date.now(),
    };
    setReservations((prev) => [row, ...prev]);
  }, []);

  const finalizeReservation = useCallback((id: string) => {
    setReservations((prev) => {
      const completedBefore = prev.filter((r) => r.status === 'completed').length;
      const demos = [
        { line: 'Vitória (5 x 3)', heading: 'Resultado Final' as const, tone: 'accent' as const },
        { line: 'Empate (2 x 2)', heading: 'Status da Partida' as const, tone: 'muted' as const },
        { line: 'Vitória (2 x 1)', heading: 'Resultado Final' as const, tone: 'accent' as const },
      ];
      const pick = demos[completedBefore % demos.length];
      const layoutVariant = completedBefore % 3 === 2 ? 'compact' : 'hero';

      return prev.map((r) =>
        r.id === id && r.status === 'active'
          ? {
              ...r,
              status: 'completed' as ReservationStatus,
              matchSummary: pick.line,
              summaryHeading: pick.heading,
              completedBadgeTone: pick.tone,
              layoutVariant,
            }
          : r,
      );
    });
  }, []);

  const value = useMemo(
    () => ({
      reservations,
      addReservation,
      finalizeReservation,
    }),
    [reservations, addReservation, finalizeReservation],
  );

  return <ReservationsContext.Provider value={value}>{children}</ReservationsContext.Provider>;
}

export function useReservations(): ReservationsContextValue {
  const ctx = useContext(ReservationsContext);
  if (!ctx) {
    throw new Error('useReservations must be used within ReservationsProvider');
  }
  return ctx;
}
