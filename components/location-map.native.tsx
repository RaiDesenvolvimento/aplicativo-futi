import type { MapExtraMarker } from '@/components/location-map-types';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, useColorScheme } from 'react-native';

type Props = {
  latitude: number;
  longitude: number;
  latitudeDelta?: number;
  longitudeDelta?: number;
  markerTitle?: string;
  markerDescription?: string;
  /** Marcadores adicionais (ex.: arenas). */
  markers?: MapExtraMarker[];
  /** Quando false, não desenha o marcador principal (útil se só houver arenas). */
  showUserMarker?: boolean;
};

const DEFAULT_DELTA = 0.012;

export function LocationMap({
  latitude,
  longitude,
  latitudeDelta = DEFAULT_DELTA,
  longitudeDelta = DEFAULT_DELTA,
  markerTitle = 'Sua posição',
  markerDescription,
  markers,
  showUserMarker = true,
}: Props) {
  const scheme = useColorScheme();

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude,
        longitude,
        latitudeDelta,
        longitudeDelta,
      }}
      rotateEnabled={false}
      pitchEnabled={false}
      userInterfaceStyle={scheme === 'dark' ? 'dark' : 'light'}>
      {showUserMarker ? (
        <Marker
          coordinate={{ latitude, longitude }}
          title={markerTitle}
          description={markerDescription}
          pinColor="green"
        />
      ) : null}
      {markers?.map((m) => (
        <Marker
          key={String(m.id)}
          coordinate={{ latitude: m.latitude, longitude: m.longitude }}
          title={m.title}
        />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
