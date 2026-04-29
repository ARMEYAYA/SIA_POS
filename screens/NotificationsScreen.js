import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { s, vs, ms } from './Scale';
import { useProfile } from './AppContext';
import AlertModal from './AlertModal';

// ── Assets ──
const ASSETS = {
  notifications: require('../assets/notifications.png'),
};

const ALERT_IMAGES = {
  1: require('../assets/Alert1.png'),
  2: require('../assets/Alert2.png'),
  3: require('../assets/Alert3.png'),
};

// ── Sample notification lang yan ah ───
const NEW_NOTIFICATIONS = [
  {
    id: 'n1',
    alertLevel: 1,
    title: 'Alert level 1',
    message: 'Water level is at knee height. Stay alert and monitor updates.',
  },
  {
    id: 'n2',
    alertLevel: 3,
    title: 'Alert level 3',
    message: 'Critical flood level detected. Immediate evacuation is strongly advised.',
  },
];

const DATE_LABEL = 'April 1, 2026';

const OLDER_NOTIFICATIONS = [
  {
    id: 'o1',
    alertLevel: 2,
    title: 'Alert level 2',
    message: 'Water level has reached waist height. Prepare to evacuate and move to safer areas.',
  },
  {
    id: 'o2',
    alertLevel: 1,
    title: 'Alert level 1',
    message: 'Water level is at knee height. Stay alert and monitor updates.',
  },
  {
    id: 'o3',
    alertLevel: 1,
    title: 'Alert level 1',
    message: 'Water level is at knee height. Stay alert and monitor updates.',
  },
];

function NotificationCard({ item, isRead, onPress }) {
  const alertImage = ALERT_IMAGES[item.alertLevel] ?? ALERT_IMAGES[1];

  return (
    <TouchableOpacity
      style={[notif.card, isRead && notif.cardRead]}
      onPress={() => onPress(item)}
      activeOpacity={0.8}
    >
      {!isRead && <View style={notif.unreadDot} />}

      <Image
        source={alertImage}
        style={[notif.alertImage, isRead && notif.alertImageRead]}
        resizeMode="contain"
      />

      <View style={notif.textWrap}>
        <Text style={[notif.title, isRead && notif.titleRead]}>{item.title}</Text>
        <Text style={notif.message} numberOfLines={2}>
          {item.message}
        </Text>
      </View>

      {/* Checkmark badge when read */}
      {isRead && (
        <Ionicons name="checkmark-circle" size={s(16)} color="#13BC21" style={notif.readBadge} />
      )}
    </TouchableOpacity>
  );
}

// ── Main NotificationsScreen ───
export default function NotificationsScreen({ navigation }) {
  const { profile } = useProfile();
  const firstName = profile.name ? profile.name.split(' ')[0] : 'User';

  const [readIds, setReadIds] = useState(new Set());

  const [activeItem, setActiveItem] = useState(null);

  const isRead = (id) => readIds.has(id);

  const handleCardPress = (item) => {
    setReadIds((prev) => new Set([...prev, item.id]));
    setActiveItem(item);
  };

  const handleCloseAlert = () => setActiveItem(null);

  const allNewIds   = NEW_NOTIFICATIONS.map((n) => n.id);
  const allNewRead  = allNewIds.every((id) => readIds.has(id));

  const handleToggleAll = () => {
    if (allNewRead) {
      // Mark all new as unread
      setReadIds((prev) => {
        const next = new Set(prev);
        allNewIds.forEach((id) => next.delete(id));
        return next;
      });
    } else {
      // Mark all new as read
      setReadIds((prev) => new Set([...prev, ...allNewIds]));
    }
  };

  const unreadCount = allNewIds.filter((id) => !readIds.has(id)).length;

  return (
    <SafeAreaView style={styles.safe}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={s(26)} color="#0A3564" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('ProfileScreen')}
          activeOpacity={0.8}
          style={styles.avatarWrap}
        >
          {profile.avatarUri ? (
            <Image source={{ uri: profile.avatarUri }} style={styles.avatarImg} />
          ) : (
            <Ionicons name="person-circle-outline" size={s(44)} color="#2200ff" />
          )}
        </TouchableOpacity>

        <Text style={styles.greeting}>Hello, {firstName} !</Text>

        <View style={styles.iconBtn}>
          <Image
            source={ASSETS.notifications}
            style={styles.headerIcon}
            resizeMode="contain"
          />
          {/* Live unread badge on the bell */}
          {unreadCount > 0 && (
            <View style={styles.bellBadge}>
              <Text style={styles.bellBadgeTxt}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.sectionRow}>
          <View style={styles.sectionLeft}>
            <Text style={styles.sectionTitle}>New</Text>

            {unreadCount > 0 && (
              <View style={styles.countPill}>
                <Text style={styles.countPillTxt}>{unreadCount}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            onPress={handleToggleAll}
            activeOpacity={0.7}
            style={styles.markBtn}
          >
            <Ionicons
              name={allNewRead ? 'mail-unread-outline' : 'mail-open-outline'}
              size={s(13)}
              color="#0A3564"
              style={{ marginRight: s(3) }}
            />
            <Text style={styles.markTxt}>
              {allNewRead ? 'Mark as Unread' : 'Mark as Read'}
            </Text>
          </TouchableOpacity>
        </View>

        {NEW_NOTIFICATIONS.map((item) => (
          <NotificationCard
            key={item.id}
            item={item}
            isRead={isRead(item.id)}
            onPress={handleCardPress}
          />
        ))}

        <Text style={styles.dateLabel}>{DATE_LABEL}</Text>

        {OLDER_NOTIFICATIONS.map((item) => (
          <NotificationCard
            key={item.id}
            item={item}
            isRead={isRead(item.id)}
            onPress={handleCardPress}
          />
        ))}

        <TouchableOpacity style={styles.seeMoreWrap} activeOpacity={0.7}>
          <Text style={styles.seeMore}>See more</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ── Alert Popup ── */}
      <AlertModal
        visible={activeItem !== null}
        alertLevel={activeItem?.alertLevel ?? null}
        alertImage={activeItem ? ALERT_IMAGES[activeItem.alertLevel] : null}
        onClose={handleCloseAlert}
        onStayUpdated={handleCloseAlert}
      />
    </SafeAreaView>
  );
}

// ── Styles ──
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(17),
    marginTop: vs(12),
    height: vs(49),
  },
  backBtn: {
    width: s(32),
    height: s(32),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(2),
  },
  avatarWrap: {
    width: s(44),
    height: s(44),
    borderRadius: s(22),
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(8),
  },
  avatarImg: {
    width: s(44),
    height: s(44),
    borderRadius: s(22),
  },
  greeting: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: ms(16),
    color: '#000000',
    flex: 1,
    marginLeft: s(9),
  },
  iconBtn: {
    padding: s(4),
    position: 'relative',
  },
  headerIcon: { width: s(24), height: s(24) },

  bellBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    minWidth: s(15),
    height: s(15),
    borderRadius: s(8),
    backgroundColor: '#D90000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: s(2),
  },
  bellBadgeTxt: {
    fontFamily: 'Roboto_700Bold',
    fontSize: ms(8),
    color: '#FFFFFF',
  },

  scroll: { paddingBottom: vs(40) },

  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(22),
    marginTop: vs(18),
    marginBottom: vs(6),
  },
  sectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
  },
  sectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: ms(24),
    color: '#0A3564',
  },

  countPill: {
    backgroundColor: '#D90000',
    borderRadius: s(10),
    minWidth: s(20),
    height: s(20),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: s(5),
    marginTop: vs(2),
  },
  countPillTxt: {
    fontFamily: 'Roboto_700Bold',
    fontSize: ms(10),
    color: '#FFFFFF',
  },

  // Mark as Read / Unread button
  markBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(4),
    paddingHorizontal: s(8),
    borderRadius: s(12),
    borderWidth: 1,
    borderColor: '#0A3564',
  },
  markTxt: {
    fontFamily: 'Poppins_400Regular',
    fontSize: ms(10),
    color: '#0A3564',
  },

  dateLabel: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: ms(16),
    color: '#0A3564',
    paddingHorizontal: s(22),
    marginTop: vs(20),
    marginBottom: vs(8),
  },
  seeMoreWrap: {
    alignItems: 'center',
    marginTop: vs(16),
  },
  seeMore: {
    fontFamily: 'Poppins_500Medium',
    fontSize: ms(12),
    color: '#0A3564',
  },
});

const notif = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: s(22),
    marginBottom: vs(8),
    backgroundColor: 'rgba(218, 218, 218, 0.26)',
    borderRadius: s(5),
    minHeight: vs(67),
    paddingVertical: vs(10),
    paddingHorizontal: s(10),
    borderLeftWidth: s(3),
    borderLeftColor: '#0A3564',
  },
  unreadDot: {
    position: 'absolute',
    top: s(8),
    left: s(8),
    width: s(7),
    height: s(7),
    borderRadius: s(4),
    backgroundColor: '#0A3564',
    zIndex: 1,
  },

  cardRead: {
    borderLeftColor: '#D9D9D9',
    backgroundColor: 'rgba(218, 218, 218, 0.10)',
  },
  alertImage: {
    width: s(46),
    height: vs(44),
    marginRight: s(10),
    flexShrink: 0,
  },
  alertImageRead: {
    opacity: 0.5,
  },
  textWrap: { flex: 1 },
  title: {
    fontFamily: 'Poppins_500Medium',
    fontSize: ms(13),
    color: '#0A3564',
    marginBottom: vs(2),
  },
  titleRead: {
    color: '#A0A0A0',
  },
  message: {
    fontFamily: 'Roboto_400Regular',
    fontSize: ms(10),
    color: 'rgba(0, 0, 0, 0.56)',
    lineHeight: ms(12),
  },
  readBadge: {
    marginLeft: s(6),
    flexShrink: 0,
  },
});