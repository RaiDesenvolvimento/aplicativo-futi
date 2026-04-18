import {
  ExploreInteractiveMap,
  type ExploreMapRef,
  type VenuePin,
} from '@/components/explore-interactive-map';
import { ArenaLinkColors, ArenaLinkImages } from '@/constants/arena-link-theme';
import {
  EXPLORE_VENUES,
  SURFACE_LABEL,
  type Surface,
  type Venue,
  haversineKm,
} from '@/constants/explore-venues';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { router, type Href } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.85;
const HEADER_BODY = 56;
const MAP_HEIGHT = 397;

export default function ExploreTabScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const mapRef = useRef<ExploreMapRef>(null);

  const [search, setSearch] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [surfaceFilter, setSurfaceFilter] = useState<Surface | null>(null);
  const [priceSort, setPriceSort] = useState<'none' | 'asc' | 'desc'>('none');
  const [sortByDistance, setSortByDistance] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const headerHeight = useMemo(() => insets.top + HEADER_BODY, [insets.top]);
  const bottomPad = tabBarHeight + Math.max(insets.bottom, 12) + 88;

  const requestUserLocation = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== Location.PermissionStatus.GRANTED) {
      return;
    }
    const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    setUserLocation({
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
    });
  }, []);

  useEffect(() => {
    void requestUserLocation();
  }, [requestUserLocation]);

  const openArena = () => {
    router.push('/arena-detail' as Href);
  };

  const openBooking = (venueId: string) => {
    router.push({ pathname: '/arena-booking', params: { venueId } } as Href);
  };

  const cycleSurface = () => {
    setSurfaceFilter((s) => {
      if (s === null) return 'society';
      if (s === 'society') return 'natural';
      if (s === 'natural') return 'hard';
      return null;
    });
  };

  const cyclePriceSort = () => {
    setSortByDistance(false);
    setPriceSort((p) => (p === 'none' ? 'asc' : p === 'asc' ? 'desc' : 'none'));
  };

  const toggleDistanceSort = () => {
    if (!userLocation) {
      void requestUserLocation();
      return;
    }
    setSortByDistance((d) => !d);
  };

  useEffect(() => {
    if (sortByDistance) setPriceSort('none');
  }, [sortByDistance]);

  const filteredVenues = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = EXPLORE_VENUES.filter((v) => (q ? v.name.toLowerCase().includes(q) : true));
    if (availableOnly) list = list.filter((v) => v.availableNow);
    if (surfaceFilter) list = list.filter((v) => v.surface === surfaceFilter);

    const ul = userLocation;
    if (sortByDistance && ul) {
      list = [...list].sort(
        (a, b) =>
          haversineKm(ul.latitude, ul.longitude, a.lat, a.lng) -
          haversineKm(ul.latitude, ul.longitude, b.lat, b.lng),
      );
    } else if (priceSort === 'asc') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (priceSort === 'desc') {
      list = [...list].sort((a, b) => b.price - a.price);
    }

    return list;
  }, [search, availableOnly, surfaceFilter, priceSort, sortByDistance, userLocation]);

  const mapPins: VenuePin[] = useMemo(
    () =>
      filteredVenues.map((v) => ({
        id: v.id,
        title: v.name,
        latitude: v.lat,
        longitude: v.lng,
      })),
    [filteredVenues],
  );

  const subtitleFor = (v: Venue) => {
    const surface = SURFACE_LABEL[v.surface];
    if (userLocation) {
      const km = haversineKm(userLocation.latitude, userLocation.longitude, v.lat, v.lng).toFixed(1);
      return `${surface} • ${km} km`;
    }
    return `${surface}`;
  };

  const onLocatePress = () => {
    void requestUserLocation().then(() => {
      mapRef.current?.centerOnUser();
    });
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={Platform.OS === 'android'}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.scrollContent, { paddingTop: headerHeight, paddingBottom: bottomPad }]}>
        <View style={styles.searchSection}>
          <View style={styles.searchRow}>
            <MaterialCommunityIcons
              name="map-marker"
              size={22}
              color={ArenaLinkColors.primary}
              style={styles.searchIcon}
            />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Buscar arena por nome..."
              placeholderTextColor={ArenaLinkColors.outlineVariant}
              style={styles.searchInput}
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
            <Pressable
              onPress={() => setAvailableOnly((v) => !v)}
              style={({ pressed }) => [
                styles.chip,
                availableOnly ? styles.chipActive : styles.chipIdle,
                pressed && { opacity: 0.9 },
              ]}>
              <Text style={[styles.chipText, availableOnly ? styles.chipTextActive : styles.chipTextIdle]}>
                Disponível agora
              </Text>
            </Pressable>

            <Pressable
              onPress={cycleSurface}
              style={({ pressed }) => [
                styles.chip,
                surfaceFilter !== null ? styles.chipActive : styles.chipIdle,
                pressed && { opacity: 0.9 },
              ]}>
              <Text style={[styles.chipText, surfaceFilter !== null ? styles.chipTextActive : styles.chipTextIdle]}>
                {surfaceFilter === null ? 'Piso' : `Piso · ${SURFACE_LABEL[surfaceFilter]}`}
              </Text>
            </Pressable>

            <Pressable
              onPress={cyclePriceSort}
              style={({ pressed }) => [
                styles.chip,
                priceSort !== 'none' ? styles.chipActive : styles.chipIdle,
                pressed && { opacity: 0.9 },
              ]}>
              <Text style={[styles.chipText, priceSort !== 'none' ? styles.chipTextActive : styles.chipTextIdle]}>
                {priceSort === 'none' ? 'Preço' : priceSort === 'asc' ? 'Preço ↑' : 'Preço ↓'}
              </Text>
            </Pressable>

            <Pressable
              onPress={toggleDistanceSort}
              style={({ pressed }) => [
                styles.chip,
                sortByDistance ? styles.chipActive : styles.chipIdle,
                pressed && { opacity: 0.9 },
              ]}>
              <Text style={[styles.chipText, sortByDistance ? styles.chipTextActive : styles.chipTextIdle]}>
                Distância{userLocation ? '' : ' · GPS'}
              </Text>
            </Pressable>
          </ScrollView>
        </View>

        <View style={styles.mapOuter}>
          <ExploreInteractiveMap
            ref={mapRef}
            venues={mapPins}
            userLocation={userLocation}
            mapHeight={MAP_HEIGHT}
            onLocatePress={onLocatePress}
          />
        </View>

        <View style={styles.venuesHeader}>
          <View>
            <Text style={styles.venuesKicker}>Quadras próximas</Text>
            <Text style={styles.venuesTitle}>Mais perto de você</Text>
          </View>
          <Pressable
            onPress={() => {
              setAvailableOnly(false);
              setSurfaceFilter(null);
              setPriceSort('none');
              setSortByDistance(false);
              setSearch('');
              setTimeout(() => mapRef.current?.fitVenues(), 100);
            }}
            hitSlop={8}>
            <Text style={styles.viewAll}>Limpar filtros</Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={CARD_WIDTH + 16}
          contentContainerStyle={styles.cardsRow}>
          {filteredVenues.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>Nenhuma arena</Text>
              <Text style={styles.emptySub}>Ajuste os filtros ou a busca.</Text>
            </View>
          ) : (
            filteredVenues.map((v) => (
              <Pressable
                key={v.id}
                onPress={openArena}
                style={({ pressed }) => [styles.venueCardOuter, pressed && { transform: [{ scale: 0.98 }] }]}>
                <View style={styles.venueCard}>
                  <View style={styles.venueImageWrap}>
                    <Image source={{ uri: v.image }} style={StyleSheet.absoluteFill} contentFit="cover" />
                    <View style={styles.ratingPill}>
                      <MaterialCommunityIcons name="star" size={14} color={ArenaLinkColors.primary} />
                      <Text style={styles.ratingText}>{v.rating}</Text>
                    </View>
                  </View>
                  <View style={styles.venueBody}>
                    <View style={styles.venueTopRow}>
                      <View style={{ flex: 1, paddingRight: 8 }}>
                        <Text style={styles.venueName}>{v.name}</Text>
                        <Text style={styles.venueSub}>{subtitleFor(v)}</Text>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.venuePrice}>R$ {v.price}</Text>
                        <Text style={styles.venuePerHour}>Por hora</Text>
                      </View>
                    </View>
                    <Pressable
                      onPress={() => openBooking(v.id)}
                      style={({ pressed }) => [pressed && { opacity: 0.92 }]}
                      hitSlop={{ top: 4, bottom: 4 }}>
                      <LinearGradient
                        colors={[ArenaLinkColors.primary, ArenaLinkColors.primaryContainer]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.bookBtn}>
                        <Text style={styles.bookBtnText}>Reservar esta arena</Text>
                      </LinearGradient>
                    </Pressable>
                  </View>
                </View>
              </Pressable>
            ))
          )}
        </ScrollView>
      </ScrollView>

      <View style={[styles.header, { paddingTop: insets.top }]} pointerEvents="box-none">
        <View style={styles.headerInner}>
          <View style={styles.brandRow}>
            <MaterialCommunityIcons name="soccer" size={26} color={ArenaLinkColors.primary} />
            <Text style={styles.brand}>ArenaLink</Text>
          </View>
          <Pressable onPress={onLocatePress} hitSlop={12}>
            <View style={styles.avatarRing}>
              <Image source={{ uri: ArenaLinkImages.homeProfile }} style={styles.avatar} contentFit="cover" />
            </View>
          </Pressable>
        </View>
      </View>

      <Pressable
        onPress={() => {
          void requestUserLocation().then(() => mapRef.current?.centerOnUser());
        }}
        style={({ pressed }) => [
          styles.fab,
          {
            bottom: tabBarHeight + Math.max(12, insets.bottom) + 12,
          },
          pressed && { transform: [{ scale: 0.92 }] },
        ]}>
        <MaterialCommunityIcons name="crosshairs-gps" size={28} color={ArenaLinkColors.onPrimary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: ArenaLinkColors.surfaceDim,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    backgroundColor: 'rgba(19, 19, 19, 0.82)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    shadowColor: ArenaLinkColors.primary,
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.1,
    shadowRadius: 32,
    elevation: 8,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
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
  avatar: { width: '100%', height: '100%' },
  searchSection: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 20,
    gap: 20,
  },
  searchRow: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: ArenaLinkColors.surfaceContainerLowest,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  searchIcon: { position: 'absolute', left: 14, zIndex: 1 },
  searchInput: {
    flex: 1,
    paddingVertical: 16,
    paddingLeft: 48,
    paddingRight: 16,
    fontSize: 15,
    fontWeight: '600',
    color: ArenaLinkColors.onSurface,
    borderRadius: 14,
  },
  chipsRow: {
    gap: 10,
    paddingRight: 24,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
  },
  chipActive: {
    backgroundColor: ArenaLinkColors.primaryFixed,
  },
  chipIdle: {
    backgroundColor: ArenaLinkColors.surfaceContainerHigh,
  },
  chipText: { fontSize: 13, fontWeight: '700' },
  chipTextActive: {
    color: ArenaLinkColors.onPrimaryFixed,
    letterSpacing: -0.2,
  },
  chipTextIdle: {
    color: ArenaLinkColors.onSurfaceVariant,
    fontWeight: '600',
  },
  mapOuter: {
    paddingHorizontal: 16,
    marginBottom: 28,
  },
  venuesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    marginBottom: 14,
  },
  venuesKicker: {
    color: ArenaLinkColors.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  venuesTitle: {
    color: ArenaLinkColors.onSurface,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  viewAll: {
    color: ArenaLinkColors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  cardsRow: {
    paddingHorizontal: 24,
    paddingBottom: 8,
    gap: 16,
  },
  emptyCard: {
    width: SCREEN_WIDTH - 48,
    padding: 24,
    borderRadius: 18,
    backgroundColor: ArenaLinkColors.surfaceContainer,
  },
  emptyTitle: {
    color: ArenaLinkColors.onSurface,
    fontWeight: '800',
    fontSize: 17,
    marginBottom: 6,
  },
  emptySub: {
    color: ArenaLinkColors.onSurfaceVariant,
    fontSize: 14,
  },
  venueCardOuter: {
    width: CARD_WIDTH,
  },
  venueCard: {
    backgroundColor: ArenaLinkColors.surfaceContainer,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  venueImageWrap: {
    height: 192,
    position: 'relative',
  },
  ratingPill: {
    position: 'absolute',
    top: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(19, 19, 19, 0.78)',
  },
  ratingText: {
    color: ArenaLinkColors.onSurface,
    fontSize: 12,
    fontWeight: '800',
  },
  venueBody: {
    padding: 18,
    gap: 14,
  },
  venueTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  venueName: {
    color: ArenaLinkColors.onSurface,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  venueSub: {
    color: ArenaLinkColors.outline,
    fontSize: 13,
    marginTop: 4,
  },
  venuePrice: {
    color: ArenaLinkColors.primary,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  venuePerHour: {
    color: ArenaLinkColors.outlineVariant,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  bookBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  bookBtnText: {
    color: ArenaLinkColors.onPrimary,
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: -0.2,
  },
  fab: {
    position: 'absolute',
    right: 22,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: ArenaLinkColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 40,
    shadowColor: ArenaLinkColors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
});
