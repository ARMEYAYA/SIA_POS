import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { s, vs, ms } from './Scale';
import { useProfile } from './AppContext';

// ── Asset Map ──
const ASSETS = {
  Day:      require('../assets/Day.png'),
  Sunrise:  require('../assets/Sunrise.png'),
  Night:    require('../assets/Night.png'),
  Midnight: require('../assets/Midnight.png'),
  Sunset:   require('../assets/Sunset.png'),

  Alert1: require('../assets/Alert1.png'),
  Alert2: require('../assets/Alert2.png'),
  Alert3: require('../assets/Alert3.png'),

  home:          require('../assets/home.png'),
  weather:       require('../assets/weather.png'),
  news:          require('../assets/news.png'),
  guide:         require('../assets/guide.png'),
  notifications: require('../assets/notifications.png'),
  locations:     require('../assets/location.png'),
  rainfall:      require('../assets/rainfall.png'),
};

// ── Time & Theme ───
function getTimePeriod(date = new Date()) {
  const t = date.getHours() * 60 + date.getMinutes();
  if (t >= 60  && t < 300)  return 'midnight';
  if (t >= 300 && t < 420)  return 'sunrise';
  if (t >= 420 && t < 1020) return 'day';
  if (t >= 1020 && t < 1140) return 'sunset';
  return 'night';
}

function formatTime(date) {
  const h    = date.getHours();
  const m    = date.getMinutes().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12  = h % 12 === 0 ? 12 : h % 12;
  return `TODAY ${h12}:${m} ${ampm}`;
}

const THEMES = {
  day:      { image: ASSETS.Day,      waveColor: '#BAEDFF', overlayColor: 'rgba(0,0,0,0.08)', waterStartFrac: 0.44 },
  sunrise:  { image: ASSETS.Sunrise,  waveColor: '#FFCFCF', overlayColor: 'rgba(0,0,0,0.08)', waterStartFrac: 0.41 },
  night:    { image: ASSETS.Night,    waveColor: '#55D6FE', overlayColor: 'rgba(0,0,0,0.20)', waterStartFrac: 0.55 },
  midnight: { image: ASSETS.Midnight, waveColor: '#C4A8FF', overlayColor: 'rgba(0,0,0,0.20)', waterStartFrac: 0.44 },
  sunset:   { image: ASSETS.Sunset,   waveColor: '#FFB3C6', overlayColor: 'rgba(0,0,0,0.08)', waterStartFrac: 0.41 },
};

const CARD_W = s(352);
const CARD_H = vs(488);

// ── Water Wave Line ────
function WaterWaveLine({ color, waterStartFrac }) {
  const lineH = vs(28);
  const amp   = vs(7);
  const mid   = lineH / 2;
  const waves = 4;
  const wW    = CARD_W / waves;

  let d = `M 0 ${mid}`;
  for (let i = 0; i < waves; i++) {
    const x0 = i * wW, x1 = x0 + wW / 2, x2 = x0 + wW;
    d += ` C ${x0 + wW / 4} ${mid - amp}, ${x1 - wW / 4} ${mid - amp}, ${x1} ${mid}`;
    d += ` C ${x1 + wW / 4} ${mid + amp}, ${x2 - wW / 4} ${mid + amp}, ${x2} ${mid}`;
  }

  return (
    <Svg width={CARD_W} height={lineH} style={{ position: 'absolute', top: CARD_H * waterStartFrac - mid, left: 0 }}>
      <Path d={d} stroke={color} strokeWidth={s(2.5)} fill="none" opacity={0.9} />
    </Svg>
  );
}

function WaterCard({ theme, timeLabel, waterLevel = 0.5, alertLevel = 1, status = 'Normal' }) {
  const alertRowTop = CARD_H * theme.waterStartFrac + vs(14);
  return (
    <ImageBackground source={theme.image} style={card.wrapper} imageStyle={{ borderRadius: s(30) }} resizeMode="cover">
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: theme.overlayColor, borderRadius: s(30) }]} />
      <Text style={card.timeTxt}>{timeLabel}</Text>
      <Text style={card.levelLabel}>Water Level</Text>
      <Text style={card.levelValue}>{waterLevel}</Text>
      <Text style={card.statusTxt}>{status}</Text>
      <WaterWaveLine color={theme.waveColor} waterStartFrac={theme.waterStartFrac} />
      <View style={[card.alertRow, { top: alertRowTop }]}>
        <Text style={card.alertTxt}>Alert Level {alertLevel}</Text>
      </View>
    </ImageBackground>
  );
}

function WarningCard() {
  return (
    <View style={warn.card}>
      <Image source={ASSETS.Alert1} style={warn.alertIcon} resizeMode="center" />
      <Text style={warn.title}>Warning</Text>
      <View style={warn.statsRow}>
        <View style={warn.statCol}>
          <Text style={warn.statLabel}>% Rating</Text>
          <Text style={warn.statValue}>70%</Text>
        </View>
        <View style={warn.statCol}>
          <Text style={warn.statLabel}>Expected Time</Text>
          <Text style={warn.statValue}>10:00 PM</Text>
        </View>
      </View>
      <Image source={ASSETS.rainfall} style={warn.rainfallIcon} resizeMode="contain" />
      <Text style={warn.footer}>Expect Rainfall</Text>
    </View>
  );
}

// ── Bottom Navigation kapagod na ───
const NAV_ITEMS = [
  { key: 'home',    label: 'Home',    icon: ASSETS.home },
  { key: 'weather', label: 'Weather', icon: ASSETS.weather },
  { key: 'news',    label: 'News',    icon: ASSETS.news },
  { key: 'guide',   label: 'Guide',   icon: ASSETS.guide },
];

function BottomNav({ active, onPress }) {
  return (
    <View style={nav.bar}>
      {NAV_ITEMS.map((item) => {
        const isActive = item.key === active;
        return (
          <TouchableOpacity
            key={item.key}
            style={[nav.item, isActive && nav.itemActive]}
            onPress={() => onPress?.(item.key)}
            activeOpacity={0.75}
          >
            <Image
              source={item.icon}
              style={[nav.icon, { tintColor: isActive ? '#000000' : '#666666' }]}
              resizeMode="contain"
            />
            <Text style={[nav.label, isActive && nav.labelActive]}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ── Main HomeScreen  ──
export default function HomeScreen({ navigation }) {
  const [now, setNow] = useState(new Date());

  const { profile } = useProfile();

  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(tick);
  }, []);

  const period    = getTimePeriod(now);
  const theme     = THEMES[period];
  const timeLabel = formatTime(now);

  const handleTabPress = (key) => {
    if (key === 'weather') {
      navigation.jumpTo('Weather');
    } else if (key === 'news') {
      navigation.navigate('News');
    } else if (key === 'guide') {
      navigation.navigate('Guide');
    }
  };

  const firstName = profile.name ? profile.name.split(' ')[0] : 'User';

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={['#55D6FE', '#BAEDFF', '#FFFFFF']}
        locations={[0.0011, 0.5233, 0.9239]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')} activeOpacity={0.8}>
          <View style={styles.avatarWrap}>
            {profile.avatarUri ? (
              <Image source={{ uri: profile.avatarUri }} style={styles.avatarImg} />
            ) : (
              <Ionicons name="person-circle-outline" size={s(44)} color="#2200ff" />
            )}
          </View>
        </TouchableOpacity>

        <Text style={styles.greeting}>Hello, {firstName} !</Text>

        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Notifications')} activeOpacity={0.8}>
          <Image source={ASSETS.notifications} style={styles.headerIcon} resizeMode="contain" />
        </TouchableOpacity>
      </View>

      {/* Location */}
      <View style={styles.locationRow}>
        <Image source={ASSETS.locations} style={styles.locationIcon} resizeMode="contain" />
        <Text style={styles.locationTxt}>Brgy. Sta Lalala</Text>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <WaterCard theme={theme} timeLabel={timeLabel} />
        <WarningCard />
      </View>

      <BottomNav active="home" onPress={handleTabPress} />
    </SafeAreaView>
  );
}

// ── Styles ───
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#55D6FE',
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(22),
    marginTop: vs(12),
    height: vs(47),
  },
  avatarWrap: {
    width: s(44),
    height: s(44),
    borderRadius: s(22),
    overflow: 'hidden',
    marginRight: s(10),
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  iconBtn: { padding: s(4) },
  headerIcon: { width: s(24), height: s(24) },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(30),
    marginTop: vs(18),
    gap: s(8),
  },
  locationIcon: { width: s(26), height: s(26) },
  locationTxt: {
    fontFamily: 'Poppins_700Bold',
    fontSize: ms(20),
    color: '#000000',
  },

  mainContent: {
    flex: 1,
    alignItems: 'center',
    paddingTop: vs(10),
    paddingBottom: vs(80),
  },
});

const card = StyleSheet.create({
  wrapper:     { width: CARD_W, height: CARD_H, borderRadius: s(30), overflow: 'hidden' },
  timeTxt:     { position: 'absolute', left: 0, right: 0, textAlign: 'center', top: vs(33),  fontFamily: 'Roboto_500Medium',    fontSize: ms(12), color: '#FFFFFF' },
  levelLabel:  { position: 'absolute', left: 0, right: 0, textAlign: 'center', top: vs(53),  fontFamily: 'Poppins_500Medium',   fontSize: ms(16), color: '#FFFFFF' },
  levelValue:  { position: 'absolute', left: 0, right: 0, textAlign: 'center', top: vs(68),  fontFamily: 'Poppins_600SemiBold', fontSize: ms(64), lineHeight: ms(96), color: '#FFFFFF' },
  statusTxt:   { position: 'absolute', left: 0, right: 0, textAlign: 'center', top: vs(143), fontFamily: 'Poppins_600SemiBold', fontSize: ms(14), color: '#FFFFFF' },
  alertRow:    { position: 'absolute', left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: s(8) },
  alertTxt:    { fontFamily: 'Poppins_700Bold', fontSize: ms(20), color: '#FFFFFF', textShadowColor: 'rgba(255,255,255,0.5)', textShadowOffset: { width: 0, height: 3 }, textShadowRadius: 10 },
});

const warn = StyleSheet.create({
  card: {
    width: s(353),
    height: vs(195),
    alignSelf: 'center',
    marginTop: vs(15),
    backgroundColor: '#FFFFFF',
    borderRadius: s(20),
    shadowColor: '#D9D9D9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
    padding: s(20),
    position: 'relative',
  },
  alertIcon:    { position: 'absolute', left: s(20),  top: vs(20), width: s(55),  height: vs(55) },
  title:        { position: 'absolute', left: s(90),  top: vs(25), fontFamily: 'Poppins_600SemiBold', fontSize: ms(24), color: '#FFCC00' },
  statsRow:     { position: 'absolute', left: s(90),  top: vs(78), flexDirection: 'row', gap: s(45) },
  statCol:      { alignItems: 'flex-start' },
  statLabel:    { fontFamily: 'Roboto_500Medium', fontSize: ms(11), color: '#A0A0A0', marginBottom: vs(4) },
  statValue:    { fontFamily: 'Roboto_500Medium', fontSize: ms(20), color: '#302859' },
  rainfallIcon: { position: 'absolute', right: s(-28), top: vs(18), width: s(170), height: vs(100) },
  footer:       { position: 'absolute', left: s(28),  bottom: vs(30), fontFamily: 'Poppins_600SemiBold', fontSize: ms(15), color: '#FFCC00' },
});

const nav = StyleSheet.create({
  bar: {
    position: 'absolute',
    bottom: vs(22),
    left: s(41),
    right: s(41),
    height: vs(60),
    backgroundColor: '#DDF6FF',
    borderWidth: 1,
    borderColor: '#BAEDFF',
    borderRadius: s(30),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: s(8),
  },
  item:        { alignItems: 'center', justifyContent: 'center', paddingHorizontal: s(12), paddingVertical: vs(4), borderRadius: s(20), gap: vs(2) },
  itemActive:  { backgroundColor: '#FFFFFF', paddingHorizontal: s(14) },
  icon:        { width: s(20), height: s(20) },
  label:       { fontFamily: 'Poppins_500Medium', fontSize: ms(9), color: '#666666', lineHeight: ms(14) },
  labelActive: { color: '#000000' },
});