import {
  Lexend_700Bold,
  Lexend_800ExtraBold,
  Lexend_900Black,
} from '@expo-google-fonts/lexend';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { useCallback } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const C = {
  background: '#131313',
  onBackground: '#e5e2e1',
  primary: '#54e98a',
  primaryContainer: '#2ecc71',
  onPrimary: '#003919',
  surfaceContainer: '#201f1f',
  surfaceContainerLow: '#1c1b1b',
  surfaceContainerHigh: '#2a2a2a',
  surfaceContainerLowest: '#0e0e0e',
  surfaceContainerHighest: '#353534',
  onSurfaceVariant: '#bbcbbb',
  tertiary: '#ffc0ac',
  onTertiary: '#5b1a02',
  tertiaryContainer: '#ff9875',
  secondaryContainer: '#474747',
  outlineVariant: '#3d4a3e',
} as const;

const IMG = {
  hero:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCTNSpMSCuBiieYcxWVGTNoC1uwu3WW384dBbFTFDn7eQYRCTftFj0YhKwg-YgNDVgxthZbIwEuAfYC4yrEBJp2O9s0VBFb8WWdZcw6vNg16E_x3ARWjiymG8kM1eFh3MDezvdiKpLefp33iSYoMh83UvNJNr0W2YfrECV5SkC7IxHLY5Vac36uSDGeOIH_Owq8B4TMHDzes2tnNPPMN2ZYxm9zF0PxrGoHTnrmxZW3gwFSYPhFHTMI4zm-Chzaad_H4vM5yVpcub0',
  flamengo:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDA9pphsedY7ip-_AmSNYchKH7pIJ6apdv03PJmcB8uaxC5-qZqr9Eb1tA20VmtGWJ9vv9B1PDj_RAifDgpPG_dHk3OF1QpP9B-fj5PUdRjWLwMgJF--0JbTvdP3--QzTv1gGS0pMJKSOp1l2nV7LduYdo5cxbg-wIVt6yEQu5UUCkNk0woc5Jhbv-F7GkZe3n7DZ9_xqit18UrbwEl7gxJnIp0WB89Qbn3ooz-O6nWH2bN36MmirXRPJNDODee07n6yl2sSKVsgCk',
  saoPaulo:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBVyPuijRAmSPQth6lkyeOu_nI8tKHBvFJCr__fw64XP_XZxS6zQ4uu4nZ0fJDRRv3ib_rDFTiOfF539OPx2Lcewu767-5gTemaSdOgJKf20SqeNp5t-3Yu3_GZ1smDRzIx4Am3DxXb8AkCdjY6sxMwapZ6N8xNxvZC_xdA472CC5yZKaj2hSl75yd5qCdb9BO-lQ-bD3quP2VlpV874Q72rnXGdNjNfMSEnrFSsUilrLPVioTt7Kl-4AMsB74hvh_bSBKfyIBf1Ao',
  feed1:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD1nehdc_yayNoy8yy_5Ist47mRrhS3dkWPEtz4ve3xAYC4nZQkd1WbTCIH8ayWyjxYJ3L5u2ABln_Qfal52yka5OIaGakhk9hPVrHLomyIFP9HsGRpZCozkwKy87gf4kdATEothaEx1YUTNupm1GNCnG8vF5AT6DabuZx1a4bAWVa6p5aBPWDvgpPBtLrEkbvQSuhBRKn2Z-fzh03YPsiuttjWd0q3mXh54pGaFoDAwErcoYieYQ70TbJuS3fdXA1u3VHNbaOEulM',
  feed3:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuA64Z366H15c_2hM05w_s3FHW-Pk7F3OeIwUfJRdXw3BegrYD0a1lYWrJPE-FZjrKRiNfRhEf8oCkC92y5PXwUid-kxLB4ggjYmpx0LulI5MCltyhRFjA-YptaAgYms0pMUSsAIgBsxaNFio6sOWgW45GkRJhWThs-Sp7SfvKE1tMGJTZbSczzMgFA47Tm3QIQwXAKYs-Q-goubqZDmpDHSRIhcf1Pn2iFGZKgRzzchVH1PcxkP5nc7nutYGTmIGSvwGZdMlSCALJc',
} as const;

export default function FeedScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { width: winW } = useWindowDimensions();
  const wide = winW >= 720;

  const [fontsLoaded] = useFonts({
    Lexend_700Bold,
    Lexend_800ExtraBold,
    Lexend_900Black,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  const soon = useCallback((title = 'ArenaLink') => {
    void Haptics.selectionAsync();
    Alert.alert(title, 'Em breve no ArenaLink.');
  }, []);

  const headerH = 56;
  const topPad = insets.top + headerH;
  const bottomPad = tabBarHeight + Math.max(insets.bottom, 12) + 88;

  if (!fontsLoaded) {
    return (
      <View style={[styles.root, styles.center]}>
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerInner}>
          <Text style={styles.brand}>ArenaLink</Text>
          <Pressable
            onPress={() => soon('Notificações')}
            style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.85 }]}>
            <MaterialIcons name="notifications-none" size={24} color="rgba(255,255,255,0.7)" />
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingTop: topPad, paddingBottom: bottomPad }]}>
        {/* Hero + Quick action */}
        <View style={[styles.heroRow, wide && styles.heroRowWide]}>
          <View style={[styles.heroCard, wide && styles.heroCardWide]}>
            <Image source={{ uri: IMG.hero }} style={StyleSheet.absoluteFill} contentFit="cover" />
            <LinearGradient
              colors={[C.background, 'rgba(19,19,19,0.2)', 'transparent']}
              locations={[0, 0.35, 1]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.heroTextBlock}>
              <View style={styles.badgeTertiary}>
                <Text style={styles.badgeTertiaryText}>Live Now</Text>
              </View>
              <Text style={styles.heroTitle}>
                THE FIELD{'\n'}IS YOURS.
              </Text>
              <Text style={styles.heroSubtitle}>
                Book premium pitches and find amateur leagues in your neighborhood.
              </Text>
            </View>
          </View>

          <View style={[styles.quickCard, wide && styles.quickCardWide]}>
            <View>
              <Text style={styles.quickTitle}>
                QUICK{'\n'}ACTION
              </Text>
              <Text style={styles.quickDesc}>Next game starts in 45 minutes at Stadium West.</Text>
            </View>
            <Pressable
              onPress={() => soon('Reserva')}
              style={({ pressed }) => [styles.reserveBtn, pressed && { transform: [{ scale: 0.98 }] }]}>
              <LinearGradient
                colors={[C.primary, C.primaryContainer]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.reserveBtnGrad}>
                <Text style={styles.reserveBtnText}>RESERVE A SPOT</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>

        {/* Upcoming matches */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <View>
              <Text style={styles.h2}>UPCOMING MATCHES</Text>
              <Text style={styles.mutedSm}>{"Don't miss the kickoff"}</Text>
            </View>
            <Pressable onPress={() => soon('Partidas')} style={styles.viewAll}>
              <Text style={styles.viewAllText}>VIEW ALL</Text>
              <MaterialIcons name="chevron-right" size={16} color={C.primary} />
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled
            contentContainerStyle={styles.carousel}>
            {/* Pro */}
            <View style={styles.matchCard}>
              <View style={styles.matchCardTop}>
                <View style={styles.tagMuted}>
                  <Text style={styles.tagMutedText}>Professional League</Text>
                </View>
                <Text style={styles.timeMuted}>TOMORROW, 21:00</Text>
              </View>
              <View style={styles.vsRow}>
                <View style={styles.teamCol}>
                  <View style={styles.crestWrap}>
                    <Image source={{ uri: IMG.flamengo }} style={styles.crestImg} contentFit="contain" />
                  </View>
                  <Text style={styles.teamName}>FLAMENGO</Text>
                </View>
                <Text style={styles.vsText}>VS</Text>
                <View style={styles.teamCol}>
                  <View style={styles.crestWrap}>
                    <Image source={{ uri: IMG.saoPaulo }} style={styles.crestImg} contentFit="contain" />
                  </View>
                  <Text style={styles.teamName}>SÃO PAULO</Text>
                </View>
              </View>
              <View style={styles.locRow}>
                <MaterialIcons name="place" size={14} color="rgba(255,255,255,0.4)" />
                <Text style={styles.locText}>MARACANÃ STADIUM</Text>
              </View>
            </View>

            {/* Amateur */}
            <View style={[styles.matchCard, styles.matchCardAmateur]}>
              <View style={styles.matchCardTop}>
                <View style={styles.tagPrimary}>
                  <Text style={styles.tagPrimaryText}>Local Amateur</Text>
                </View>
                <Text style={styles.timePrimary}>TODAY, 19:30</Text>
              </View>
              <View style={styles.vsRow}>
                <View style={styles.teamCol}>
                  <View style={styles.iconTeamWrap}>
                    <MaterialIcons name="groups" size={28} color={C.primary} />
                  </View>
                  <Text style={styles.teamNameSm}>TIME DO CARECA</Text>
                </View>
                <Text style={styles.xText}>X</Text>
                <View style={styles.teamCol}>
                  <View style={styles.iconTeamWrap}>
                    <MaterialIcons name="groups" size={28} color={C.primary} />
                  </View>
                  <Text style={styles.teamNameSm}>TIME DOS CABELUDOS</Text>
                </View>
              </View>
              <Pressable onPress={() => soon('Presença')} style={styles.confirmBtn}>
                <Text style={styles.confirmBtnText}>CONFIRM ATTENDANCE</Text>
              </Pressable>
            </View>

            {/* Regional */}
            <View style={styles.matchCard}>
              <View style={styles.matchCardTop}>
                <View style={styles.tagMuted}>
                  <Text style={styles.tagMutedText}>Regional Championship</Text>
                </View>
                <Text style={styles.timeMuted}>SUN, 10:00 AM</Text>
              </View>
              <View style={styles.listTeams}>
                <View style={styles.listTeamRow}>
                  <View style={[styles.letterBall, { backgroundColor: 'rgba(255,152,117,0.2)' }]}>
                    <Text style={[styles.letterBallTxt, { color: C.tertiary }]}>R</Text>
                  </View>
                  <Text style={styles.listTeamName}>REAL MADRUGA FC</Text>
                </View>
                <View style={styles.listTeamRow}>
                  <View style={[styles.letterBall, { backgroundColor: C.secondaryContainer }]}>
                    <Text style={[styles.letterBallTxt, { color: '#c8c6c5' }]}>B</Text>
                  </View>
                  <Text style={styles.listTeamName}>BAYERN DE MOLEQUE</Text>
                </View>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaText}>32 Players Subscribed</Text>
                <Text style={styles.metaText}> • </Text>
                <Text style={styles.metaText}>Arena Central</Text>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Pitch feed */}
        <View style={styles.section}>
          <Text style={[styles.h2, styles.feedTitle]}>THE PITCH FEED</Text>

          <Pressable
            onPress={() => soon('Notícia')}
            style={({ pressed }) => [styles.feedRow, pressed && { backgroundColor: C.surfaceContainer }]}>
            <Image source={{ uri: IMG.feed1 }} style={styles.feedThumb} contentFit="cover" />
            <View style={styles.feedBody}>
              <View style={styles.feedMeta}>
                <Text style={styles.feedTag}>Regional News</Text>
                <Text style={styles.feedTime}>15m ago</Text>
              </View>
              <Text style={styles.feedHeadline}>
                New synthetic turf installed at West Arena. Bookings now open for night sessions.
              </Text>
              <View style={styles.commentsRow}>
                <MaterialIcons name="chat-bubble-outline" size={14} color="rgba(255,255,255,0.4)" />
                <Text style={styles.commentsText}>24 comments</Text>
              </View>
            </View>
          </Pressable>

          <View style={styles.feedAlert}>
            <View style={styles.feedMeta}>
              <Text style={styles.feedTagTertiary}>League Alert</Text>
              <Text style={styles.feedTime}>2h ago</Text>
            </View>
            <Text style={styles.feedAlertTitle}>
              {"CHALLENGE: 'Time do Careca' issued a public challenge to any local team for Friday night."}
            </Text>
            <View style={styles.alertBtns}>
              <Pressable onPress={() => soon('Desafio')} style={styles.btnTertiary}>
                <Text style={styles.btnTertiaryText}>ACCEPT CHALLENGE</Text>
              </Pressable>
              <Pressable onPress={() => soon()} style={styles.btnGhost}>
                <Text style={styles.btnGhostText}>TRASH TALK</Text>
              </Pressable>
            </View>
          </View>

          <Pressable
            onPress={() => soon('Relatório')}
            style={({ pressed }) => [styles.feedRow, pressed && { backgroundColor: C.surfaceContainer }]}>
            <Image source={{ uri: IMG.feed3 }} style={styles.feedThumb} contentFit="cover" />
            <View style={styles.feedBody}>
              <View style={styles.feedMeta}>
                <Text style={styles.feedTagDim}>Professional League</Text>
                <Text style={styles.feedTime}>5h ago</Text>
              </View>
              <Text style={styles.feedHeadline}>
                Transfer window update: Three local stars scouted by State Academy.
              </Text>
              <View style={styles.readMore}>
                <Text style={styles.readMoreText}>READ FULL REPORT</Text>
                <MaterialIcons name="open-in-new" size={12} color={C.primary} />
              </View>
            </View>
          </Pressable>
        </View>

        {/* How it works */}
        <View style={styles.howCard}>
          <View style={styles.howGlow} />
          <Text style={styles.howTitle}>FAST TRACK TO THE GAME.</Text>
          <View style={[styles.howGrid, wide && styles.howGridWide]}>
            <View style={styles.howStep}>
              <View style={styles.howNum}>
                <Text style={styles.howNumText}>01</Text>
              </View>
              <Text style={styles.howStepTitle}>Pick a Court</Text>
              <Text style={styles.howStepDesc}>
                Search by location, surface type, or availability near you.
              </Text>
            </View>
            <View style={styles.howStep}>
              <View style={styles.howNum}>
                <Text style={styles.howNumText}>02</Text>
              </View>
              <Text style={styles.howStepTitle}>Invite the Squad</Text>
              <Text style={styles.howStepDesc}>
                Share the link or invite players directly from your ArenaLink contacts.
              </Text>
            </View>
            <View style={styles.howStep}>
              <View style={styles.howNum}>
                <Text style={styles.howNumText}>03</Text>
              </View>
              <Text style={styles.howStepTitle}>Split & Play</Text>
              <Text style={styles.howStepDesc}>
                Secure automated payments. Everyone pays their share instantly.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <Pressable
        onPress={() => soon('Nova ação')}
        style={({ pressed }) => [
          styles.fab,
          { bottom: tabBarHeight + Math.max(insets.bottom, 8) + 8 },
          pressed && { transform: [{ scale: 0.92 }] },
        ]}>
        <LinearGradient
          colors={[C.primary, C.primaryContainer]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fabInner}>
          <MaterialIcons name="add" size={28} color={C.onPrimary} />
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.background,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    backgroundColor: 'rgba(19,19,19,0.88)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  headerInner: {
    height: 56,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 900,
    width: '100%',
    alignSelf: 'center',
  },
  brand: {
    fontFamily: 'Lexend_900Black',
    fontSize: 22,
    fontStyle: 'italic',
    letterSpacing: -0.5,
    color: C.primary,
  },
  iconBtn: {
    padding: 8,
    borderRadius: 999,
  },
  scrollContent: {
    paddingHorizontal: 24,
    maxWidth: 900,
    width: '100%',
    alignSelf: 'center',
    gap: 48,
  },
  heroRow: {
    gap: 24,
  },
  heroRowWide: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  heroCard: {
    borderRadius: 24,
    overflow: 'hidden',
    minHeight: 300,
    flex: 1,
  },
  heroCardWide: {
    flex: 2,
    minHeight: 320,
  },
  heroTextBlock: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 24,
  },
  badgeTertiary: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: C.tertiary,
    borderRadius: 4,
    marginBottom: 12,
  },
  badgeTertiaryText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 10,
    letterSpacing: 2,
    color: C.onTertiary,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontFamily: 'Lexend_800ExtraBold',
    fontSize: 36,
    lineHeight: 38,
    color: '#fff',
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 12,
    maxWidth: 280,
  },
  quickCard: {
    backgroundColor: C.surfaceContainer,
    borderRadius: 24,
    padding: 32,
    borderLeftWidth: 4,
    borderLeftColor: C.primary,
    justifyContent: 'space-between',
    gap: 20,
    flex: 1,
  },
  quickCardWide: {
    flex: 1,
    minWidth: 200,
  },
  quickTitle: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 24,
    color: C.primary,
    lineHeight: 26,
  },
  quickDesc: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 14,
    color: C.onSurfaceVariant,
    marginTop: 8,
  },
  reserveBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  reserveBtnGrad: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  reserveBtnText: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 15,
    color: C.onPrimary,
  },
  section: {
    gap: 24,
  },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  h2: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 22,
    letterSpacing: -0.3,
    color: C.onBackground,
  },
  mutedSm: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 13,
    color: C.onSurfaceVariant,
    marginTop: 4,
  },
  viewAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewAllText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 11,
    color: C.primary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  carousel: {
    gap: 16,
    paddingVertical: 4,
    paddingRight: 24,
  },
  matchCard: {
    width: 300,
    backgroundColor: C.surfaceContainerLow,
    borderRadius: 20,
    padding: 20,
    marginRight: 4,
  },
  matchCardAmateur: {
    backgroundColor: C.surfaceContainerHigh,
    borderTopWidth: 2,
    borderTopColor: 'rgba(84,233,138,0.3)',
  },
  matchCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  tagMuted: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 4,
  },
  tagMutedText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 10,
    letterSpacing: 1.5,
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
  },
  timeMuted: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
  },
  tagPrimary: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(84,233,138,0.1)',
    borderRadius: 4,
  },
  tagPrimaryText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 10,
    letterSpacing: 1.5,
    color: C.primary,
    textTransform: 'uppercase',
  },
  timePrimary: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 12,
    color: C.primary,
  },
  vsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  teamCol: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  crestWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: C.surfaceContainerHigh,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crestImg: {
    width: '100%',
    height: '100%',
    opacity: 0.85,
  },
  teamName: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 11,
    color: '#fff',
    textAlign: 'center',
  },
  teamNameSm: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 11,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 14,
  },
  vsText: {
    fontFamily: 'Lexend_900Black',
    fontSize: 22,
    color: 'rgba(255,255,255,0.2)',
  },
  xText: {
    fontFamily: 'Lexend_900Black',
    fontSize: 20,
    color: 'rgba(84,233,138,0.4)',
  },
  iconTeamWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: C.surfaceContainerLowest,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 20,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  locText: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 0.5,
  },
  confirmBtn: {
    marginTop: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(84,233,138,0.1)',
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmBtnText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 11,
    color: C.primary,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  listTeams: {
    gap: 14,
  },
  listTeamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  letterBall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  letterBallTxt: {
    fontFamily: 'Lexend_900Black',
    fontSize: 16,
  },
  listTeamName: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 14,
    color: '#fff',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 14,
    gap: 4,
  },
  metaText: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 10,
    color: 'rgba(255,255,255,0.3)',
  },
  feedTitle: {
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  feedRow: {
    flexDirection: 'row',
    gap: 14,
    padding: 16,
    backgroundColor: C.surfaceContainerLow,
    borderRadius: 14,
  },
  feedThumb: {
    width: 96,
    height: 96,
    borderRadius: 10,
  },
  feedBody: {
    flex: 1,
    justifyContent: 'center',
  },
  feedMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  feedTag: {
    fontFamily: 'Lexend_900Black',
    fontSize: 9,
    letterSpacing: 2,
    color: C.primary,
    textTransform: 'uppercase',
  },
  feedTagDim: {
    fontFamily: 'Lexend_900Black',
    fontSize: 9,
    letterSpacing: 2,
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
  },
  feedTagTertiary: {
    fontFamily: 'Lexend_900Black',
    fontSize: 9,
    letterSpacing: 2,
    color: C.tertiary,
    textTransform: 'uppercase',
  },
  feedTime: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 10,
    color: 'rgba(255,255,255,0.3)',
  },
  feedHeadline: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 14,
    color: '#fff',
    marginTop: 6,
    lineHeight: 20,
  },
  commentsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  commentsText: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
  },
  feedAlert: {
    padding: 16,
    backgroundColor: C.surfaceContainerLow,
    borderRadius: 14,
    borderLeftWidth: 4,
    borderLeftColor: C.tertiary,
  },
  feedAlertTitle: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 16,
    color: '#fff',
    marginTop: 8,
    lineHeight: 22,
  },
  alertBtns: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  btnTertiary: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: C.tertiary,
    borderRadius: 999,
  },
  btnTertiaryText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 10,
    color: C.onTertiary,
    textTransform: 'uppercase',
  },
  btnGhost: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 999,
  },
  btnGhostText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
  },
  readMore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  readMoreText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 10,
    color: C.primary,
  },
  howCard: {
    backgroundColor: C.surfaceContainerLow,
    borderRadius: 24,
    padding: 32,
    overflow: 'hidden',
    marginBottom: 8,
  },
  howGlow: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: C.primary,
    opacity: 0.1,
  },
  howTitle: {
    fontFamily: 'Lexend_800ExtraBold',
    fontSize: 28,
    fontStyle: 'italic',
    letterSpacing: -0.5,
    color: C.onBackground,
    marginBottom: 28,
  },
  howGrid: {
    gap: 28,
  },
  howGridWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 20,
  },
  howStep: {
    gap: 14,
    flex: 1,
    minWidth: 160,
  },
  howNum: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(84,233,138,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  howNumText: {
    fontFamily: 'Lexend_900Black',
    fontSize: 18,
    color: C.primary,
  },
  howStepTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 17,
    color: '#fff',
  },
  howStepDesc: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 14,
    color: C.onSurfaceVariant,
    lineHeight: 21,
  },
  fab: {
    position: 'absolute',
    right: 24,
    zIndex: 40,
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
  },
  fabInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
