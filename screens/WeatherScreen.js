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
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { s, vs, ms } from './Scale';
import { useProfile } from './AppContext';

const ASSETS = {
  notifications:  require('../assets/notifications.png'),
  locations:      require('../assets/location.png'),
  home:           require('../assets/home.png'),
  weather:        require('../assets/weather.png'),
  news:           require('../assets/news.png'),
  guide:          require('../assets/guide.png'),

  sunny:          require('../assets/sunny.png'),
  mostly_sunny:   require('../assets/mostly-sunny.png'),
  rainy:          require('../assets/rainy.png'),
  rainy_cloudy:   require('../assets/rainy-cloudy.png'),
  thunderstorm:   require('../assets/thunderstorm.png'),

  wind:           require('../assets/wind.png'),
  humidity:       require('../assets/humidity.png'),
  chance_of_rain: require('../assets/chance_of_rain.png'),
};

const HOURLY_DATA = [
  { time: '1:00',  temp: '33°C', icon: 'sunny' },
  { time: '4:00',  temp: '33°C', icon: 'sunny' },
  { time: '7:00',  temp: '26°C', icon: 'rainy_cloudy' },
  { time: '9:00',  temp: '25°C', icon: 'rainy_cloudy' },
  { time: '12:00', temp: '25°C', icon: 'rainy' },
];

const WEEKLY_DATA = [
  { day: 'MON', condition: 'THUNDERSTORM',   temp: '28°C', icon: 'thunderstorm' },
  { day: 'TUE', condition: 'THUNDERSTORM',   temp: '27°C', icon: 'thunderstorm' },
  { day: 'WED', condition: 'RAINY',          temp: '27°C', icon: 'rainy' },
  { day: 'THU', condition: 'MOSTLY SUNNY',   temp: '31°C', icon: 'mostly_sunny' },
  { day: 'FRI', condition: 'SUNNY',          temp: '33°C', icon: 'sunny' },
  { day: 'SAT', condition: 'SUNNY',          temp: '34°C', icon: 'sunny' },
  { day: 'SUN', condition: 'RAINY - CLOUDY', temp: '29°C', icon: 'rainy_cloudy' },
];

// ── Bottom Navi ──
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

function StatsRow({ wind, humidity, rain, valueColor = '#464549', labelColor = '#322462' }) {
  return (
    <View style={stat.row}>
      <View style={stat.col}>
        <Image source={ASSETS.wind} style={stat.icon} resizeMode="contain" />
        <Text style={[stat.value, { color: valueColor }]}>{wind}</Text>
        <Text style={[stat.label, { color: labelColor }]}>Wind</Text>
      </View>
      <View style={stat.divider} />
      <View style={stat.col}>
        <Image source={ASSETS.humidity} style={stat.icon} resizeMode="contain" />
        <Text style={[stat.value, { color: valueColor }]}>{humidity}</Text>
        <Text style={[stat.label, { color: labelColor }]}>Humidity</Text>
      </View>
      <View style={stat.divider} />
      <View style={stat.col}>
        <Image source={ASSETS.chance_of_rain} style={stat.icon} resizeMode="contain" />
        <Text style={[stat.value, { color: valueColor }]}>{rain}</Text>
        <Text style={[stat.label, { color: labelColor }]}>Chance of Rain</Text>
      </View>
    </View>
  );
}

// ── Today View ──
function TodayView({ onSwitchWeek }) {
  return (
    <>
      <View style={today.imageWrap}>
        <Image source={ASSETS.mostly_sunny} style={today.mainImage} resizeMode="contain" />
      </View>

      <View style={today.tempRow}>
        <Text style={today.temp}>31</Text>
        <View style={today.degWrap}>
          <View style={today.degDot} />
          <Text style={today.unit}>C</Text>
        </View>
      </View>

      <Text style={today.condition}>Mostly Sunny</Text>
      <Text style={today.date}>Sunday, May 10</Text>

      <View style={today.statsCard}>
        <StatsRow wind="12 km/h" humidity="58%" rain="10%" />
      </View>

      <View style={today.toggleRow}>
        <Text style={today.toggleActive}>Today</Text>
        <TouchableOpacity onPress={onSwitchWeek} activeOpacity={0.7}>
          <Text style={today.toggleInactive}>7 Days {'>'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={today.hourlyRow}
      >
        {HOURLY_DATA.map((item, i) => (
          <View key={i} style={today.hourCard}>
            <Text style={today.hourTemp}>{item.temp}</Text>
            <Image source={ASSETS[item.icon]} style={today.hourIcon} resizeMode="contain" />
            <Text style={today.hourTime}>{item.time}</Text>
          </View>
        ))}
      </ScrollView>
    </>
  );
}

// ── Week View ──
function WeekView({ onSwitchToday }) {
  return (
    <>
      <TouchableOpacity onPress={onSwitchToday} activeOpacity={0.7} style={week.backBtn}>
        <Text style={week.backTxt}>{'<'} 7 Days</Text>
      </TouchableOpacity>

      <View style={week.featuredCard}>
        <View style={week.featuredTop}>
          <Image source={ASSETS.rainy_cloudy} style={week.featuredImg} resizeMode="contain" />
          <View style={week.featuredInfo}>
            <Text style={week.featuredLabel}>Tomorrow</Text>
            <View style={week.featuredTempRow}>
              <Text style={week.featuredTemp}>20</Text>
              <View style={week.featuredDegWrap}>
                <View style={week.degDot} />
                <Text style={week.featuredUnit}>C</Text>
              </View>
            </View>
            <Text style={week.featuredCondition}>Rainy - Cloudy</Text>
          </View>
        </View>
        <View style={week.statsWrap}>
          <StatsRow wind="9 km/h" humidity="31%" rain="85%" valueColor="#CECECE" labelColor="#FFFFFF" />
        </View>
      </View>

      {WEEKLY_DATA.map((item, i) => (
        <View key={i} style={week.row}>
          <Text style={week.dayTxt}>{item.day}</Text>
          <Image source={ASSETS[item.icon]} style={week.rowIcon} resizeMode="contain" />
          <Text style={week.conditionTxt}>{item.condition}</Text>
          <Text style={week.tempTxt}>{item.temp}</Text>
        </View>
      ))}
    </>
  );
}

export default function WeatherScreen({ navigation }) {
  const [view, setView] = useState('today');
  const { profile } = useProfile();
  const handleNavPress = (key) => {
    if (key === 'home') {
      navigation.jumpTo('Home');
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
        colors={['#69DAFE', '#BAEDFF', '#FFFFFF']}
        locations={[0, 0.55, 1]}
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
        <TouchableOpacity
          onPress={() => navigation.navigate('Notifications')}
          activeOpacity={0.8}
          style={styles.iconBtn}
        >
          <Image source={ASSETS.notifications} style={styles.headerIcon} resizeMode="contain" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.screenTitle}>WEATHER</Text>

        <View style={styles.locationRow}>
          <Image source={ASSETS.locations} style={styles.locationIcon} resizeMode="contain" />
          <Text style={styles.locationTxt}>Quezon City, Brgy. Sta Lala</Text>
        </View>

        {view === 'today'
          ? <TodayView onSwitchWeek={() => setView('week')} />
          : <WeekView onSwitchToday={() => setView('today')} />
        }
      </ScrollView>

      <BottomNav active="weather" onPress={handleNavPress} />
    </SafeAreaView>
  );
}

// ── Styles ──
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#69DAFE',
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
  scroll: {
    paddingBottom: vs(100),
    paddingHorizontal: s(20),
    alignItems: 'center',
  },
  screenTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: ms(24),
    color: '#000000',
    marginTop: vs(6),
    alignSelf: 'flex-start',
    paddingTop: vs(15),
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(4),
    marginBottom: vs(4),
    gap: s(6),
    alignSelf: 'center',
  },
  locationIcon: { width: s(20), height: s(20) },
  locationTxt: {
    fontFamily: 'Poppins_800ExtraBold',
    fontSize: ms(16),
    color: '#464549',
  },
});

const stat = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '100%' },
  col: { alignItems: 'center', gap: vs(2) },
  icon: { width: s(36), height: s(36) },
  value: { fontFamily: 'Poppins_600SemiBold', fontSize: ms(11) },
  label: { fontFamily: 'Poppins_600SemiBold', fontSize: ms(11) },
  divider: { width: 1, height: vs(40), backgroundColor: 'rgba(100,100,100,0.15)' },
});

const today = StyleSheet.create({
  imageWrap:      { alignItems: 'center', marginTop: vs(8), marginBottom: vs(4) },
  mainImage:      { width: s(220), height: vs(160) },
  tempRow:        { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', marginTop: vs(4) },
  temp:           { fontFamily: 'Poppins_700Bold', fontSize: ms(80), color: '#322462', lineHeight: ms(88) },
  degWrap:        { alignItems: 'center', marginTop: vs(10) },
  degDot:         { width: s(9), height: s(9), borderRadius: s(5), backgroundColor: '#322462' },
  unit:           { fontFamily: 'Poppins_700Bold', fontSize: ms(28), color: '#322462' },
  condition:      { fontFamily: 'Poppins_600SemiBold', fontSize: ms(24), color: '#322462', textAlign: 'center', marginTop: vs(2) },
  date:           { fontFamily: 'Poppins_600SemiBold', fontSize: ms(13), color: 'rgba(0,0,0,0.5)', textAlign: 'center', marginBottom: vs(16) },
  statsCard:      { width: '100%', backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: s(16), paddingVertical: vs(12), paddingHorizontal: s(10), marginBottom: vs(14) },
  toggleRow:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: vs(10) },
  toggleActive:   { fontFamily: 'Poppins_600SemiBold', fontSize: ms(14), color: '#322462' },
  toggleInactive: { fontFamily: 'Poppins_600SemiBold', fontSize: ms(13), color: '#464549' },
  hourlyRow:      { gap: s(10), paddingBottom: vs(4), paddingHorizontal: s(2) },
  hourCard:       { width: s(63), height: vs(89), backgroundColor: '#322462', borderRadius: s(10), alignItems: 'center', justifyContent: 'space-evenly', paddingVertical: vs(6) },
  hourTemp:       { fontFamily: 'Poppins_400Regular', fontSize: ms(10), color: '#FFFFFF' },
  hourIcon:       { width: s(36), height: vs(36) },
  hourTime:       { fontFamily: 'Poppins_400Regular', fontSize: ms(11), color: '#FFFFFF' },
});

const week = StyleSheet.create({
  backBtn:          { alignSelf: 'flex-end', marginBottom: vs(8) },
  backTxt:          { fontFamily: 'Poppins_600SemiBold', fontSize: ms(13), color: '#464549' },
  featuredCard:     { width: '100%', backgroundColor: '#322462', borderRadius: s(10), padding: s(16), marginBottom: vs(10) },
  featuredTop:      { flexDirection: 'row', alignItems: 'center' },
  featuredImg:      { width: s(110), height: vs(80) },
  featuredInfo:     { flex: 1, paddingLeft: s(10) },
  featuredLabel:    { fontFamily: 'Poppins_600SemiBold', fontSize: ms(20), color: '#FFFFFF' },
  featuredTempRow:  { flexDirection: 'row', alignItems: 'flex-start' },
  featuredTemp:     { fontFamily: 'Poppins_700Bold', fontSize: ms(55), color: '#FFFFFF', lineHeight: ms(64) },
  featuredDegWrap:  { alignItems: 'center', marginTop: vs(6) },
  degDot:           { width: s(8), height: s(8), borderRadius: s(4), backgroundColor: '#FFFFFF' },
  featuredUnit:     { fontFamily: 'Poppins_700Bold', fontSize: ms(22), color: '#FFFFFF' },
  featuredCondition:{ fontFamily: 'Poppins_600SemiBold', fontSize: ms(16), color: '#FFFFFF' },
  statsWrap:        { marginTop: vs(12), paddingTop: vs(10), borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)' },
  row:              { width: '100%', height: vs(58), backgroundColor: '#322462', borderRadius: s(10), flexDirection: 'row', alignItems: 'center', paddingHorizontal: s(16), marginBottom: vs(8) },
  dayTxt:           { fontFamily: 'Poppins_800ExtraBold', fontSize: ms(11), color: '#FFFFFF', width: s(38) },
  rowIcon:          { width: s(48), height: vs(36) },
  conditionTxt:     { flex: 1, fontFamily: 'Poppins_800ExtraBold', fontSize: ms(11), color: '#FFFFFF', textAlign: 'center' },
  tempTxt:          { fontFamily: 'Poppins_800ExtraBold', fontSize: ms(11), color: '#FFFFFF', width: s(42), textAlign: 'right' },
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