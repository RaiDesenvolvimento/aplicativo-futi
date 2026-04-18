import { ArenaLinkColors, ArenaLinkImages } from '@/constants/arena-link-theme';
import { useReservations } from '@/context/reservations-context';
import type { ReservationRecord } from '@/lib/reservation-types';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { router, type Href } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TabKey = 'active' | 'history';

function repeatBooking(venueId: string) {
  router.push({ pathname: '/arena-booking', params: { venueId } } as Href);
}

function CompletedHeroCard({
  r,
  onRepeat,
}: {
  r: ReservationRecord;
  onRepeat: () => void;
}) {
  const badgeTertiary = r.completedBadgeTone === 'accent';
  return (
    <View style={styles.cardOuter}>
      <View style={styles.cardHero}>
        <Image source={{ uri: r.imageUri }} style={StyleSheet.absoluteFill} contentFit="cover" />
        <LinearGradient
          colors={['transparent', ArenaLinkColors.surfaceContainerLow]}
          style={StyleSheet.absoluteFill}
        />
        <View style={[styles.statusPill, badgeTertiary ? styles.pillTertiary : styles.pillMuted]}>
          <Text style={[styles.statusPillText, badgeTertiary ? styles.pillTextTertiary : styles.pillTextMuted]}>
            Finalizada
          </Text>
        </View>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardTopRow}>
          <View style={styles.cardTitleBlock}>
            <Text style={styles.arenaTitle}>{r.venueName.toUpperCase()}</Text>
            <View style={styles.dateRow}>
              <MaterialCommunityIcons name="calendar-month" size={16} color={ArenaLinkColors.onSurfaceVariant} />
              <Text style={styles.dateText}>
                {r.dateLabel} • {r.timeLabel}
              </Text>
            </View>
          </View>
          <View style={styles.priceBlock}>
            <Text style={styles.priceValue}>R$ {r.totalPaid}</Text>
            <Text style={styles.priceCaption}>Total Pago</Text>
          </View>
        </View>
        <View style={styles.summaryRow}>
          <View style={styles.summaryLeft}>
            <View style={styles.soccerCircle}>
              <MaterialCommunityIcons name="soccer" size={22} color={ArenaLinkColors.primary} />
            </View>
            <View>
              <Text style={styles.summaryKicker}>{r.summaryHeading ?? 'Resultado'}</Text>
              <Text style={styles.summaryValue}>{r.matchSummary ?? '—'}</Text>
            </View>
          </View>
          <Pressable onPress={onRepeat} style={({ pressed }) => [styles.repeatBtnSmall, pressed && { opacity: 0.92 }]}>
            <LinearGradient
              colors={[ArenaLinkColors.primary, ArenaLinkColors.primaryContainer]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.repeatBtnSmallInner}>
              <Text style={styles.repeatBtnSmallText}>REPETIR RESERVA</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function CompletedCompactCard({ r, onRepeat }: { r: ReservationRecord; onRepeat: () => void }) {
  return (
    <View style={styles.compactCard}>
      <MaterialCommunityIcons
        name="history"
        size={120}
        color={ArenaLinkColors.onSurface}
        style={styles.compactWatermark}
      />
      <View style={styles.compactInner}>
        <View style={styles.compactTitleRow}>
          <Text style={styles.compactTitle}>{r.venueName.toUpperCase()}</Text>
          <Text style={styles.priceValue}>R$ {r.totalPaid}</Text>
        </View>
        <View style={styles.compactMetaRow}>
          <View style={styles.compactMetaCol}>
            <Text style={styles.metaLabel}>Data</Text>
            <Text style={styles.metaValue}>{r.dateLabel}</Text>
          </View>
          <View style={styles.compactMetaCol}>
            <Text style={styles.metaLabel}>Horário</Text>
            <Text style={styles.metaValue}>{r.timeLabel}</Text>
          </View>
          <View style={styles.compactMetaCol}>
            <Text style={styles.metaLabel}>Status</Text>
            <Text style={[styles.metaValue, { color: ArenaLinkColors.tertiary }]}>Finalizada</Text>
          </View>
        </View>
        <Pressable onPress={onRepeat} style={({ pressed }) => [styles.repeatBtnWide, pressed && { opacity: 0.94 }]}>
          <Text style={styles.repeatBtnWideText}>REPETIR RESERVA</Text>
        </Pressable>
      </View>
    </View>
  );
}

function ActiveCard({
  r,
  onRepeat,
  onComplete,
}: {
  r: ReservationRecord;
  onRepeat: () => void;
  onComplete: () => void;
}) {
  return (
    <View style={styles.cardOuter}>
      <View style={styles.cardHero}>
        <Image source={{ uri: r.imageUri }} style={StyleSheet.absoluteFill} contentFit="cover" />
        <LinearGradient
          colors={['transparent', ArenaLinkColors.surfaceContainerLow]}
          style={StyleSheet.absoluteFill}
        />
        <View style={[styles.statusPill, styles.pillActive]}>
          <Text style={styles.statusPillTextActive}>Agendada</Text>
        </View>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardTopRow}>
          <View style={styles.cardTitleBlock}>
            <Text style={styles.arenaTitle}>{r.venueName.toUpperCase()}</Text>
            <View style={styles.dateRow}>
              <MaterialCommunityIcons name="calendar-month" size={16} color={ArenaLinkColors.onSurfaceVariant} />
              <Text style={styles.dateText}>
                {r.dateLabel} • {r.timeLabel}
              </Text>
            </View>
          </View>
          <View style={styles.priceBlock}>
            <Text style={styles.priceValue}>R$ {r.totalPaid}</Text>
            <Text style={styles.priceCaption}>Total rateio</Text>
          </View>
        </View>
        <View style={styles.summaryRow}>
          <View style={styles.summaryLeft}>
            <View style={styles.soccerCircle}>
              <MaterialCommunityIcons name="account-group" size={20} color={ArenaLinkColors.primary} />
            </View>
            <View>
              <Text style={styles.summaryKicker}>Elenco</Text>
              <Text style={styles.summaryValue}>
                {r.squadCount} jogador{r.squadCount !== 1 ? 'es' : ''} convocado{r.squadCount !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.activeActions}>
          <Pressable onPress={onComplete} style={({ pressed }) => [styles.outlineBtn, pressed && { opacity: 0.9 }]}>
            <Text style={styles.outlineBtnText}>Marcar realizada</Text>
          </Pressable>
          <Pressable onPress={onRepeat} style={({ pressed }) => [styles.repeatBtnSmall, pressed && { opacity: 0.92 }]}>
            <LinearGradient
              colors={[ArenaLinkColors.primary, ArenaLinkColors.primaryContainer]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.repeatBtnSmallInner}>
              <Text style={styles.repeatBtnSmallText}>REPETIR</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default function ReservaTabScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { reservations, finalizeReservation } = useReservations();
  const [tab, setTab] = useState<TabKey>('active');

  const filtered = useMemo(() => {
    const want: ReservationRecord['status'] = tab === 'active' ? 'active' : 'completed';
    return reservations.filter((r) => r.status === want).sort((a, b) => b.createdAt - a.createdAt);
  }, [reservations, tab]);

  const headerBottom = insets.top + 56;
  const bottomPad = tabBarHeight + Math.max(insets.bottom, 12) + 24;

  const onTab = (next: TabKey) => {
    setTab(next);
    void Haptics.selectionAsync();
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerRow}>
          <View style={styles.brandBlock}>
            <View style={styles.avatarWrap}>
              <Image source={{ uri: ArenaLinkImages.homeProfile }} style={styles.avatar} contentFit="cover" />
            </View>
            <Text style={styles.brand}>ArenaLink</Text>
          </View>
          <Pressable hitSlop={12} onPress={() => void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
            <MaterialCommunityIcons name="bell-outline" size={24} color={ArenaLinkColors.primary} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingTop: headerBottom + 12, paddingBottom: bottomPad }]}>
        <View style={styles.intro}>
          <Text style={styles.pageTitle}>{tab === 'active' ? 'Reservas ativas' : 'Histórico'}</Text>
          <Text style={styles.pageSub}>
            {tab === 'active'
              ? 'Partidas confirmadas e próximos confrontos com o seu time.'
              : 'Gerencie suas partidas passadas e reviva seus melhores momentos em campo.'}
          </Text>
        </View>

        <View style={styles.tabBar}>
          <Pressable
            onPress={() => onTab('active')}
            style={({ pressed }) => [
              styles.tabBtn,
              tab === 'active' ? styles.tabBtnOn : styles.tabBtnOff,
              pressed && { opacity: 0.92 },
            ]}>
            <Text style={[styles.tabBtnText, tab === 'active' ? styles.tabBtnTextOn : styles.tabBtnTextOff]}>
              Ativas
            </Text>
          </Pressable>
          <Pressable
            onPress={() => onTab('history')}
            style={({ pressed }) => [
              styles.tabBtn,
              tab === 'history' ? styles.tabBtnOn : styles.tabBtnOff,
              pressed && { opacity: 0.92 },
            ]}>
            <Text style={[styles.tabBtnText, tab === 'history' ? styles.tabBtnTextOn : styles.tabBtnTextOff]}>
              Histórico
            </Text>
          </Pressable>
        </View>

        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <MaterialCommunityIcons name="calendar-blank" size={48} color={ArenaLinkColors.outlineVariant} />
            <Text style={styles.emptyTitle}>
              {tab === 'active' ? 'Nenhuma reserva ativa' : 'Histórico vazio'}
            </Text>
            <Text style={styles.emptySub}>
              {tab === 'active'
                ? 'Feche o time em uma arena pelo Explore para aparecer aqui.'
                : 'Quando marcar uma partida como realizada, ela aparece nesta lista.'}
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {filtered.map((r) => {
              const repeat = () => {
                void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                repeatBooking(r.venueId);
              };
              const complete = () => {
                void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                finalizeReservation(r.id);
                setTab('history');
              };

              if (r.status === 'active') {
                return <ActiveCard key={r.id} r={r} onRepeat={repeat} onComplete={complete} />;
              }
              if (r.layoutVariant === 'compact') {
                return <CompletedCompactCard key={r.id} r={r} onRepeat={repeat} />;
              }
              return <CompletedHeroCard key={r.id} r={r} onRepeat={repeat} />;
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: ArenaLinkColors.surfaceDim,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 40,
    backgroundColor: 'rgba(19,19,19,0.82)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    shadowColor: ArenaLinkColors.primary,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.08,
    shadowRadius: 32,
    elevation: 6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    height: 56,
  },
  brandBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(61,74,62,0.35)',
    backgroundColor: ArenaLinkColors.surfaceContainerHigh,
  },
  avatar: { width: '100%', height: '100%' },
  brand: {
    color: ArenaLinkColors.primary,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: -0.3,
    textTransform: 'uppercase',
  },
  scroll: {
    paddingHorizontal: 22,
  },
  intro: {
    marginBottom: 26,
  },
  pageTitle: {
    color: ArenaLinkColors.onSurface,
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  pageSub: {
    color: ArenaLinkColors.onSurfaceVariant,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    maxWidth: 300,
  },
  tabBar: {
    flexDirection: 'row',
    gap: 4,
    padding: 6,
    borderRadius: 14,
    backgroundColor: ArenaLinkColors.surfaceContainerLow,
    marginBottom: 22,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabBtnOn: {
    backgroundColor: ArenaLinkColors.surfaceContainer,
    borderBottomWidth: 2,
    borderBottomColor: ArenaLinkColors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
  },
  tabBtnOff: {},
  tabBtnText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  tabBtnTextOn: {
    color: ArenaLinkColors.primary,
  },
  tabBtnTextOff: {
    color: ArenaLinkColors.onSurfaceVariant,
  },
  list: {
    gap: 22,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 10,
    paddingHorizontal: 12,
  },
  emptyTitle: {
    color: ArenaLinkColors.onSurface,
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
  },
  emptySub: {
    color: ArenaLinkColors.onSurfaceVariant,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
  },
  cardOuter: {
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: ArenaLinkColors.surfaceContainerLow,
  },
  cardHero: {
    height: 128,
    width: '100%',
    position: 'relative',
  },
  statusPill: {
    position: 'absolute',
    top: 14,
    right: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  pillTertiary: {
    backgroundColor: ArenaLinkColors.tertiary,
  },
  pillMuted: {
    backgroundColor: ArenaLinkColors.surfaceBright,
  },
  pillActive: {
    backgroundColor: 'rgba(84,233,138,0.2)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(84,233,138,0.45)',
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  pillTextTertiary: {
    color: ArenaLinkColors.onTertiary,
  },
  pillTextMuted: {
    color: ArenaLinkColors.onSurface,
  },
  statusPillTextActive: {
    color: ArenaLinkColors.primary,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  cardBody: {
    padding: 18,
    gap: 14,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  cardTitleBlock: {
    flex: 1,
  },
  arenaTitle: {
    color: ArenaLinkColors.onSurface,
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: -0.2,
    marginBottom: 6,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    color: ArenaLinkColors.onSurfaceVariant,
    fontSize: 12,
    fontWeight: '600',
  },
  priceBlock: {
    alignItems: 'flex-end',
  },
  priceValue: {
    color: ArenaLinkColors.primary,
    fontSize: 19,
    fontWeight: '900',
  },
  priceCaption: {
    color: ArenaLinkColors.outline,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    backgroundColor: ArenaLinkColors.surfaceContainer,
    borderRadius: 10,
    padding: 14,
  },
  summaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  soccerCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ArenaLinkColors.surfaceBright,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryKicker: {
    color: ArenaLinkColors.onSurfaceVariant,
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  summaryValue: {
    color: ArenaLinkColors.onSurface,
    fontSize: 14,
    fontWeight: '700',
  },
  repeatBtnSmall: {
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: ArenaLinkColors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  repeatBtnSmallInner: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  repeatBtnSmallText: {
    color: ArenaLinkColors.onPrimary,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  activeActions: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  outlineBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: ArenaLinkColors.outlineVariant,
    alignItems: 'center',
  },
  outlineBtnText: {
    color: ArenaLinkColors.onSurfaceVariant,
    fontSize: 12,
    fontWeight: '700',
  },
  compactCard: {
    borderRadius: 14,
    padding: 18,
    backgroundColor: ArenaLinkColors.surfaceContainerLow,
    borderLeftWidth: 4,
    borderLeftColor: 'rgba(84,233,138,0.4)',
    overflow: 'hidden',
    position: 'relative',
  },
  compactWatermark: {
    position: 'absolute',
    right: -14,
    top: -14,
    opacity: 0.06,
  },
  compactInner: {
    gap: 14,
    zIndex: 1,
  },
  compactTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  compactTitle: {
    flex: 1,
    color: ArenaLinkColors.onSurface,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: -0.3,
    textTransform: 'uppercase',
    paddingRight: 12,
  },
  compactMetaRow: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
  },
  compactMetaCol: {
    minWidth: 72,
  },
  metaLabel: {
    color: ArenaLinkColors.outline,
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  metaValue: {
    color: ArenaLinkColors.onSurface,
    fontSize: 14,
    fontWeight: '600',
  },
  repeatBtnWide: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: ArenaLinkColors.surfaceContainerHighest,
    alignItems: 'center',
  },
  repeatBtnWideText: {
    color: ArenaLinkColors.primary,
    fontSize: 12,
    fontWeight: '800',
  },
});
