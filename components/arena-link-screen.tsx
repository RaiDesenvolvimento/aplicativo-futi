import { ArenaLinkColors, ArenaLinkImages } from '@/constants/arena-link-theme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import type { ComponentProps } from 'react';
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Slot = { time: string; state: 'selected' | 'available' | 'busy' };

const TIME_SLOTS: Slot[] = [
  { time: '18:00', state: 'selected' },
  { time: '19:00', state: 'available' },
  { time: '20:00', state: 'available' },
  { time: '21:00', state: 'busy' },
  { time: '22:00', state: 'available' },
  { time: '23:00', state: 'available' },
];

const AMENITIES: { icon: ComponentProps<typeof MaterialCommunityIcons>['name']; label: string }[] = [
  { icon: 'parking', label: 'Estacionamento' },
  { icon: 'shower', label: 'Vestiário & Chuveiro' },
  { icon: 'grill', label: 'Churrasqueira' },
  { icon: 'glass-cocktail', label: 'Bar & Lanches' },
  { icon: 'wifi', label: 'Wi-Fi Grátis' },
];

const MAP_QUERY = encodeURIComponent('Av. dos Atletas, 450 São Paulo');

export type ArenaLinkScreenProps = {
  /** Na aba Explore o botão voltar some; na pilha do app chama `router.back()`. */
  variant?: 'tab' | 'stack';
};

export function ArenaLinkScreen({ variant = 'stack' }: ArenaLinkScreenProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const showBack = variant === 'stack';

  const openDirections = () => {
    const url =
      Platform.select({
        ios: `maps:0,0?q=${MAP_QUERY}`,
        android: `geo:0,0?q=${MAP_QUERY}`,
        default: `https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`,
      }) ?? `https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`;
    Linking.openURL(url);
  };

  const onReserve = () => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 + insets.bottom }]}>
        <View style={styles.heroWrap}>
          <Image source={{ uri: ArenaLinkImages.hero }} style={styles.heroImage} contentFit="cover" />
          <LinearGradient
            colors={['transparent', 'rgba(19,19,19,0.35)', ArenaLinkColors.surfaceDim]}
            locations={[0.35, 0.65, 1]}
            style={StyleSheet.absoluteFill}
          />
          {showBack ? (
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [
                styles.backBtn,
                { top: insets.top + 56 },
                pressed && styles.pressed,
              ]}>
              <MaterialCommunityIcons name="arrow-left" size={22} color={ArenaLinkColors.primary} />
            </Pressable>
          ) : null}
          <View style={styles.heroTextBlock}>
            <View style={styles.badge}>
              <MaterialCommunityIcons name="fire" size={14} color={ArenaLinkColors.onTertiary} />
              <Text style={styles.badgeText}>Destaque da Semana</Text>
            </View>
            <Text style={styles.title}>Arena Elite Synthetic</Text>
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <MaterialCommunityIcons name="star" size={18} color={ArenaLinkColors.primary} />
                <Text style={styles.metaText}>4.9 (124 reviews)</Text>
              </View>
              <View style={styles.metaItem}>
                <MaterialCommunityIcons name="map-marker-distance" size={18} color={ArenaLinkColors.onSurface} />
                <Text style={styles.metaText}>1.2km</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.bento}>
          <View style={styles.mainCard}>
            <Text style={styles.sectionTitlePrimary}>Sobre a Quadra</Text>
            <Text style={styles.bodyMuted}>
              Equipada com grama sintética de padrão FIFA e sistema de drenagem de última geração. Perfeita para
              jogos 5x5 ou 7x7. Localizada no coração do polo esportivo central.
            </Text>
            <View style={styles.statsGrid}>
              {[
                { k: 'Tipo', v: 'Society 7x7' },
                { k: 'Piso', v: 'Turf Pro' },
                { k: 'Preço', v: 'R$ 180/h' },
                { k: 'Luz', v: 'LED HD' },
              ].map((row) => (
                <View key={row.k} style={styles.statCell}>
                  <Text style={styles.statLabel}>{row.k}</Text>
                  <Text style={styles.statValue}>{row.v}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.locationCard}>
            <Text style={styles.sectionTitle}>Localização</Text>
            <View style={styles.mapThumb}>
              <Image
                source={{ uri: ArenaLinkImages.mapPreview }}
                style={StyleSheet.absoluteFill}
                contentFit="cover"
              />
            </View>
            <Text style={styles.address}>Av. dos Atletas, 450 - Centro Esportivo</Text>
            <Pressable
              onPress={openDirections}
              style={({ pressed }) => [styles.directionsBtn, pressed && styles.pressed]}>
              <MaterialCommunityIcons name="crosshairs-gps" size={18} color={ArenaLinkColors.primary} />
              <Text style={styles.directionsBtnText}>Como Chegar</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.availability}>
          <View style={styles.availabilityHeader}>
            <View>
              <Text style={styles.availabilityTitle}>Horários Disponíveis</Text>
              <Text style={styles.dateSub}>Quinta-feira, 24 de Outubro</Text>
            </View>
            <Pressable style={styles.calendarLink}>
              <Text style={styles.calendarLinkText}>Calendário</Text>
              <MaterialCommunityIcons name="calendar-month" size={16} color={ArenaLinkColors.primary} />
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.slotsRow}
            decelerationRate="fast"
            snapToInterval={112}>
            {TIME_SLOTS.map((slot) => (
              <SlotChip key={slot.time} slot={slot} />
            ))}
          </ScrollView>
        </View>

        <View style={styles.amenities}>
          <Text style={styles.amenitiesTitle}>Comodidades</Text>
          <View style={styles.amenitiesWrap}>
            {AMENITIES.map((a) => (
              <View key={a.label} style={styles.amenityPill}>
                <MaterialCommunityIcons name={a.icon} size={22} color="#6bfe9c" />
                <Text style={styles.amenityLabel}>{a.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.topNav, { paddingTop: insets.top }]} pointerEvents="box-none">
        <View style={styles.navInner}>
          <View style={styles.brandRow}>
            <MaterialCommunityIcons name="soccer" size={22} color={ArenaLinkColors.primary} />
            <Text style={styles.brand}>ArenaLink</Text>
          </View>
          <View style={styles.avatarRing}>
            <Image source={{ uri: ArenaLinkImages.profile }} style={styles.avatar} contentFit="cover" />
          </View>
        </View>
      </View>

      <LinearGradient
        colors={[ArenaLinkColors.surfaceDim, 'transparent']}
        locations={[0.45, 1]}
        style={[styles.fabGradient, { paddingBottom: Math.max(16, insets.bottom) }]}
        pointerEvents="box-none">
        <Pressable
          onPress={onReserve}
          style={({ pressed }) => [styles.reserveOuter, pressed && styles.reservePressed]}>
          <LinearGradient
            colors={[ArenaLinkColors.primary, ArenaLinkColors.primaryContainer]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.reserveBtn}>
            <Text style={styles.reserveText}>Reservar Agora</Text>
            <MaterialCommunityIcons name="calendar-plus" size={22} color={ArenaLinkColors.onPrimary} />
          </LinearGradient>
        </Pressable>
      </LinearGradient>
    </View>
  );
}

function SlotChip({ slot }: { slot: Slot }) {
  if (slot.state === 'busy') {
    return (
      <View style={[styles.slot, styles.slotBusy]}>
        <Text style={styles.slotTime}>{slot.time}</Text>
        <Text style={styles.slotStateBusy}>Ocupado</Text>
      </View>
    );
  }
  const selected = slot.state === 'selected';
  return (
    <Pressable
      style={({ pressed }) => [
        styles.slot,
        selected ? styles.slotSelected : styles.slotAvailable,
        pressed && slot.state === 'available' && styles.pressed,
      ]}>
      <Text style={styles.slotTime}>{slot.time}</Text>
      <Text style={[styles.slotState, selected ? styles.slotStateOnPrimary : styles.slotStatePrimary]}>
        Disponível
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: ArenaLinkColors.surfaceDim,
  },
  scrollContent: {
    paddingTop: 0,
  },
  heroWrap: {
    height: 397,
    width: '100%',
    position: 'relative',
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },
  backBtn: {
    position: 'absolute',
    left: 24,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(19, 19, 19, 0.6)',
  },
  heroTextBlock: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 32,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    backgroundColor: ArenaLinkColors.tertiary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 12,
  },
  badgeText: {
    color: ArenaLinkColors.onTertiary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    color: ArenaLinkColors.onSurface,
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: ArenaLinkColors.onSurfaceVariant,
    fontSize: 14,
    fontWeight: '600',
  },
  bento: {
    marginTop: -16,
    paddingHorizontal: 24,
    gap: 16,
    zIndex: 2,
  },
  mainCard: {
    backgroundColor: ArenaLinkColors.surfaceContainerLow,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  sectionTitlePrimary: {
    color: ArenaLinkColors.primary,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  bodyMuted: {
    color: ArenaLinkColors.onSurfaceVariant,
    fontSize: 15,
    lineHeight: 22,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 24,
  },
  statCell: {
    width: '47%',
    backgroundColor: ArenaLinkColors.surfaceContainer,
    borderRadius: 12,
    padding: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  statLabel: {
    color: ArenaLinkColors.onSurfaceVariant,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  statValue: {
    color: ArenaLinkColors.onSurface,
    fontSize: 16,
    fontWeight: '700',
  },
  locationCard: {
    backgroundColor: ArenaLinkColors.surfaceContainerHigh,
    borderRadius: 16,
    padding: 24,
    gap: 4,
  },
  sectionTitle: {
    color: ArenaLinkColors.onSurface,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  mapThumb: {
    height: 128,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    opacity: 0.92,
  },
  address: {
    color: ArenaLinkColors.onSurfaceVariant,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
  },
  directionsBtn: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: ArenaLinkColors.surfaceContainerHighest,
    paddingVertical: 14,
    borderRadius: 10,
  },
  directionsBtnText: {
    color: ArenaLinkColors.primary,
    fontWeight: '700',
    fontSize: 15,
  },
  availability: {
    marginTop: 36,
    paddingHorizontal: 24,
  },
  availabilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  availabilityTitle: {
    color: ArenaLinkColors.onSurface,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  dateSub: {
    color: ArenaLinkColors.onSurfaceVariant,
    fontSize: 13,
    marginTop: 4,
  },
  calendarLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(84, 233, 138, 0.2)',
    paddingBottom: 4,
  },
  calendarLinkText: {
    color: ArenaLinkColors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  slotsRow: {
    gap: 12,
    paddingBottom: 8,
    paddingRight: 24,
  },
  slot: {
    minWidth: 100,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotSelected: {
    backgroundColor: ArenaLinkColors.primaryContainer,
  },
  slotAvailable: {
    backgroundColor: ArenaLinkColors.surfaceContainer,
    borderWidth: 1,
    borderColor: 'rgba(61, 74, 62, 0.35)',
  },
  slotBusy: {
    backgroundColor: ArenaLinkColors.surfaceContainerLow,
    opacity: 0.45,
    borderWidth: 1,
    borderColor: 'rgba(61, 74, 62, 0.25)',
  },
  slotTime: {
    color: ArenaLinkColors.onSurface,
    fontSize: 18,
    fontWeight: '700',
  },
  slotState: {
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: -0.2,
    marginTop: 6,
  },
  slotStateOnPrimary: {
    color: ArenaLinkColors.onPrimaryContainer,
    opacity: 0.75,
  },
  slotStatePrimary: {
    color: ArenaLinkColors.primary,
  },
  slotStateBusy: {
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginTop: 6,
    color: ArenaLinkColors.onSurfaceVariant,
  },
  amenities: {
    marginTop: 36,
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  amenitiesTitle: {
    color: ArenaLinkColors.onSurface,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  amenitiesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  amenityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: ArenaLinkColors.surfaceContainerLow,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 16,
  },
  amenityLabel: {
    color: ArenaLinkColors.onSurface,
    fontSize: 13,
    fontWeight: '600',
  },
  topNav: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    backgroundColor: 'rgba(19, 19, 19, 0.82)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    shadowColor: ArenaLinkColors.primary,
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 6,
  },
  navInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brand: {
    color: ArenaLinkColors.primary,
    fontSize: 20,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: -0.5,
    textTransform: 'uppercase',
  },
  avatarRing: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: ArenaLinkColors.primaryContainer,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  fabGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  reserveOuter: {
    maxWidth: 448,
    width: '100%',
    alignSelf: 'center',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: ArenaLinkColors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  reserveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    borderRadius: 16,
  },
  reservePressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.95,
  },
  reserveText: {
    color: ArenaLinkColors.onPrimary,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.97 }],
  },
});
