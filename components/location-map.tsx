import type { MapExtraMarker } from '@/components/location-map-types';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StyleSheet, View } from 'react-native';

type Props = {
  latitude: number;
  longitude: number;
  latitudeDelta?: number;
  longitudeDelta?: number;
  markerTitle?: string;
  markerDescription?: string;
  markers?: MapExtraMarker[];
  showUserMarker?: boolean;
};

/** Web: tiles nativas do react-native-maps não são suportadas pelo fluxo Expo típico. */
export function LocationMap({
  latitude,
  longitude,
  markers,
  showUserMarker = true,
}: Props) {
  return (
    <ThemedView style={styles.placeholder}>
      <ThemedText type="defaultSemiBold">Mapa no navegador</ThemedText>
      <ThemedText style={styles.muted}>
        Abra no Android ou iOS (Expo Go ou build) para ver o mapa. Sua posição (referência):{' '}
        {latitude.toFixed(5)}, {longitude.toFixed(5)}
      </ThemedText>
      {markers?.length ? (
        <View style={styles.list}>
          <ThemedText type="defaultSemiBold">Arenas no mapa</ThemedText>
          {markers.map((m) => (
            <ThemedText key={String(m.id)} style={styles.muted}>
              · {m.title}
            </ThemedText>
          ))}
        </View>
      ) : null}
      {!showUserMarker ? (
        <ThemedText style={styles.muted}>Marcador &quot;Você&quot; oculto nesta vista.</ThemedText>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  muted: {
    opacity: 0.85,
  },
  list: {
    marginTop: 12,
    gap: 4,
    alignSelf: 'stretch',
  },
});
