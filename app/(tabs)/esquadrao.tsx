import { ArenaLinkColors } from '@/constants/arena-link-theme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useMemo, useState } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Modal,
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

const MANAGER_AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDRe3_zcEULs6kCJl0MdnhI_Q4NHW0KJgxBEVIuxUWBkiEw3P_Hy8hjtIOk2KqoE9Dtvs-lfBs1otIrsO-HJ2SC8lXGVs98L9Og5zKMuzd27DQ6qWcaM_nMprjNNHBpwRqGPrnUa_1Bj8XFm4fp2Ajk32qAQ9TyWLQ75S-GyFOZh55actMoj0DdIgFsmTLwROZrtLzcSQ12a7bOIIEIvQhweZ8GT3Am29m1UJAAiOq1e8vGjnvVHxrb_ROFjLGoD8JMljlA7fQkg60';

type SquadTab = 'meus' | 'controle';

type PlayerRow = {
  id: string;
  name: string;
  role: string;
  image: string | null;
  payment: 'paid' | 'pending';
};

type TeamGroup = {
  id: string;
  name: string;
  players: PlayerRow[];
};

const SEED_PLAYERS: PlayerRow[] = [
  {
    id: '1',
    name: 'Lucas "Bolt" Silva',
    role: 'Atacante',
    payment: 'paid',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDFBub4scCGxi6y5JO1sKnl77q4y5J6am0dvitUqeDoUR2bLnqURnr2cKycYM9yHsc9R3WDzgwmkIkxXf5h8ZUH8xWovyeCUteXwu-JdHCgJtE0PCN998cbRr09k9lndzW98X8gjmxDoRsbQyyuik9VVFVNmcH9OAAVUfwO_YA3Z902M439BYDfy90mvoNFAHqoRcb0jvORBFYAWrtXsLfTpZSSbta3qL3i7lEdF0CsFkDwYuRqKCvtmr7OUASEt_fwIDvdBmLXAyI',
  },
  {
    id: '2',
    name: 'Felipe Guedes',
    role: 'Zagueiro',
    payment: 'pending',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDi2qS2OoJXls-y-VtiZ_UpxhJZTqXaGYXK6_04NBaZA4qeil1POcAA7ePb1b7bvJAa2ARd8UkcoamIDUE1AxBM42gH_usMhtn6QJGWpjxin688AWRAsiHLw090v3DCTzFfBSFDNCCSN4TN1JWQTnRpoitNDJaUlgnqy31mn1hgFhM01Fuk-IZqEb0NlkBoDm2QepNigqqYpucLiP6SxRvIsTbic3oeS_jKgsJa_BPGWZLbhH0cV8U1zj-IVH2KDtwqGqagMLExSow',
  },
  {
    id: '3',
    name: 'Andre Santos',
    role: 'Meio-Campo',
    payment: 'paid',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDO_FQ3uKO3xpws5-6wQl0fjy1ahbBnR-W0WhLj83fD8DxX2V3eFAOOWtbJ_L3hJ0nVCKnjhqxeAzHfJZg-D1Cw92wOKg6iiR38DkdL1ZJKWJvhCqkA_nYZsvqHVPywa3py5afhCZG9H2OSSaWeB8dAmLdFy4VNDjSJuxko5MgZwiQ_PrCdIv3AbcVbSMpkq7BkslV1ry3RFpfxyua8g73-Wp6ESUdi7b40FJ7lCL1nvlEXMmgQn2L8Y6Epm0iGY4tpZm83s6yOlho',
  },
  {
    id: '4',
    name: 'Bruno Costa',
    role: 'Goleiro',
    payment: 'pending',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBUkHj1aNnbxPHkhL87Ke-688bvAaG4VoEBR2O_cutteQ5VAEG_qSrG4-sx9g3agb0qFECbyDMEApLsCX3usKf1dBgc2rKmHZ0xqNxEUEFHMoR3Dlqy0r_nt1e4sVmdoKIEJaA-CVOJY0a6BdLzSZADC9Y0mbSEPYU1HUsnbrv3P_OLOSU90ulg92PPZ3i_HERvIpzuZ7xhpz0XdsKUkN2mUuJQ7rmif_ufNlZRJ4JdWoavYZ3FlZtzn9DEQjfBG60IGB6-Mk8C66o',
  },
  {
    id: '5',
    name: 'Rafael Mendes',
    role: 'Lateral',
    payment: 'paid',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDY8fS95u77mR6DOQduc0YR7zN3ICPTKTkfAPe2-n6Mxcd2737mLIdSLO4Wws7-DVSkFhUTUeTJ2NGfX5CE1weQy03SPcKX1tkhcDbl1NhT81xEfNCiGzv5ZorePXSWyd3vrvG8WzecdzH8_bVmB4LWkoevRv_VHzF6uCVzTvAz64Kwa-ByIlu3FKioDz9hpj1bZdIp_0YF3k12b28chvsa-WMu5mVyTGjHU37uhXUQiWUW1-sd4YDpjDrnIsgXr2HI8VNd9g5nrgE',
  },
  {
    id: '6',
    name: 'Thiago Oliveira',
    role: 'Volante',
    payment: 'paid',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCAj7hINx9t227D1Ba2-O8T2-ub0fJJvIOHs7ffTk9vOznHl_qilwwYUEMBIChiUdy1Wr6G4Kf5GQhZibKPwVt-bVXr9eCUzqAG7f8T9dcndcizAChzbep2pjlzBTAI-AUSp1PZVaShGHjk-5HcdDFbH8uO_b-HGV29McJUBMmv1fhTVH7eDhytCw4J1VMyo_5tXyscOxPbQnLvWBvh3UBXDuZ919pHcXjXIyJhh1A3c6P_E8TzhuCGAbRjJkQrE5DS0C9NX7VigmU',
  },
];

const TOTAL_SLOTS = 12;

const iosSoftShadow = {
  shadowColor: ArenaLinkColors.primary,
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.14,
  shadowRadius: 14,
};

const androidNoBlackElevation = Platform.OS === 'android' ? { elevation: 0 } : { elevation: 3 };

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function PlayerCard({
  player,
  showPayment,
  cardWidth,
  onRemove,
}: {
  player: PlayerRow;
  showPayment: boolean;
  cardWidth: number;
  onRemove?: (id: string) => void;
}) {
  const paid = player.payment === 'paid';
  const initial = player.name.trim().charAt(0).toUpperCase() || '?';

  return (
    <View style={[styles.playerCard, { width: cardWidth }]}>
      <View style={styles.playerLeft}>
        <View style={styles.avatarWrap}>
          {player.image ? (
            <Image source={{ uri: player.image }} style={styles.avatarImg} contentFit="cover" />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>{initial}</Text>
            </View>
          )}
          <View style={[styles.statusDot, paid ? styles.dotPaid : styles.dotPending]}>
            <MaterialCommunityIcons
              name={paid ? 'check' : 'clock-outline'}
              size={12}
              color={paid ? ArenaLinkColors.onPrimary : ArenaLinkColors.onTertiary}
            />
          </View>
        </View>
        <View style={styles.playerText}>
          <Text style={styles.playerName} numberOfLines={2}>
            {player.name}
          </Text>
          <Text style={styles.playerRole}>{player.role}</Text>
        </View>
      </View>
      <View style={styles.playerActions}>
        {showPayment ? (
          <View style={[styles.badge, paid ? styles.badgePaid : styles.badgePending]}>
            <Text style={[styles.badgeText, paid ? styles.badgeTextPaid : styles.badgeTextPending]}>
              {paid ? 'PAGO' : 'PENDENTE'}
            </Text>
          </View>
        ) : null}
        {onRemove ? (
          <Pressable
            hitSlop={10}
            onPress={() => onRemove(player.id)}
            style={({ pressed }) => [styles.removeBtn, pressed && { opacity: 0.7 }]}>
            <MaterialCommunityIcons name="close-circle-outline" size={22} color={ArenaLinkColors.onSurfaceVariant} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

export default function EsquadraoTabScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const [tab, setTab] = useState<SquadTab>('meus');
  const [groups, setGroups] = useState<TeamGroup[]>([
    { id: 'g-default', name: 'Meu time', players: SEED_PLAYERS },
  ]);
  const [activeGroupId, setActiveGroupId] = useState('g-default');

  const [modal, setModal] = useState<'none' | 'group' | 'player'>('none');
  const [groupNameInput, setGroupNameInput] = useState('');
  const [playerNameInput, setPlayerNameInput] = useState('');
  const [playerRoleInput, setPlayerRoleInput] = useState('');

  const activeGroup = useMemo(
    () => groups.find((g) => g.id === activeGroupId) ?? groups[0],
    [groups, activeGroupId],
  );

  const players = activeGroup?.players ?? [];

  const paidCount = players.filter((p) => p.payment === 'paid').length;
  const progress = Math.min(100, Math.round((paidCount / TOTAL_SLOTS) * 100));

  const onTab = useCallback((next: SquadTab) => {
    setTab(next);
    void Haptics.selectionAsync();
  }, []);

  const openNewGroup = () => {
    setGroupNameInput('');
    setModal('group');
  };

  const saveNewGroup = () => {
    const name = groupNameInput.trim();
    if (!name) return;
    const id = uid('g');
    setGroups((prev) => [...prev, { id, name, players: [] }]);
    setActiveGroupId(id);
    setModal('none');
    setGroupNameInput('');
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const saveNewPlayer = () => {
    const name = playerNameInput.trim();
    if (!name) return;
    const role = playerRoleInput.trim() || 'Jogador';
    const newPlayer: PlayerRow = {
      id: uid('p'),
      name,
      role,
      image: null,
      payment: 'pending',
    };
    setGroups((prev) =>
      prev.map((g) => (g.id === activeGroupId ? { ...g, players: [...g.players, newPlayer] } : g)),
    );
    setModal('none');
    setPlayerNameInput('');
    setPlayerRoleInput('');
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const removePlayer = (playerId: string) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === activeGroupId ? { ...g, players: g.players.filter((p) => p.id !== playerId) } : g)),
    );
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const headerBottom = insets.top + 72;
  const bottomPad = tabBarHeight + Math.max(insets.bottom, 12) + 100;
  const fabBottom = tabBarHeight + Math.max(insets.bottom, 12) + 16;
  const showBadges = tab === 'controle';

  const screenW = Dimensions.get('window').width;
  const cardGap = 12;
  const hPad = 22;
  const twoCol = screenW >= 600;
  const cardWidth = twoCol ? (screenW - hPad * 2 - cardGap) / 2 : screenW - hPad * 2;

  const paymentCardStyle = [
    styles.paymentCard,
    Platform.OS === 'ios' ? iosSoftShadow : {},
    androidNoBlackElevation,
  ];

  const fabStyle = [styles.fab, Platform.OS === 'ios' ? styles.fabShadowIos : androidNoBlackElevation];

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <View style={[styles.header, Platform.OS === 'ios' ? styles.headerShadowIos : styles.headerAndroid]}>
        <View style={[styles.headerRow, { paddingTop: insets.top }]}>
          <View style={styles.headerBrand}>
            <View style={styles.managerRing}>
              <Image source={{ uri: MANAGER_AVATAR }} style={styles.managerImg} contentFit="cover" />
            </View>
            <Text style={styles.headerTitle}>Kinetic Squad</Text>
          </View>
          <Pressable
            hitSlop={12}
            onPress={() => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              openNewGroup();
            }}
            style={({ pressed }) => [styles.headerIconBtn, pressed && { opacity: 0.85 }]}>
            <MaterialCommunityIcons name="account-multiple-plus" size={26} color={ArenaLinkColors.primary} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingTop: headerBottom + 8, paddingBottom: bottomPad }]}>
        <Text style={styles.sectionLabel}>Times</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.groupChips}>
          {groups.map((g) => {
            const selected = g.id === activeGroupId;
            return (
              <Pressable
                key={g.id}
                onPress={() => {
                  setActiveGroupId(g.id);
                  void Haptics.selectionAsync();
                }}
                style={({ pressed }) => [
                  styles.groupChip,
                  selected ? styles.groupChipOn : styles.groupChipOff,
                  pressed && { opacity: 0.9 },
                ]}>
                <MaterialCommunityIcons
                  name="shield-half-full"
                  size={18}
                  color={selected ? ArenaLinkColors.onPrimaryFixed : ArenaLinkColors.onSurfaceVariant}
                />
                <Text style={[styles.groupChipText, selected && styles.groupChipTextOn]} numberOfLines={1}>
                  {g.name}
                </Text>
                <Text style={styles.groupChipCount}>{g.players.length}</Text>
              </Pressable>
            );
          })}
          <Pressable
            onPress={openNewGroup}
            style={({ pressed }) => [styles.groupChipAdd, pressed && { opacity: 0.88 }]}>
            <MaterialCommunityIcons name="plus" size={22} color={ArenaLinkColors.primary} />
          </Pressable>
        </ScrollView>

        <View style={styles.tabBar}>
          <Pressable
            onPress={() => onTab('meus')}
            style={({ pressed }) => [
              styles.tabBtn,
              tab === 'meus' ? styles.tabBtnOn : styles.tabBtnOff,
              pressed && { opacity: 0.92 },
            ]}>
            <Text style={[styles.tabBtnText, tab === 'meus' ? styles.tabBtnTextOn : styles.tabBtnTextOff]}>
              Meus Jogadores
            </Text>
          </Pressable>
          <Pressable
            onPress={() => onTab('controle')}
            style={({ pressed }) => [
              styles.tabBtn,
              tab === 'controle' ? styles.tabBtnOn : styles.tabBtnOff,
              pressed && { opacity: 0.92 },
            ]}>
            <Text style={[styles.tabBtnText, tab === 'controle' ? styles.tabBtnTextOn : styles.tabBtnTextOff]}>
              Controle de Squad
            </Text>
          </Pressable>
        </View>

        <LinearGradient
          colors={[ArenaLinkColors.primary, ArenaLinkColors.primaryContainer]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={paymentCardStyle}>
          <View style={styles.decorBlob} pointerEvents="none" />
          <View style={styles.paymentInner}>
            <Text style={styles.paymentKicker}>Status da Reserva Atual · {activeGroup?.name}</Text>
            <Text style={styles.paymentHeadline}>
              {paidCount}/{TOTAL_SLOTS}{' '}
              <Text style={styles.paymentHeadlineSub}>Pagamentos</Text>
            </Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.progressLabel}>Progresso da Arrecadação</Text>
              <Text style={styles.progressPct}>{progress}%</Text>
            </View>
          </View>
        </LinearGradient>

        {players.length === 0 ? (
          <View style={styles.emptyTeam}>
            <MaterialCommunityIcons name="account-group-outline" size={40} color={ArenaLinkColors.outlineVariant} />
            <Text style={styles.emptyTitle}>Nenhum jogador neste time</Text>
            <Text style={styles.emptySub}>Toque no + para adicionar jogadores com nome e posição.</Text>
          </View>
        ) : (
          <View style={[styles.grid, twoCol && styles.gridTwoCol]}>
            {players.map((p) => (
              <PlayerCard
                key={p.id}
                player={p}
                showPayment={showBadges}
                cardWidth={cardWidth}
                onRemove={removePlayer}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <LinearGradient
        colors={['rgba(28,27,27,0.75)', 'rgba(19,19,19,0)', 'transparent']}
        locations={[0, 0.35, 1]}
        style={[styles.bottomFade, { height: 100 + insets.bottom }]}
        pointerEvents="none"
      />

      <Pressable
        onPress={() => {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          setPlayerNameInput('');
          setPlayerRoleInput('');
          setModal('player');
        }}
        style={({ pressed }) => [
          fabStyle,
          { bottom: fabBottom },
          pressed && { transform: [{ scale: 0.96 }] },
        ]}>
        <LinearGradient
          colors={[ArenaLinkColors.primary, ArenaLinkColors.primaryContainer]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fabInner}>
          <MaterialCommunityIcons name="account-plus" size={32} color={ArenaLinkColors.onPrimary} />
        </LinearGradient>
      </Pressable>

      <Modal visible={modal !== 'none'} animationType="fade" transparent onRequestClose={() => setModal('none')}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setModal('none')} />
          <View style={[styles.modalCard, { marginBottom: tabBarHeight + insets.bottom }]}>
            {modal === 'group' ? (
              <>
                <Text style={styles.modalTitle}>Novo time</Text>
                <Text style={styles.modalHint}>Escolha um nome para o grupo (ex.: Pelada quinta).</Text>
                <TextInput
                  value={groupNameInput}
                  onChangeText={setGroupNameInput}
                  placeholder="Nome do time"
                  placeholderTextColor={ArenaLinkColors.outline}
                  style={styles.modalInput}
                />
                <View style={styles.modalActions}>
                  <Pressable onPress={() => setModal('none')} style={styles.modalBtnGhost}>
                    <Text style={styles.modalBtnGhostText}>Cancelar</Text>
                  </Pressable>
                  <Pressable onPress={saveNewGroup} style={styles.modalBtnPrimary}>
                    <Text style={styles.modalBtnPrimaryText}>Criar</Text>
                  </Pressable>
                </View>
              </>
            ) : null}
            {modal === 'player' ? (
              <>
                <Text style={styles.modalTitle}>Adicionar jogador</Text>
                <Text style={styles.modalHint}>Nome e posição (opcional) no time «{activeGroup?.name}».</Text>
                <TextInput
                  value={playerNameInput}
                  onChangeText={setPlayerNameInput}
                  placeholder="Nome do jogador"
                  placeholderTextColor={ArenaLinkColors.outline}
                  style={styles.modalInput}
                />
                <TextInput
                  value={playerRoleInput}
                  onChangeText={setPlayerRoleInput}
                  placeholder="Posição (ex.: Atacante)"
                  placeholderTextColor={ArenaLinkColors.outline}
                  style={styles.modalInput}
                />
                <View style={styles.modalActions}>
                  <Pressable onPress={() => setModal('none')} style={styles.modalBtnGhost}>
                    <Text style={styles.modalBtnGhostText}>Cancelar</Text>
                  </Pressable>
                  <Pressable onPress={saveNewPlayer} style={styles.modalBtnPrimary}>
                    <Text style={styles.modalBtnPrimaryText}>Adicionar</Text>
                  </Pressable>
                </View>
              </>
            ) : null}
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
    backgroundColor: 'rgba(19,19,19,0.92)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  headerShadowIos: {
    ...iosSoftShadow,
  },
  headerAndroid: {
    elevation: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    minHeight: 72,
    paddingBottom: 8,
  },
  headerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  managerRing: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: ArenaLinkColors.primary,
  },
  managerImg: { width: '100%', height: '100%' },
  headerTitle: {
    color: ArenaLinkColors.primary,
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: -0.5,
    textTransform: 'uppercase',
  },
  headerIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    paddingHorizontal: 22,
    maxWidth: 900,
    alignSelf: 'center',
    width: '100%',
  },
  sectionLabel: {
    color: ArenaLinkColors.onSurfaceVariant,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  groupChips: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 16,
    paddingRight: 8,
  },
  groupChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    maxWidth: 220,
  },
  groupChipOn: {
    backgroundColor: ArenaLinkColors.primaryFixed,
    borderColor: 'rgba(84,233,138,0.35)',
  },
  groupChipOff: {
    backgroundColor: ArenaLinkColors.surfaceContainerHigh,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  groupChipText: {
    color: ArenaLinkColors.onSurfaceVariant,
    fontSize: 14,
    fontWeight: '700',
    flexShrink: 1,
  },
  groupChipTextOn: {
    color: ArenaLinkColors.onPrimaryFixed,
  },
  groupChipCount: {
    fontSize: 12,
    fontWeight: '800',
    color: ArenaLinkColors.outline,
  },
  groupChipAdd: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(84,233,138,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ArenaLinkColors.surfaceContainer,
  },
  tabBar: {
    flexDirection: 'row',
    gap: 4,
    padding: 6,
    borderRadius: 14,
    backgroundColor: ArenaLinkColors.surfaceContainerLow,
    marginBottom: 22,
    maxWidth: 420,
    alignSelf: 'center',
    width: '100%',
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabBtnOn: {
    backgroundColor: ArenaLinkColors.surfaceContainer,
  },
  tabBtnOff: {},
  tabBtnText: {
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },
  tabBtnTextOn: {
    color: ArenaLinkColors.primary,
  },
  tabBtnTextOff: {
    color: '#9ca3af',
  },
  paymentCard: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 22,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(84,233,138,0.22)',
  },
  paymentInner: {
    padding: 22,
    position: 'relative',
    zIndex: 2,
  },
  decorBlob: {
    position: 'absolute',
    top: -48,
    right: -36,
    width: 160,
    height: 160,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.1)',
    transform: [{ rotate: '45deg' }],
    zIndex: 0,
  },
  paymentKicker: {
    color: ArenaLinkColors.onPrimaryContainer,
    opacity: 0.9,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  paymentHeadline: {
    color: ArenaLinkColors.onPrimary,
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -1,
    marginBottom: 14,
  },
  paymentHeadlineSub: {
    fontSize: 18,
    fontWeight: '600',
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(0,57,25,0.25)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: ArenaLinkColors.onPrimary,
    minWidth: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  progressLabel: {
    color: ArenaLinkColors.onPrimary,
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.95,
  },
  progressPct: {
    color: ArenaLinkColors.onPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  gridTwoCol: {
    justifyContent: 'flex-start',
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    backgroundColor: ArenaLinkColors.surfaceContainerLow,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  playerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
    minWidth: 0,
  },
  playerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  removeBtn: {
    marginLeft: 4,
  },
  avatarWrap: {
    position: 'relative',
    width: 56,
    height: 56,
  },
  avatarImg: {
    width: 56,
    height: 56,
    borderRadius: 12,
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: ArenaLinkColors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: ArenaLinkColors.primary,
    fontSize: 22,
    fontWeight: '900',
  },
  statusDot: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: ArenaLinkColors.surfaceDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotPaid: {
    backgroundColor: ArenaLinkColors.primary,
  },
  dotPending: {
    backgroundColor: ArenaLinkColors.tertiary,
  },
  playerText: {
    flex: 1,
    minWidth: 0,
  },
  playerName: {
    color: ArenaLinkColors.onSurface,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  playerRole: {
    color: ArenaLinkColors.onSurfaceVariant,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  badgePaid: {
    backgroundColor: 'rgba(84,233,138,0.12)',
    borderColor: 'rgba(84,233,138,0.22)',
  },
  badgePending: {
    backgroundColor: 'rgba(255,192,172,0.12)',
    borderColor: 'rgba(255,192,172,0.22)',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  badgeTextPaid: {
    color: ArenaLinkColors.primary,
  },
  badgeTextPending: {
    color: ArenaLinkColors.tertiary,
  },
  emptyTeam: {
    alignItems: 'center',
    paddingVertical: 36,
    gap: 8,
  },
  emptyTitle: {
    color: ArenaLinkColors.onSurface,
    fontSize: 16,
    fontWeight: '800',
  },
  emptySub: {
    color: ArenaLinkColors.onSurfaceVariant,
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 12,
    lineHeight: 20,
  },
  bottomFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 30,
  },
  fab: {
    position: 'absolute',
    right: 22,
    zIndex: 40,
    width: 62,
    height: 62,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(84,233,138,0.35)',
  },
  fabShadowIos: {
    shadowColor: ArenaLinkColors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  fabInner: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    marginHorizontal: 20,
    backgroundColor: ArenaLinkColors.surfaceContainer,
    borderRadius: 18,
    padding: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  modalTitle: {
    color: ArenaLinkColors.onSurface,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 8,
  },
  modalHint: {
    color: ArenaLinkColors.onSurfaceVariant,
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  modalInput: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: ArenaLinkColors.outlineVariant,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: ArenaLinkColors.onSurface,
    marginBottom: 12,
    backgroundColor: ArenaLinkColors.surfaceContainerLow,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  modalBtnGhost: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  modalBtnGhostText: {
    color: ArenaLinkColors.onSurfaceVariant,
    fontWeight: '700',
    fontSize: 15,
  },
  modalBtnPrimary: {
    backgroundColor: ArenaLinkColors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  modalBtnPrimaryText: {
    color: ArenaLinkColors.onPrimary,
    fontWeight: '800',
    fontSize: 15,
  },
});
