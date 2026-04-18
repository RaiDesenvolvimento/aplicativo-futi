import { ArenaLinkColors } from '@/constants/arena-link-theme';
import { useReservations } from '@/context/reservations-context';
import { getVenueById } from '@/constants/explore-venues';
import { formatPtShortDate } from '@/lib/reservation-types';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PLAYER_IMAGES = {
  ricardo:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBfYs29sdi7NHS82kioNucvVAzRWG-zrWX45vrEg8Lexw_TJ3-0cw-6I7kS5ERr7QAZcOisc_y3NvlphKqrX_DQrU0Z8_dYNkSNB90Sechvf_6k-NFJ1MwMjfnexlRJjM0ia8a5JhsRWB88geAT6b3yqVkI8X0wW1zTot6cYEcnxd8dwfK0eDtRHPRaQzvHic401-kNOO3A1LTK5cvnSSJQ_4oZgPlAOb17UFUHKZnEde5Ng7Ce99iagilT5zE4L10LxBA0DkM4CUQ',
  andre:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCn7OhL-ufxcX1-OxMIpeIO4v-2w8eZVBwZ3kSvi1Zg39faMzN-ycijDjN0MsTr5fITk_C3FxhP90QXGEPBn97CWfeD7VrgvBRSFSnN0-GSAdhIZZn318QneTAXHJZzs-IVZhbucUcGVCs6JB0AkQLdS8udAvHI3ti_LuQdT2hzbXnrvqEpkr6z2Kt6G4UJkAIOvqY0kMlI4DtMDy5ZrLiAa_uIKy9vRsA6Ug7IfxN9gHVVkb6tStCbgdGgw8KNUekM8lJARDLM8jE',
  mariana:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDIPnKuwDjmAWxZGkiyfolxUXkHy_WO1tpkawnIxDapctjz-n-w6KOmL1Wdl6SW4J1jtt1YG3IvFbXfDnv4GMqgHRsk4No0FsDWNNqgO4WdY5FF-pSBYYmMZU-Xry1b9ZPTtOVLLRy36mxHPlAhGaiuazLOuNCElxW5-VeBMBTAE9f7NL7iycr5cOkBke8utK6YcjQZkEZkbIPhLtmRufLGefJQWk__hT41KOKM-BM_F7zEPTaRzBVTrRGrGlp17V8AMz_rKEKd-FQ',
  lucas:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAJRLwuqYn2b2rPYzjDDTsr-Q7qsNv1Y2insxSFf6RsUKe3AVr4rQgP6uLjFTQMxGbEJRCduPqwniHxQMBEwRHe2ZmsnUtuCEKXmXQq8xTqFhuqP_8NQQo7gIib4tXmSd_oEphF-P210GrGkPdeWkkXmWTPbwHX_haFNNrvpuQXTI8Z230O9DInVQG2p4Udecxeek0XtNsblT2krZTV-U1HU7eE9fYaFxh96w59J-K8GwjEdzo5iw4F6YmJua2BKrQaSMgYjloOi0',
} as const;

type PlayerRow = {
  id: string;
  name: string;
  role: string;
  image: string;
  level: number;
  initialSelected?: boolean;
};

const PLAYERS: PlayerRow[] = [
  { id: '1', name: 'Ricardo Santos', role: 'ATACANTE (CAP)', image: PLAYER_IMAGES.ricardo, level: 4, initialSelected: true },
  { id: '2', name: 'André Silva', role: 'MEIO-CAMPO', image: PLAYER_IMAGES.andre, level: 3, initialSelected: true },
  { id: '3', name: 'Mariana Costa', role: 'Goleira', image: PLAYER_IMAGES.mariana, level: 0 },
  { id: '4', name: 'Lucas Ferreira', role: 'Zagueiro', image: PLAYER_IMAGES.lucas, level: 0 },
];

const CAPACITY = 14;
const SPLIT_PER_PLAYER = 90;

function LevelDots({ filled }: { filled: number }) {
  return (
    <View style={styles.levelRow}>
      {[0, 1, 2, 3, 4].map((i) => (
        <View
          key={i}
          style={[styles.levelDot, i < filled ? styles.levelDotOn : styles.levelDotOff]}
        />
      ))}
    </View>
  );
}

export default function ArenaBookingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { addReservation } = useReservations();
  const { venueId } = useLocalSearchParams<{ venueId?: string }>();

  const venue = useMemo(() => getVenueById(venueId), [venueId]);
  const displayName = venue?.name ?? 'Arena';
  const displayImage = venue?.image ?? '';
  const cityLine = 'Rio de Janeiro, RJ';
  const dateLine = '24 Out, 2023';
  const timeLine = '20:00 - 21:00';

  const [selected, setSelected] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    for (const p of PLAYERS) {
      init[p.id] = p.initialSelected ?? false;
    }
    return init;
  });

  const selectedCount = PLAYERS.filter((p) => selected[p.id]).length;
  const totalSplit = selectedCount * SPLIT_PER_PLAYER;
  const fillPct = Math.round((selectedCount / CAPACITY) * 100);
  const progressPct = Math.min(100, Math.max(0, fillPct));

  const togglePlayer = (id: string) => {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const onCloseSquad = () => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (venue) {
      const now = new Date();
      const dateLabel = formatPtShortDate(now);
      const dateShort = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
      const timeStart = timeLine.split(' - ')[0]?.trim() ?? timeLine;
      addReservation({
        venueId: venue.id,
        venueName: displayName,
        imageUri: displayImage,
        dateLabel,
        timeLabel: timeStart,
        totalPaid: totalSplit,
        squadCount: selectedCount,
      });
      router.replace({
        pathname: '/arena-share-payment',
        params: {
          venueId: venue.id,
          dateLabel,
          dateShort,
          timeLine: encodeURIComponent(timeLine),
          totalPaid: String(totalSplit),
          squadCount: String(selectedCount),
        },
      } as Href);
      return;
    }
    router.back();
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} hitSlop={12} style={({ pressed }) => pressed && styles.headerPressed}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={ArenaLinkColors.primary} />
          </Pressable>
          <Text style={styles.headerTitle}>Arena Booking</Text>
        </View>
        <Pressable hitSlop={12} style={({ pressed }) => pressed && styles.headerPressed}>
          <MaterialCommunityIcons name="dots-vertical" size={22} color="#a1a1aa" />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: 120 + insets.bottom }]}>
        <View style={styles.heroCard}>
          <View style={styles.heroImageWrap}>
            {displayImage ? (
              <Image source={{ uri: displayImage }} style={StyleSheet.absoluteFill} contentFit="cover" />
            ) : (
              <View style={[StyleSheet.absoluteFill, styles.heroPlaceholder]} />
            )}
            <LinearGradient
              colors={['transparent', 'rgba(19,19,19,0.2)', ArenaLinkColors.surfaceDim]}
              locations={[0.4, 0.7, 1]}
              style={StyleSheet.absoluteFill}
            />
          </View>
          <View style={styles.heroOverlay}>
            <View style={styles.badgeRow}>
              <View style={styles.badgeLive}>
                <Text style={styles.badgeLiveText}>Live</Text>
              </View>
              <View style={styles.badgePremium}>
                <Text style={styles.badgePremiumText}>Premium Pitch</Text>
              </View>
            </View>
            <Text style={styles.heroName}>{displayName}</Text>
            <View style={styles.metaWrap}>
              <View style={styles.metaItem}>
                <MaterialCommunityIcons name="map-marker" size={18} color={ArenaLinkColors.primary} />
                <Text style={styles.metaText}>{cityLine}</Text>
              </View>
              <View style={styles.metaItem}>
                <MaterialCommunityIcons name="calendar" size={18} color={ArenaLinkColors.primary} />
                <Text style={styles.metaText}>{dateLine}</Text>
              </View>
              <View style={styles.metaItem}>
                <MaterialCommunityIcons name="clock-outline" size={18} color={ArenaLinkColors.primary} />
                <Text style={styles.metaText}>{timeLine}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={[styles.statCell, styles.statCellAccent]}>
            <Text style={styles.statLabel}>Capacidade</Text>
            <Text style={styles.statValue}>14 Jogadores</Text>
          </View>
          <View style={styles.statCell}>
            <Text style={styles.statLabel}>Iluminação</Text>
            <Text style={styles.statValue}>Pro LED 4K</Text>
          </View>
          <View style={styles.statCell}>
            <Text style={styles.statLabel}>Gramado</Text>
            <Text style={styles.statValue}>Sintético G5</Text>
          </View>
          <View style={[styles.statCell, styles.statCellAccent]}>
            <Text style={styles.statLabel}>Vestiário</Text>
            <Text style={styles.statValue}>Incluso</Text>
          </View>
        </View>

        <View style={styles.squadHeader}>
          <View>
            <Text style={styles.squadTitle}>Seu Elenco</Text>
            <Text style={styles.squadSub}>Selecione os atletas para este confronto</Text>
          </View>
          <Pressable style={({ pressed }) => [styles.inviteBtn, pressed && { opacity: 0.9 }]}>
            <MaterialCommunityIcons name="account-plus" size={18} color={ArenaLinkColors.primary} />
            <Text style={styles.inviteBtnText}>CONVIDAR</Text>
          </Pressable>
        </View>

        <View style={styles.playerList}>
          {PLAYERS.map((p) => {
            const isOn = selected[p.id];
            return (
              <Pressable
                key={p.id}
                onPress={() => togglePlayer(p.id)}
                style={({ pressed }) => [
                  styles.playerRow,
                  isOn ? styles.playerRowOn : styles.playerRowOff,
                  pressed && { opacity: 0.92 },
                ]}>
                <View style={styles.playerLeft}>
                  <View style={styles.avatarWrap}>
                    <Image
                      source={{ uri: p.image }}
                      style={[styles.avatar, !isOn && styles.avatarMuted]}
                      contentFit="cover"
                    />
                    {isOn ? (
                      <View style={styles.avatarCheck}>
                        <MaterialCommunityIcons name="check" size={12} color={ArenaLinkColors.onPrimary} />
                      </View>
                    ) : null}
                  </View>
                  <View>
                    <Text style={[styles.playerName, !isOn && styles.playerNameMuted]}>{p.name}</Text>
                    <Text style={[styles.playerRole, isOn ? styles.playerRoleOn : styles.playerRoleOff]}>
                      {p.role}
                    </Text>
                  </View>
                </View>
                <View style={styles.playerRight}>
                  <View style={styles.levelBlock}>
                    <Text style={styles.levelLabel}>Nível</Text>
                    <LevelDots filled={p.level} />
                  </View>
                  {isOn ? (
                    <View style={styles.checkboxOn}>
                      <MaterialCommunityIcons name="check" size={16} color={ArenaLinkColors.onPrimary} />
                    </View>
                  ) : (
                    <View style={styles.checkboxOff} />
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>

        <LinearGradient
          colors={['transparent', 'rgba(84,233,138,0.25)', 'transparent']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.divider}
        />

        <View style={styles.summaryCard}>
          <MaterialCommunityIcons
            name="soccer-field"
            size={120}
            color={ArenaLinkColors.onSurface}
            style={styles.summaryWatermark}
          />
          <View style={styles.summaryInner}>
            <Text style={styles.summaryKicker}>Resumo da Escalação</Text>
            <View style={styles.summaryRow}>
              <View>
                <Text style={styles.summaryBig}>
                  {String(selectedCount).padStart(2, '0')}/{CAPACITY}
                </Text>
                <Text style={styles.summarySmall}>Convocados</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View>
                <Text style={styles.summaryBig}>R$ {totalSplit}</Text>
                <Text style={styles.summarySmall}>Total Rateio</Text>
              </View>
            </View>
            <View style={styles.progressBlock}>
              <View style={styles.progressLabels}>
                <Text style={styles.progressLabelLeft}>Capacidade do Time</Text>
                <Text style={styles.progressLabelRight}>{fillPct}% Preenchido</Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFillWrap, { width: `${progressPct}%` }]}>
                  <LinearGradient
                    colors={[ArenaLinkColors.primary, ArenaLinkColors.primaryContainer]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={StyleSheet.absoluteFill}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <LinearGradient
        colors={[ArenaLinkColors.surfaceDim, 'rgba(19,19,19,0.92)', 'transparent']}
        locations={[0.55, 0.85, 1]}
        style={[styles.bottomFade, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <Pressable onPress={onCloseSquad} style={({ pressed }) => [styles.cta, pressed && { opacity: 0.94, transform: [{ scale: 0.98 }] }]}>
          <LinearGradient
            colors={[ArenaLinkColors.primary, ArenaLinkColors.primaryContainer]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaInner}>
            <Text style={styles.ctaText}>FECHAR TIME</Text>
            <MaterialCommunityIcons name="soccer" size={22} color={ArenaLinkColors.onPrimary} />
          </LinearGradient>
        </Pressable>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: ArenaLinkColors.surfaceDim,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: 'rgba(19,19,19,0.88)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerPressed: { opacity: 0.75 },
  headerTitle: {
    color: ArenaLinkColors.primary,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
    textTransform: 'uppercase',
  },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  heroCard: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 24,
  },
  heroImageWrap: {
    height: 220,
    width: '100%',
  },
  heroPlaceholder: {
    backgroundColor: ArenaLinkColors.surfaceContainer,
  },
  heroOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  badgeLive: {
    backgroundColor: ArenaLinkColors.tertiary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeLiveText: {
    color: ArenaLinkColors.onTertiary,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  badgePremium: {
    backgroundColor: 'rgba(84,233,138,0.22)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgePremiumText: {
    color: ArenaLinkColors.primary,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  heroName: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  metaWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    color: ArenaLinkColors.onSurfaceVariant,
    fontSize: 13,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
  },
  statCell: {
    width: '47%',
    flexGrow: 1,
    backgroundColor: ArenaLinkColors.surfaceContainerLow,
    borderRadius: 14,
    padding: 14,
  },
  statCellAccent: {
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(84,233,138,0.25)',
  },
  statLabel: {
    color: '#71717a',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  statValue: {
    color: ArenaLinkColors.onSurface,
    fontSize: 18,
    fontWeight: '800',
  },
  squadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 18,
  },
  squadTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.3,
    textTransform: 'uppercase',
  },
  squadSub: {
    color: ArenaLinkColors.onSurfaceVariant,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  inviteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: ArenaLinkColors.surfaceContainer,
  },
  inviteBtnText: {
    color: ArenaLinkColors.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  playerList: { gap: 10 },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
  },
  playerRowOn: {
    backgroundColor: ArenaLinkColors.surfaceContainer,
    borderLeftWidth: 4,
    borderLeftColor: ArenaLinkColors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  playerRowOff: {
    backgroundColor: ArenaLinkColors.surfaceContainerLow,
  },
  playerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  avatarWrap: {
    width: 48,
    height: 48,
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarMuted: {
    opacity: 0.55,
  },
  avatarCheck: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: ArenaLinkColors.primary,
    borderWidth: 2,
    borderColor: ArenaLinkColors.surfaceDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerName: {
    color: '#fff',
    fontWeight: '800',
    letterSpacing: -0.2,
    textTransform: 'uppercase',
  },
  playerNameMuted: {
    color: ArenaLinkColors.onSurfaceVariant,
  },
  playerRole: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  playerRoleOn: { color: ArenaLinkColors.primary },
  playerRoleOff: { color: '#71717a' },
  playerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  levelBlock: { alignItems: 'flex-end' },
  levelLabel: {
    color: '#71717a',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  levelRow: { flexDirection: 'row', gap: 2 },
  levelDot: {
    width: 8,
    height: 4,
    borderRadius: 2,
  },
  levelDotOn: { backgroundColor: ArenaLinkColors.primary },
  levelDotOff: { backgroundColor: '#3f3f46' },
  checkboxOn: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: ArenaLinkColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOff: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: ArenaLinkColors.outlineVariant,
  },
  divider: {
    height: 4,
    marginVertical: 22,
    borderRadius: 2,
  },
  summaryCard: {
    backgroundColor: ArenaLinkColors.surfaceContainerHigh,
    borderRadius: 14,
    padding: 20,
    marginBottom: 24,
    overflow: 'hidden',
  },
  summaryWatermark: {
    position: 'absolute',
    right: -12,
    top: -12,
    opacity: 0.06,
  },
  summaryInner: { zIndex: 1 },
  summaryKicker: {
    color: ArenaLinkColors.primary,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2.4,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 24,
  },
  summaryBig: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '900',
  },
  summarySmall: {
    color: '#71717a',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  summaryDivider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    backgroundColor: '#3f3f46',
    marginHorizontal: 4,
  },
  progressBlock: { marginTop: 20 },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabelLeft: {
    color: ArenaLinkColors.onSurfaceVariant,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  progressLabelRight: {
    color: ArenaLinkColors.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: ArenaLinkColors.surfaceContainerHighest,
    overflow: 'hidden',
  },
  progressFillWrap: {
    height: '100%',
    borderRadius: 999,
    minWidth: 4,
    overflow: 'hidden',
  },
  bottomFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  cta: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: ArenaLinkColors.primaryContainer,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 10,
  },
  ctaInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
  },
  ctaText: {
    color: ArenaLinkColors.onPrimary,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: -0.3,
    textTransform: 'uppercase',
  },
});
