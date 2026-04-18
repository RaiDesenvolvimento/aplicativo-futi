import { ArenaLinkColors } from '@/constants/arena-link-theme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { useCallback } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PROFILE_AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAldC8ZQmmYZJLpXCFCkIPPwdcmJo7DjMgU6dg-pZx6rmXLQzIgk9M2Vkr9nWn46iPC8_MzBrdk5NsNR_kIkFa6WSz4C7g-tFZBJPIZskfJ2Cn5Ra0xLUI9X1Cc_x2Fwtd_fZhZHTzazuB2AAN6dzvUGdX8yDz-T-QiLtYxAl3VFqn2yhr_vS1agz4K7OQRi0aTuvIvrAFrPYFZFi6sk6F_nf7F72pUQAAN6CQM1ZPfZNg7eC_8slvHXspuzuPrd9IP49i_598QzsQ';

const IOS_HEADER_SHADOW = {
  shadowColor: ArenaLinkColors.primary,
  shadowOffset: { width: 0, height: 16 },
  shadowOpacity: 0.08,
  shadowRadius: 28,
};

export default function PerfilTabScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  const toast = useCallback((title: string, msg?: string) => {
    void Haptics.selectionAsync();
    Alert.alert(title, msg ?? 'Em breve no ArenaLink.');
  }, []);

  const headerBlock = insets.top + 56;
  const bottomPad = tabBarHeight + Math.max(insets.bottom, 16) + 24;

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <View style={[styles.header, Platform.OS === 'ios' ? IOS_HEADER_SHADOW : styles.headerAndroid]}>
        <View style={[styles.headerRow, { paddingTop: insets.top }]}>
          <Pressable
            hitSlop={12}
            onPress={() => toast('Menu', 'Navegação lateral em breve.')}
            style={({ pressed }) => [styles.headerBtn, pressed && { opacity: 0.8 }]}>
            <MaterialCommunityIcons name="menu" size={26} color={ArenaLinkColors.primary} />
          </Pressable>
          <Text style={styles.headerTitle}>Perfil do atleta</Text>
          <Pressable
            hitSlop={12}
            onPress={() => toast('Configurações', 'Preferências avançadas em breve.')}
            style={({ pressed }) => [styles.headerBtn, pressed && { opacity: 0.8 }]}>
            <MaterialCommunityIcons name="cog-outline" size={26} color={ArenaLinkColors.primary} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingTop: headerBlock + 12, paddingBottom: bottomPad }]}>
        <View style={styles.identityWrap}>
          <LinearGradient
            colors={[ArenaLinkColors.primary, ArenaLinkColors.primaryContainer]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.identityGlow}
          />
          <View style={styles.identityCard}>
          <View style={styles.avatarBlock}>
            <View style={styles.avatarRing}>
              <Image source={{ uri: PROFILE_AVATAR }} style={styles.avatarImg} contentFit="cover" />
            </View>
            <Pressable
              onPress={() => toast('Editar foto', 'Galeria e câmera em breve.')}
              style={({ pressed }) => [styles.editFab, pressed && { opacity: 0.9 }]}>
              <MaterialCommunityIcons name="pencil" size={16} color={ArenaLinkColors.onPrimary} />
            </Pressable>
          </View>
          <View style={styles.identityText}>
            <Text style={styles.displayName}>Marcus Vane</Text>
            <Text style={styles.email}>m.vane@arenalink.pro</Text>
            <View style={styles.badgeRow}>
              <View style={styles.badgePrimary}>
                <Text style={styles.badgePrimaryText}>Pro Athlete</Text>
              </View>
              <View style={styles.badgeTertiary}>
                <Text style={styles.badgeTertiaryText}>MVP Season</Text>
              </View>
            </View>
          </View>
          </View>
        </View>

        <View style={styles.bento}>
          <View style={styles.customCard}>
            <View style={styles.customHeader}>
              <MaterialCommunityIcons name="palette-outline" size={24} color={ArenaLinkColors.primary} />
              <Text style={styles.cardTitle}>Personalização do app</Text>
            </View>
            <Text style={styles.cardBody}>
              Personalize o ArenaLink com temas de alta energia e fundos dinâmicos.
            </Text>
            <View style={styles.customGrid}>
              <Pressable
                onPress={() => toast('Tema', 'Modo claro/escuro em breve.')}
                style={({ pressed }) => [styles.customTile, pressed && { opacity: 0.92 }]}>
                <MaterialCommunityIcons name="weather-night" size={22} color={ArenaLinkColors.onSurfaceVariant} />
                <Text style={styles.customTileText}>Tema</Text>
              </Pressable>
              <Pressable
                onPress={() => toast('Fundo', 'Papéis de parede em breve.')}
                style={({ pressed }) => [styles.customTile, pressed && { opacity: 0.92 }]}>
                <MaterialCommunityIcons name="image-outline" size={22} color={ArenaLinkColors.onSurfaceVariant} />
                <Text style={styles.customTileText}>Fundo</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.securityCard}>
            <View style={styles.securityIconWrap}>
              <MaterialCommunityIcons name="shield-check" size={36} color={ArenaLinkColors.primary} />
            </View>
            <Text style={styles.securityTitle}>Segurança</Text>
            <Pressable
              onPress={() => toast('Alterar senha', 'Fluxo de redefinição em breve.')}
              style={({ pressed }) => [styles.securityBtn, pressed && { opacity: 0.94 }]}>
              <Text style={styles.securityBtnText}>Alterar senha</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.paymentSection}>
          <View style={styles.paymentHeader}>
            <View>
              <Text style={styles.paymentTitle}>Métodos de pagamento</Text>
              <Text style={styles.paymentSub}>Gerencie a cobrança da assinatura com segurança.</Text>
            </View>
            <Pressable onPress={() => toast('Novo cartão', 'Cadastro de cartão em breve.')} hitSlop={8}>
              <View style={styles.addCardRow}>
                <MaterialCommunityIcons name="plus-circle-outline" size={18} color={ArenaLinkColors.primary} />
                <Text style={styles.addCardText}>Novo cartão</Text>
              </View>
            </Pressable>
          </View>

          <View style={styles.paymentGrid}>
            <LinearGradient
              colors={['#3f3f46', '#18181b']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.creditCard}>
              <View style={styles.cardBlob} pointerEvents="none" />
              <View style={styles.cardTopRow}>
                <MaterialCommunityIcons name="contactless-payment" size={40} color={ArenaLinkColors.onSurfaceVariant} />
                <Text style={styles.visaMark}>VISA</Text>
              </View>
              <Text style={styles.cardPan}>•••• •••• •••• 4242</Text>
              <View style={styles.cardFooter}>
                <View>
                  <Text style={styles.cardMeta}>Titular</Text>
                  <Text style={styles.cardMetaBold}>MARCUS VANE</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.cardMeta}>Validade</Text>
                  <Text style={styles.cardMetaBold}>08/26</Text>
                </View>
              </View>
            </LinearGradient>

            <Pressable
              onPress={() => toast('Cartões', 'Lista e edição em breve.')}
              style={({ pressed }) => [styles.manageDashed, pressed && { borderColor: 'rgba(84,233,138,0.45)' }]}>
              <View style={styles.manageIconCircle}>
                <MaterialCommunityIcons name="credit-card-outline" size={32} color={ArenaLinkColors.outline} />
              </View>
              <Text style={styles.manageLabel}>Gerenciar cartões</Text>
            </Pressable>
          </View>
        </View>

        <LinearGradient
          colors={[ArenaLinkColors.primary, ArenaLinkColors.primaryContainer]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.supportCard}>
          <View style={styles.supportText}>
            <Text style={styles.supportTitle}>Precisa de um assist?</Text>
            <Text style={styles.supportSub}>Nosso time de suporte está ativo e pronto para ajudar.</Text>
          </View>
          <Pressable
            onPress={() => toast('Suporte', 'Chat em breve.')}
            style={({ pressed }) => [styles.supportBtn, pressed && { opacity: 0.95, transform: [{ scale: 0.98 }] }]}>
            <MaterialCommunityIcons name="chat" size={22} color={ArenaLinkColors.primary} />
            <Text style={styles.supportBtnText}>Falar com suporte</Text>
          </Pressable>
        </LinearGradient>
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
    zIndex: 50,
    backgroundColor: 'rgba(9,9,11,0.88)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  headerAndroid: {
    elevation: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    minHeight: 56,
    paddingBottom: 8,
  },
  headerBtn: {
    padding: 8,
    borderRadius: 10,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: ArenaLinkColors.primary,
    fontSize: 17,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: -0.3,
    textTransform: 'uppercase',
  },
  scroll: {
    paddingHorizontal: 22,
    maxWidth: 720,
    alignSelf: 'center',
    width: '100%',
  },
  identityWrap: {
    position: 'relative',
    marginBottom: 28,
    borderRadius: 28,
    overflow: 'visible',
  },
  identityGlow: {
    ...StyleSheet.absoluteFillObject,
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: 29,
    opacity: 0.22,
  },
  identityCard: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 20,
    backgroundColor: ArenaLinkColors.surfaceContainerLow,
    borderRadius: 26,
    padding: 24,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  avatarBlock: {
    position: 'relative',
  },
  avatarRing: {
    width: 128,
    height: 128,
    borderRadius: 64,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: ArenaLinkColors.primaryContainer,
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  editFab: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ArenaLinkColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: ArenaLinkColors.surfaceDim,
  },
  identityText: {
    alignItems: 'center',
    gap: 6,
    width: '100%',
  },
  displayName: {
    color: ArenaLinkColors.onSurface,
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -1,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  email: {
    color: ArenaLinkColors.onSurfaceVariant,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginTop: 8,
  },
  badgePrimary: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(84,233,138,0.12)',
  },
  badgePrimaryText: {
    color: ArenaLinkColors.primary,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  badgeTertiary: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,192,172,0.12)',
  },
  badgeTertiaryText: {
    color: ArenaLinkColors.tertiary,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  bento: {
    gap: 16,
    marginBottom: 20,
  },
  customCard: {
    backgroundColor: ArenaLinkColors.surfaceContainer,
    borderRadius: 18,
    padding: 22,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  cardTitle: {
    color: ArenaLinkColors.onSurface,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.2,
    textTransform: 'uppercase',
  },
  cardBody: {
    color: ArenaLinkColors.onSurfaceVariant,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 18,
  },
  customGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  customTile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: ArenaLinkColors.surfaceContainerHigh,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  customTileText: {
    color: ArenaLinkColors.onSurface,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  securityCard: {
    backgroundColor: ArenaLinkColors.surfaceContainerHigh,
    borderRadius: 18,
    padding: 22,
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(61,74,62,0.12)',
  },
  securityIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(84,233,138,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  securityTitle: {
    color: ArenaLinkColors.onSurface,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  securityBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: ArenaLinkColors.primaryContainer,
    alignItems: 'center',
  },
  securityBtnText: {
    color: ArenaLinkColors.onPrimaryContainer,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  paymentSection: {
    backgroundColor: ArenaLinkColors.surfaceContainerLow,
    borderRadius: 24,
    padding: 22,
    marginBottom: 22,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 12,
    marginBottom: 20,
  },
  paymentTitle: {
    color: ArenaLinkColors.primary,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  paymentSub: {
    color: ArenaLinkColors.onSurfaceVariant,
    fontSize: 13,
    fontWeight: '600',
    maxWidth: 240,
  },
  addCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addCardText: {
    color: ArenaLinkColors.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  paymentGrid: {
    gap: 16,
  },
  creditCard: {
    minHeight: 192,
    borderRadius: 18,
    padding: 20,
    justifyContent: 'space-between',
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(61,74,62,0.25)',
  },
  cardBlob: {
    position: 'absolute',
    right: -36,
    top: -36,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(84,233,138,0.12)',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 1,
  },
  visaMark: {
    fontSize: 22,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: 4,
    color: 'rgba(84,233,138,0.45)',
  },
  cardPan: {
    fontSize: 18,
    letterSpacing: 4,
    color: 'rgba(229,226,225,0.85)',
    fontWeight: '600',
    zIndex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    zIndex: 1,
  },
  cardMeta: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: ArenaLinkColors.onSurfaceVariant,
    marginBottom: 4,
  },
  cardMetaBold: {
    fontSize: 13,
    fontWeight: '800',
    color: ArenaLinkColors.onSurface,
  },
  manageDashed: {
    minHeight: 160,
    borderRadius: 18,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(61,74,62,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(32,31,31,0.5)',
  },
  manageIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: ArenaLinkColors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  manageLabel: {
    color: ArenaLinkColors.outline,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  supportCard: {
    borderRadius: 18,
    padding: 22,
    flexDirection: 'column',
    gap: 18,
    alignItems: 'stretch',
    marginBottom: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,57,25,0.2)',
  },
  supportText: {
    gap: 6,
  },
  supportTitle: {
    color: ArenaLinkColors.onPrimary,
    fontSize: 22,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: -0.5,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  supportSub: {
    color: ArenaLinkColors.onPrimary,
    fontSize: 15,
    fontWeight: '600',
    opacity: 0.92,
    textAlign: 'center',
    lineHeight: 22,
  },
  supportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: ArenaLinkColors.onPrimary,
  },
  supportBtnText: {
    color: ArenaLinkColors.primary,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
});
