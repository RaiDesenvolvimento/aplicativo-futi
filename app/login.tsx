import { useAuth } from '@/context/auth-context';
import { Lexend_700Bold, Lexend_800ExtraBold, Lexend_900Black } from '@expo-google-fonts/lexend';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as Haptics from 'expo-haptics';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const C = {
  surface: '#131313',
  onSurface: '#e5e2e1',
  primary: '#54e98a',
  primaryContainer: '#2ecc71',
  surfaceContainerLow: '#1c1b1b',
  surfaceContainer: '#201f1f',
  surfaceContainerHighest: '#353534',
  surfaceContainerLowest: '#0e0e0e',
  onSurfaceVariant: '#bbcbbb',
  outlineVariant: '#3d4a3e',
  surfaceContainerHigh: '#2a2a2a',
  surfaceBright: '#393939',
  onPrimary: '#003919',
  tertiary: '#ffc0ac',
} as const;

const STADIUM_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCQjHp8-wcZYF1FUOd7iahZnzrGHvZ0b0J1FStpLu7dCK6ZPwoo2FjCHyooFWClqdlleYPRuFkGYtWgd-Pgz55vS-3MhtdPnCCWuTEPH9EcsTfIv8HATzj8eh9FcVODA-EVO4Oj6xrEY43foVr4mEDLWxV3jAJjmib6m12218hNOfoe-Ao8LqCeJz8cESsydxAfbU11ehSX99dE9d6yD_9-cZjBMhCNLjTkGdKqCznKtxYZtsfFKyLAlaED0nQoSNRT8MrTg-GVDNo';

const GOOGLE_LOGO_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAOpnoOtY3Ix5aH0pGUMCZRFyJRoGC1Nr9EmFI7mSxfALdqGmkPH45KB_SA9du0bTU4UjFiRedoCb_At2M3q-fs6CH7ai3ZuN2NfQNuOML-KAlF1D08KdglyVnfkFZ2kZUjn69yy3NhBTrctF9bZAjmCY5a-WRqxkbwOjwZcfDKwO4EBNWKZDB9gRXPOV1pks54E2siZTwGGcv5ZYbCkds3pXIJgrTBFjZQ0mYJH3_TZ_bdPS3-Z9gMoXGU2S41h8lTeh4sbHp29o8';

function KineticOrb({ style, color }: { style: object; color: string }) {
  return <View style={[style, { backgroundColor: color }]} />;
}

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [fontsLoaded] = useFonts({
    Lexend_700Bold,
    Lexend_800ExtraBold,
    Lexend_900Black,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  const onSubmit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await signIn(email, password);
      router.replace('/(tabs)');
    } finally {
      setSubmitting(false);
    }
  }, [email, password, router, signIn, submitting]);

  const toastSoon = useCallback((title: string) => {
    void Haptics.selectionAsync();
    Alert.alert(title, 'Em breve no ArenaLink.');
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={[styles.loadingRoot, { paddingTop: insets.top }]}>
        <StatusBar style="light" />
        <ActivityIndicator color={C.primary} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <KineticOrb
        style={[styles.orbPrimary, { top: '-10%', right: '-10%' }]}
        color="rgba(84, 233, 138, 0.12)"
      />
      <KineticOrb
        style={[styles.orbTertiary, { bottom: '-5%', left: '-5%' }]}
        color="rgba(255, 192, 172, 0.08)"
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 48 },
          ]}
          showsVerticalScrollIndicator={false}>
          <View style={styles.column}>
            <View style={styles.brandBlock}>
              <Text style={styles.brandTitle}>ARENALINK</Text>
              <Text style={styles.brandSubtitle}>Apex Kinetic</Text>
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeaderClip}>
                <View style={styles.cardHeaderSkew}>
                  <Image
                    source={{ uri: STADIUM_URI }}
                    style={styles.stadiumImg}
                    contentFit="cover"
                    accessibilityLabel="Cinematic wide shot of a futuristic stadium at night with glowing green neon lights"
                  />
                  <LinearGradient
                    colors={['transparent', C.surfaceContainerLow]}
                    locations={[0.35, 1]}
                    style={StyleSheet.absoluteFill}
                  />
                  <View style={styles.cardHeaderTextBlock}>
                    <Text style={styles.welcomeTitle}>WELCOME BACK</Text>
                    <Text style={styles.welcomeSubtitle}>Step onto the pitch</Text>
                  </View>
                </View>
              </View>

              <View style={styles.cardBody}>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Player Identity</Text>
                  <View
                    style={[
                      styles.inputShell,
                      (emailFocus || email.length > 0) && styles.inputShellActive,
                    ]}>
                    <MaterialIcons
                      name="alternate-email"
                      size={22}
                      color={emailFocus ? C.primary : C.onSurfaceVariant}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      value={email}
                      onChangeText={setEmail}
                      placeholder="Email Address"
                      placeholderTextColor={C.outlineVariant}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      selectionColor={C.primary}
                      onFocus={() => setEmailFocus(true)}
                      onBlur={() => setEmailFocus(false)}
                      style={styles.input}
                    />
                  </View>
                </View>

                <View style={styles.fieldGroup}>
                  <View style={styles.passwordLabelRow}>
                    <Text style={styles.label}>Security Key</Text>
                    <Pressable onPress={() => toastSoon('Forgot password?')} hitSlop={8}>
                      <Text style={styles.linkSmall}>Forgot password?</Text>
                    </Pressable>
                  </View>
                  <View
                    style={[
                      styles.inputShell,
                      (passwordFocus || password.length > 0) && styles.inputShellActive,
                    ]}>
                    <MaterialIcons
                      name="lock"
                      size={22}
                      color={passwordFocus ? C.primary : C.onSurfaceVariant}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Password"
                      placeholderTextColor={C.outlineVariant}
                      secureTextEntry
                      selectionColor={C.primary}
                      onFocus={() => setPasswordFocus(true)}
                      onBlur={() => setPasswordFocus(false)}
                      style={styles.input}
                    />
                  </View>
                </View>

                <Pressable
                  onPress={() => void onSubmit()}
                  disabled={submitting}
                  style={({ pressed }) => [
                    styles.submitWrap,
                    pressed && styles.submitPressed,
                    submitting && { opacity: 0.85 },
                  ]}>
                  <LinearGradient
                    colors={[C.primary, C.primaryContainer]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.submitGradient}>
                    <Text style={styles.submitText}>ENTER ARENA</Text>
                    <MaterialIcons name="bolt" size={22} color={C.onPrimary} />
                  </LinearGradient>
                </Pressable>

                <View style={styles.dividerWrap}>
                  <View style={styles.dividerLine} />
                  <View style={styles.dividerPill}>
                    <Text style={styles.dividerPillText}>Team Access</Text>
                  </View>
                </View>

                <View style={styles.socialRow}>
                  <Pressable
                    onPress={() => toastSoon('Google')}
                    style={({ pressed }) => [styles.socialBtn, pressed && { opacity: 0.92 }]}>
                    <Image source={{ uri: GOOGLE_LOGO_URI }} style={styles.googleIcon} contentFit="contain" />
                    <Text style={styles.socialBtnText}>Google</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => toastSoon('Apple')}
                    style={({ pressed }) => [styles.socialBtn, pressed && { opacity: 0.92 }]}>
                    <Ionicons name="logo-apple" size={20} color={C.onSurface} />
                    <Text style={styles.socialBtnText}>Apple</Text>
                  </Pressable>
                </View>

                <Text style={styles.footerRoster}>
                  New to the roster?{' '}
                  <Text onPress={() => toastSoon('Create an account')} style={styles.footerRosterLink}>
                    Create an account
                  </Text>
                </Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View>
                <Text style={styles.statsLabel}>System Status</Text>
                <View style={styles.statsLiveRow}>
                  <View style={styles.statsDot} />
                  <Text style={styles.statsValue}>Live Pitch</Text>
                </View>
              </View>
              <View style={styles.statsRight}>
                <Text style={styles.statsLabel}>Global Sync</Text>
                <Text style={styles.statsValue}>v2.4.0-kinetic</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={[styles.cornerDecor, { bottom: insets.bottom }]} pointerEvents="none">
        <MaterialIcons name="sports-basketball" size={96} color={C.primary} style={{ opacity: 0.1 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingRoot: {
    flex: 1,
    backgroundColor: C.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  root: {
    flex: 1,
    backgroundColor: C.surface,
    overflow: 'hidden',
  },
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 48,
  },
  column: {
    width: '100%',
    maxWidth: 448,
    alignSelf: 'center',
  },
  orbPrimary: {
    position: 'absolute',
    width: 500,
    height: 500,
    borderRadius: 250,
    overflow: 'hidden',
  },
  orbTertiary: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    overflow: 'hidden',
  },
  brandBlock: {
    marginBottom: 48,
    alignItems: 'center',
  },
  brandTitle: {
    fontFamily: 'Lexend_900Black',
    fontSize: 44,
    lineHeight: 48,
    letterSpacing: -1.5,
    color: C.primary,
    textTransform: 'uppercase',
  },
  brandSubtitle: {
    marginTop: 4,
    fontFamily: 'Lexend_700Bold',
    fontSize: 18,
    letterSpacing: 4,
    color: 'rgba(84, 233, 138, 0.4)',
    textTransform: 'uppercase',
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: C.surfaceContainerLow,
    borderBottomWidth: 4,
    borderBottomColor: C.primary,
    ...Platform.select({
      ios: {
        shadowColor: '#4ae183',
        shadowOffset: { width: 0, height: 32 },
        shadowOpacity: 0.08,
        shadowRadius: 64,
      },
      android: { elevation: 12 },
    }),
  },
  cardHeaderClip: {
    height: 128,
    overflow: 'hidden',
    backgroundColor: C.surfaceContainerHighest,
  },
  cardHeaderSkew: {
    height: 170,
    marginTop: -22,
    transform: [{ skewY: '-5deg' }],
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  stadiumImg: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.45,
  },
  cardHeaderTextBlock: {
    position: 'absolute',
    left: 24,
    bottom: 16,
    transform: [{ skewY: '5deg' }],
  },
  welcomeTitle: {
    fontFamily: 'Lexend_800ExtraBold',
    fontSize: 24,
    color: C.onSurface,
    letterSpacing: -0.5,
  },
  welcomeSubtitle: {
    marginTop: 4,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 11,
    letterSpacing: 1.6,
    color: C.onSurfaceVariant,
    textTransform: 'uppercase',
  },
  cardBody: {
    paddingHorizontal: 32,
    paddingTop: 20,
    paddingBottom: 32,
  },
  fieldGroup: {
    marginBottom: 22,
  },
  label: {
    marginLeft: 4,
    marginBottom: 8,
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 10,
    letterSpacing: 3,
    color: C.onSurfaceVariant,
    textTransform: 'uppercase',
  },
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  linkSmall: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 10,
    letterSpacing: 2,
    color: C.primary,
    textTransform: 'uppercase',
  },
  inputShell: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.surfaceContainerLowest,
    borderRadius: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    paddingVertical: 4,
  },
  inputShellActive: {
    backgroundColor: C.surfaceContainer,
    borderBottomColor: C.primary,
  },
  inputIcon: {
    marginLeft: 14,
    marginRight: 6,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingRight: 16,
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 16,
    color: C.onSurface,
  },
  submitWrap: {
    marginTop: 8,
    borderRadius: 8,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#54e98a',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
      },
      android: { elevation: 6 },
    }),
  },
  submitPressed: {
    transform: [{ scale: 0.98 }],
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  submitText: {
    fontFamily: 'Lexend_900Black',
    fontSize: 18,
    letterSpacing: -0.3,
    color: C.onPrimary,
    textTransform: 'uppercase',
  },
  dividerWrap: {
    marginVertical: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dividerLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(61, 74, 62, 0.35)',
  },
  dividerPill: {
    backgroundColor: C.surfaceContainerLow,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  dividerPillText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 11,
    letterSpacing: 3,
    color: C.onSurfaceVariant,
    textTransform: 'uppercase',
  },
  socialRow: {
    flexDirection: 'row',
    gap: 16,
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: C.surfaceContainerHigh,
    borderRadius: 8,
  },
  socialBtnText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 14,
    color: C.onSurface,
  },
  googleIcon: {
    width: 20,
    height: 20,
  },
  footerRoster: {
    marginTop: 36,
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 14,
    color: C.onSurfaceVariant,
  },
  footerRosterLink: {
    fontFamily: 'PlusJakartaSans_700Bold',
    color: C.primary,
    textDecorationLine: 'underline',
    textDecorationColor: C.primary,
  },
  statsRow: {
    marginTop: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    opacity: 0.5,
  },
  statsRight: { alignItems: 'flex-end' },
  statsLabel: {
    fontFamily: 'Lexend_900Black',
    fontSize: 10,
    letterSpacing: -0.5,
    color: C.outlineVariant,
    textTransform: 'uppercase',
  },
  statsLiveRow: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statsDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.primary,
  },
  statsValue: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 12,
    color: C.onSurface,
    textTransform: 'uppercase',
  },
  cornerDecor: {
    position: 'absolute',
    right: 12,
    bottom: 12,
  },
});
