import { ArenaLinkColors } from '@/constants/arena-link-theme';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import { Platform, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, type Region } from 'react-native-maps';

export type VenuePin = {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
};

export type ExploreMapRef = {
  centerOnUser: () => void;
  fitVenues: () => void;
};

type Props = {
  venues: VenuePin[];
  userLocation: { latitude: number; longitude: number } | null;
  mapHeight?: number;
  onLocatePress: () => void;
};

const DEFAULT_DELTA = 0.06;
const USER_FOCUS_DELTA = 0.028;

function regionForPoint(lat: number, lng: number, d = DEFAULT_DELTA): Region {
  return {
    latitude: lat,
    longitude: lng,
    latitudeDelta: d,
    longitudeDelta: d,
  };
}

export const ExploreInteractiveMap = forwardRef<ExploreMapRef, Props>(function ExploreInteractiveMap(
  { venues, userLocation, mapHeight = 397, onLocatePress }: Props,
  ref,
) {
  const mapRef = useRef<MapView>(null);
  const scheme = useColorScheme();

  const fitVenues = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    const coords = venues.map((v) => ({ latitude: v.latitude, longitude: v.longitude }));
    if (userLocation) {
      coords.push({ latitude: userLocation.latitude, longitude: userLocation.longitude });
    }

    if (coords.length === 0) {
      map.animateToRegion(regionForPoint(-25.44, -49.28), 300);
      return;
    }
    if (coords.length === 1) {
      map.animateToRegion(regionForPoint(coords[0].latitude, coords[0].longitude, 0.04), 350);
      return;
    }

    map.fitToCoordinates(coords, {
      edgePadding: { top: 72, right: 36, bottom: 100, left: 36 },
      animated: true,
    });
  }, [venues, userLocation]);

  const centerOnUser = useCallback(() => {
    const map = mapRef.current;
    if (!map || !userLocation) {
      onLocatePress();
      return;
    }
    map.animateToRegion(
      {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: USER_FOCUS_DELTA,
        longitudeDelta: USER_FOCUS_DELTA,
      },
      450,
    );
  }, [userLocation, onLocatePress]);

  useImperativeHandle(ref, () => ({ centerOnUser, fitVenues }), [centerOnUser, fitVenues]);

  useEffect(() => {
    const t = setTimeout(() => fitVenues(), 350);
    return () => clearTimeout(t);
  }, [fitVenues]);

  const initial = userLocation
    ? regionForPoint(userLocation.latitude, userLocation.longitude)
    : venues[0]
      ? regionForPoint(venues[0].latitude, venues[0].longitude)
      : regionForPoint(-25.44, -49.28);

  return (
    <View style={[styles.wrap, { height: mapHeight }]}>
      <MapView
        ref={mapRef}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        style={StyleSheet.absoluteFill}
        initialRegion={initial}
        rotateEnabled={false}
        pitchEnabled={false}
        scrollEnabled
        zoomEnabled
        zoomTapEnabled
        showsUserLocation={!!userLocation}
        showsMyLocationButton={false}
        userInterfaceStyle={scheme === 'dark' ? 'dark' : 'light'}
        mapType="standard">
        {venues.map((v) => (
          <Marker
            key={v.id}
            coordinate={{ latitude: v.latitude, longitude: v.longitude }}
            title={v.title}
            pinColor="red"
          />
        ))}
      </MapView>

      <LinearGradient
        colors={['transparent', 'rgba(19,19,19,0.2)', ArenaLinkColors.surfaceDim]}
        locations={[0.15, 0.5, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <View style={styles.badge} pointerEvents="none">
        <Text style={styles.badgeText}>Dados ao vivo</Text>
      </View>

      <Pressable onPress={centerOnUser} style={({ pressed }) => [styles.locateBtn, pressed && { opacity: 0.88 }]}>
        <MaterialCommunityIcons name="crosshairs-gps" size={22} color={ArenaLinkColors.onPrimary} />
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 26,
    overflow: 'hidden',
    backgroundColor: ArenaLinkColors.surfaceContainerLow,
  },
  badge: {
    position: 'absolute',
    bottom: 22,
    left: 22,
    backgroundColor: ArenaLinkColors.tertiary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  badgeText: {
    color: ArenaLinkColors.onTertiary,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  locateBtn: {
    position: 'absolute',
    bottom: 22,
    right: 22,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: ArenaLinkColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: ArenaLinkColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
});
