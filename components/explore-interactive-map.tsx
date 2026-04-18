import { ArenaLinkColors, ArenaLinkImages } from '@/constants/arena-link-theme';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { forwardRef, useImperativeHandle } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

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

/** Web: mapa nativo indisponível; mantém visual e botão de “ir à minha posição” (no-op no mapa). */
export const ExploreInteractiveMap = forwardRef<ExploreMapRef, Props>(function ExploreInteractiveMap(
  { venues, userLocation, mapHeight = 397, onLocatePress }: Props,
  ref,
) {
  useImperativeHandle(ref, () => ({
    centerOnUser: () => {
      onLocatePress();
    },
    fitVenues: () => {},
  }));

  return (
    <View style={[styles.wrap, { height: mapHeight }]}>
      <Image source={{ uri: ArenaLinkImages.homeMapSatellite }} style={StyleSheet.absoluteFill} contentFit="cover" />
      <View style={styles.tint} />
      <LinearGradient
        colors={['transparent', 'rgba(19,19,19,0.25)', ArenaLinkColors.surfaceDim]}
        locations={[0.2, 0.55, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <View style={styles.webNote}>
        <Text style={styles.webNoteText}>
          Mapa com zoom e marcadores disponível no Android e iOS. Arenas listadas: {venues.length}
          {userLocation ? ' · GPS ativo' : ''}
        </Text>
      </View>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Dados ao vivo</Text>
      </View>
      <Pressable onPress={onLocatePress} style={({ pressed }) => [styles.locateBtn, pressed && { opacity: 0.85 }]}>
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
  tint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: ArenaLinkColors.surfaceDim,
    opacity: 0.45,
  },
  webNote: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  webNoteText: {
    color: ArenaLinkColors.onSurfaceVariant,
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 18,
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
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
});
