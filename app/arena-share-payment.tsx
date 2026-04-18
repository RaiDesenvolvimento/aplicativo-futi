import { ArenaLinkColors } from '@/constants/arena-link-theme';
import { getVenueById } from '@/constants/explore-venues';
import {
  DEMO_PIX_KEY,
  buildPaySlug,
  buildWhatsappInviteText,
  formatBrl,
  paymentUrl,
  perPlayerAmount,
} from '@/lib/payment-share-copy';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Clipboard from 'expo-clipboard';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  Alert,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AVATAR_1 =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBEkTne7gzbHy1rPOQ4qI4S6NYXc5ud2NuExY98wFsh3CEWzXtXruLNNcY5Mh5fbvP28BTq-uKGrdTC91BtLRN5DN-i2Y7N7qibSRqEw_3XdOBEXYiAWEzEGPpnCY3b8Nvhli72FItIB_WbdSeKcpt_b6CK3D_WnvdM9WMM3p7AHpGyUwEOeZKqaERRworYaJN0l0OKNyfB2avBRMgVAKgK--U0iU_OBse99fppaTy9J_CNu2Tu2m26jYoY5SwVLQh7G5ET5yj2Ce4';
const AVATAR_2 =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDZVybMyuAXt2M1R9htnIW5fkRs0Pd0YGRUnf4EXdGBsHNkAx1HNmZNiXBZO9R7cabSjzX4-sF7ljUTGp4m2eHgcPQ3LRvBl3-byhVdowFNGemxSVRzfxb-vEtduxn5DXOuXDBKXf1EhaGOV0jOZ-iYixUfkHRP42EmXxocKYMDR-7Kkolu9g1MHwCAjET8WNmi09Xz7llQP1z6iohrzK2rVqpPTV2LkWwGMsj5WkMHcWsBzKemGqFtduFc9R3JqRVrhPjixQw3u-4';

function openWhatsAppWithText(text: string) {
  const encoded = encodeURIComponent(text);
  const appUrl = `whatsapp://send?text=${encoded}`;
  const webUrl = `https://wa.me/?text=${encoded}`;
  if (Platform.OS === 'web') {
    void Linking.openURL(webUrl);
    return;
  }
  void Linking.canOpenURL(appUrl).then((ok) => {
    void Linking.openURL(ok ? appUrl : webUrl);
  });
}

export default function ArenaSharePaymentScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{
    venueId?: string;
    dateLabel?: string;
    dateShort?: string;
    timeLine?: string;
    totalPaid?: string;
    squadCount?: string;
  }>();

  const [copiedKind, setCopiedKind] = useState<'link' | 'pix' | null>(null);

  const totalPaid = Number(params.totalPaid ?? '0') || 0;
  const squadCount = Number(params.squadCount ?? '0') || 0;
  const dateLabel = params.dateLabel ?? '—';
  const dateShort = params.dateShort ?? dateLabel;
  const timeRange = useMemo(() => {
    const raw = params.timeLine;
    if (!raw) return '—';
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  }, [params.timeLine]);

  const venue = useMemo(() => getVenueById(params.venueId), [params.venueId]);
  const venueName = venue?.name ?? 'Arena';

  const slug = useMemo(
    () => buildPaySlug(params.venueId ?? 'x', totalPaid),
    [params.venueId, totalPaid],
  );
  const payUrl = useMemo(() => paymentUrl(slug), [slug]);

  const perPlayer = perPlayerAmount(totalPaid, squadCount);
  const perPlayerFormatted = formatBrl(perPlayer);
  const totalFormatted = formatBrl(totalPaid);

  const invitePlain = useMemo(
    () =>
      buildWhatsappInviteText({
        venueName,
        dateShort,
        timeRange,
        perPlayerFormatted,
        payUrl,
      }),
    [venueName, dateShort, timeRange, perPlayerFormatted, payUrl],
  );

  const extraAvatars = Math.max(0, squadCount - 2);

  const onCopy = async (kind: 'link' | 'pix', value: string) => {
    try {
      await Clipboard.setStringAsync(value);
      setCopiedKind(kind);
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => setCopiedKind(null), 2000);
    } catch {
      Alert.alert('Não foi possível copiar', 'Tente novamente.');
    }
  };

  const headerPadBottom = 16;
  const headerBlock = insets.top + 56 + headerPadBottom;

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerRow}>
          <View style={styles.brandRow}>
            <MaterialCommunityIcons name="soccer" size={26} color={ArenaLinkColors.primary} />
            <Text style={styles.brand}>ArenaLink</Text>
          </View>
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.75 }]}>
            <MaterialCommunityIcons name="close" size={26} color={ArenaLinkColors.onSurfaceVariant} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingTop: headerBlock, paddingBottom: 32 + insets.bottom }]}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryLeft}>
              <Text style={styles.summaryKicker}>Resumo da Reserva</Text>
              <Text style={styles.summaryTitle}>{venueName}</Text>
              <View style={styles.summaryMeta}>
                <MaterialCommunityIcons name="calendar" size={14} color={ArenaLinkColors.onSurfaceVariant} />
                <Text style={styles.summaryMetaText}>{dateLabel}</Text>
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={14}
                  color={ArenaLinkColors.onSurfaceVariant}
                  style={{ marginLeft: 8 }}
                />
                <Text style={styles.summaryMetaText}>{timeRange}</Text>
              </View>
            </View>
            <View style={styles.summaryRight}>
              <Text style={styles.totalKicker}>Total</Text>
              <Text style={styles.totalValue}>{totalFormatted}</Text>
            </View>
          </View>
        </View>

        <View style={styles.shareHeader}>
          <Text style={styles.shareTitle}>Compartilhar</Text>
          <View style={styles.recommendedPill}>
            <Text style={styles.recommendedText}>Recomendado</Text>
          </View>
        </View>

        <View style={styles.kineticWrap}>
          <LinearGradient
            colors={['rgba(84,233,138,0.45)', 'transparent', 'rgba(46,204,113,0.35)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.kineticBorder}>
            <View style={styles.kineticInner}>
            <View style={styles.waHeader}>
              <View style={styles.waIconBox}>
                <MaterialCommunityIcons name="whatsapp" size={28} color="#25D366" />
              </View>
              <View>
                <Text style={styles.waTitle}>Convite pronto</Text>
                <Text style={styles.waSub}>Prévia da mensagem para o grupo</Text>
              </View>
            </View>

            <View style={styles.previewBox}>
              <Text style={styles.previewText}>
                &quot;Fala time! Quadra agendada na{' '}
                <Text style={styles.previewAccent}>{venueName}</Text> para o dia{' '}
                <Text style={styles.previewAccent}>{dateShort}</Text> às{' '}
                <Text style={styles.previewAccent}>{timeRange}</Text>. O valor por jogador é{' '}
                <Text style={styles.previewAccent}>{perPlayerFormatted}</Text>. Favor realizar o pagamento pelo link
                abaixo para confirmar sua vaga: <Text style={styles.previewLink}>{payUrl}</Text>
                &quot;
              </Text>
            </View>

            <Pressable
              onPress={() => {
                void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                openWhatsAppWithText(invitePlain);
              }}
              style={({ pressed }) => [styles.waCta, pressed && { opacity: 0.94, transform: [{ scale: 0.99 }] }]}>
              <LinearGradient colors={['#25D366', '#128C7E']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.waCtaInner}>
                <MaterialCommunityIcons name="whatsapp" size={22} color="#fff" />
                <Text style={styles.waCtaText}>Compartilhar no WhatsApp</Text>
              </LinearGradient>
            </Pressable>

            <View style={styles.divider} />

            <Pressable
              onPress={() => void onCopy('link', payUrl)}
              style={({ pressed }) => [styles.secondaryBtn, pressed && { opacity: 0.92 }]}>
              <MaterialCommunityIcons name="link-variant" size={22} color={ArenaLinkColors.primary} />
              <Text style={styles.secondaryBtnText}>
                {copiedKind === 'link' ? 'Link copiado!' : 'Copiar Link de Pagamento'}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => void onCopy('pix', DEMO_PIX_KEY)}
              style={({ pressed }) => [styles.tertiaryBtn, pressed && { opacity: 0.92 }]}>
              <MaterialCommunityIcons name="content-copy" size={18} color={ArenaLinkColors.onSurfaceVariant} />
              <Text style={styles.tertiaryBtnText}>
                {copiedKind === 'pix' ? 'Chave copiada!' : 'Copiar Chave PIX'}
              </Text>
            </Pressable>

            <View style={styles.waitingRow}>
              <View style={styles.avatarStack}>
                <Image source={{ uri: AVATAR_1 }} style={[styles.stackAvatar, { zIndex: 2 }]} contentFit="cover" />
                <Image source={{ uri: AVATAR_2 }} style={[styles.stackAvatar, styles.stackAvatarMid]} contentFit="cover" />
                <View style={styles.stackMore}>
                  <Text style={styles.stackMoreText}>+{extraAvatars}</Text>
                </View>
              </View>
              <Text style={styles.waitingLabel}>Aguardando time entrar</Text>
            </View>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.altSection}>
          <Text style={styles.altTitle}>Ou pague o valor total</Text>
          <Pressable
            onPress={() => {
              void Haptics.selectionAsync();
              Alert.alert('Em breve', 'Pagamento com cartão estará disponível em breve.');
            }}
            style={({ pressed }) => [styles.optionRow, pressed && { opacity: 0.95 }]}>
            <View style={styles.optionLeft}>
              <View style={styles.optionIcon}>
                <MaterialCommunityIcons name="credit-card-outline" size={22} color={ArenaLinkColors.onSurfaceVariant} />
              </View>
              <View>
                <Text style={styles.optionTitle}>Pagar com Cartão</Text>
                <Text style={styles.optionSub}>Débito ou Crédito</Text>
              </View>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color={ArenaLinkColors.onSurfaceVariant} />
          </Pressable>
          <Pressable
            onPress={() => {
              void Haptics.selectionAsync();
              Alert.alert('Em breve', 'QR Code PIX na tela em breve.');
            }}
            style={({ pressed }) => [styles.optionRow, pressed && { opacity: 0.95 }]}>
            <View style={styles.optionLeft}>
              <View style={styles.optionIcon}>
                <MaterialCommunityIcons name="qrcode" size={22} color={ArenaLinkColors.onSurfaceVariant} />
              </View>
              <View>
                <Text style={styles.optionTitle}>Pagar via QR Code</Text>
                <Text style={styles.optionSub}>Visualizar código na tela</Text>
              </View>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color={ArenaLinkColors.onSurfaceVariant} />
          </Pressable>
        </View>

        <View style={styles.footer}>
          <View style={styles.trustRow}>
            <View style={styles.trustItem}>
              <MaterialCommunityIcons name="shield-check" size={16} color={ArenaLinkColors.primary} />
              <Text style={styles.trustText}>Seguro</Text>
            </View>
            <View style={styles.trustItem}>
              <MaterialCommunityIcons name="flash" size={16} color={ArenaLinkColors.primary} />
              <Text style={styles.trustText}>Instantâneo</Text>
            </View>
            <View style={styles.trustItem}>
              <MaterialCommunityIcons name="soccer-field" size={16} color={ArenaLinkColors.primary} />
              <Text style={styles.trustText}>Garantido</Text>
            </View>
          </View>
          <Text style={styles.footerLegal}>Tecnologia ArenaLink © 2026</Text>
        </View>
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
    backgroundColor: 'rgba(19,19,19,0.82)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingBottom: 16,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brand: {
    color: ArenaLinkColors.primary,
    fontSize: 20,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: -0.5,
    textTransform: 'uppercase',
  },
  iconBtn: {
    padding: 8,
    borderRadius: 999,
  },
  scroll: {
    paddingHorizontal: 22,
    gap: 26,
  },
  summaryCard: {
    backgroundColor: ArenaLinkColors.surfaceContainerLow,
    borderRadius: 18,
    padding: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(61,74,62,0.12)',
    shadowColor: ArenaLinkColors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 28,
    elevation: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  summaryLeft: { flex: 1 },
  summaryKicker: {
    color: ArenaLinkColors.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  summaryTitle: {
    color: ArenaLinkColors.onSurface,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  summaryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  summaryMetaText: {
    color: ArenaLinkColors.onSurfaceVariant,
    fontSize: 12,
    fontWeight: '600',
  },
  summaryRight: { alignItems: 'flex-end' },
  totalKicker: {
    color: ArenaLinkColors.onSurfaceVariant,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  totalValue: {
    color: ArenaLinkColors.primary,
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  shareHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  shareTitle: {
    color: ArenaLinkColors.onSurface,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  recommendedPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(84,233,138,0.1)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(84,233,138,0.22)',
  },
  recommendedText: {
    color: ArenaLinkColors.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  kineticWrap: {
    borderRadius: 26,
    overflow: 'hidden',
  },
  kineticBorder: {
    borderRadius: 26,
    padding: 1,
  },
  kineticInner: {
    borderRadius: 25,
    backgroundColor: ArenaLinkColors.surfaceContainer,
    padding: 22,
    gap: 18,
  },
  waHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  waIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(37,211,102,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  waTitle: {
    color: ArenaLinkColors.onSurface,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  waSub: {
    color: ArenaLinkColors.onSurfaceVariant,
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  previewBox: {
    backgroundColor: ArenaLinkColors.surfaceContainerLow,
    borderRadius: 16,
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(61,74,62,0.12)',
  },
  previewText: {
    color: ArenaLinkColors.onSurface,
    fontSize: 14,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  previewAccent: {
    color: ArenaLinkColors.primary,
    fontWeight: '800',
    fontStyle: 'italic',
  },
  previewLink: {
    color: ArenaLinkColors.primary,
    fontWeight: '700',
    textDecorationLine: 'underline',
    fontStyle: 'italic',
  },
  waCta: {
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 6,
  },
  waCtaInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
  },
  waCtaText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -0.2,
    textTransform: 'uppercase',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginTop: 4,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 18,
    backgroundColor: ArenaLinkColors.surfaceContainerHigh,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(61,74,62,0.12)',
  },
  secondaryBtnText: {
    color: ArenaLinkColors.onSurface,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  tertiaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(42,42,42,0.55)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(61,74,62,0.08)',
  },
  tertiaryBtnText: {
    color: ArenaLinkColors.onSurfaceVariant,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  waitingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    paddingTop: 6,
  },
  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stackAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: ArenaLinkColors.surfaceContainer,
  },
  stackAvatarMid: {
    marginLeft: -10,
    zIndex: 1,
  },
  stackMore: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginLeft: -10,
    backgroundColor: ArenaLinkColors.surfaceBright,
    borderWidth: 2,
    borderColor: ArenaLinkColors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stackMoreText: {
    fontSize: 10,
    fontWeight: '800',
    color: ArenaLinkColors.onSurfaceVariant,
  },
  waitingLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: ArenaLinkColors.onSurfaceVariant,
  },
  altSection: {
    gap: 10,
    opacity: 0.92,
  },
  altTitle: {
    color: ArenaLinkColors.onSurfaceVariant,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
    paddingHorizontal: 4,
    marginBottom: 4,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 18,
    backgroundColor: ArenaLinkColors.surfaceContainerLow,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(61,74,62,0.12)',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: ArenaLinkColors.surfaceBright,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTitle: {
    color: ArenaLinkColors.onSurface,
    fontSize: 14,
    fontWeight: '800',
  },
  optionSub: {
    color: ArenaLinkColors.onSurfaceVariant,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
    gap: 20,
    paddingVertical: 24,
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 22,
    opacity: 0.45,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  trustText: {
    color: ArenaLinkColors.onSurface,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  footerLegal: {
    fontSize: 9,
    color: ArenaLinkColors.onSurfaceVariant,
    letterSpacing: 2,
    textTransform: 'uppercase',
    opacity: 0.45,
  },
});
