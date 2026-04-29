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

// ── Assets ──
const ASSETS = {
  notifications:    require('../assets/notifications.png'),
  home:             require('../assets/home.png'),
  weather:          require('../assets/weather.png'),
  news:             require('../assets/news.png'),
  guide:            require('../assets/guide.png'),

  rappler:          require('../assets/rappler.png'),
  emergencyHotline: require('../assets/emergency-hotline.png'),

  // Tip illustrations  (one → twelve)
  one:    require('../assets/one.png'),
  two:    require('../assets/two.png'),
  three:  require('../assets/three.png'),
  four:   require('../assets/four.png'),
  five:   require('../assets/five.png'),
  six:    require('../assets/six.png'),
  seven:  require('../assets/seven.png'),
  eight:  require('../assets/eight.png'),
  nine:   require('../assets/nine.png'),
  ten:    require('../assets/ten.png'),
  eleven: require('../assets/eleven.png'),
  twelve: require('../assets/twelve.png'),
};

// ── Tip Data ──
const TIPS_BEFORE = [
  { key: 'one',   text: 'Maghanda ng emergency kit na may pagkain, tubig, gamot, at iba pang pangunahing pangangailangan.' },
  { key: 'two',   text: 'Alamin ang evacuation routes at ang pinakamalapit na evacuation center sa inyong lugar.' },
  { key: 'three', text: 'I-secure ang mga mahalagang dokumento at ari-arian sa matataas na lugar.' },
];

const TIPS_DURING = [
  { key: 'four',  text: 'Manatili sa mas mataas na lugar.',                                                                  align: 'left'  },
  { key: 'five',  text: 'Manatili sa loob ng bahay at patuloy na makinig sa ulat ng panahon.',                               align: 'right' },
  { key: 'six',   text: 'Huwag hawakan ang mga kagamitang de kuryente kung ikaw ay basa o nakatayo sa tubig baha.',          align: 'left'  },
  { key: 'seven', text: 'Huwag tumawid ng sapa o ilog kung lagpas tuhod na ang tubig.',                                      align: 'right' },
  { key: 'eight', text: 'Huwag lumangoy o mamangka sa umaapaw na ilog.',                                                     align: 'left'  },
  { key: 'nine',  text: 'Huwag maglakad o magmaneho sa lugar na baha.',                                                      align: 'right' },
];

const TIPS_AFTER = [
  { key: 'ten',    text: 'Huwag muna buksan ang main switch ng kuryente o gumamit ng appliances at iba pang kagamitan hanggang sa masuri ng isang electrician.' },
  { key: 'eleven', text: 'Linisin ang anumang bagay na maaaring kontaminado ng baha.'                                                                           },
  { key: 'twelve', text: 'Kung lumikas, huwag bumalik sa tahanan o sa mga lugar na binaha hanggang hindi ito naideklarang ligtas ng mga awtoridad.'            },
];

// ── Bottom Navigation ───
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

function TipCard({ imageKey, text, align = 'left' }) {
  const isLeft = align === 'left';
  return (
    <View style={tip.card}>
      {isLeft ? (
        <>
          <Image source={ASSETS[imageKey]} style={tip.image} resizeMode="contain" />
          <Text style={[tip.text, { textAlign: 'left', flex: 1 }]}>{text}</Text>
        </>
      ) : (
        <>
          <Text style={[tip.text, { textAlign: 'right', flex: 1 }]}>{text}</Text>
          <Image source={ASSETS[imageKey]} style={tip.image} resizeMode="contain" />
        </>
      )}
    </View>
  );
}

function GuideMainView({ onOpenHotlines }) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={guide.scroll}
    >
      <View style={guide.titleRow}>
        <Text style={guide.title}>GUIDE</Text>
        <TouchableOpacity onPress={onOpenHotlines} activeOpacity={0.8}>
          <Text style={guide.hotlinesBtn}>HOTLINES {'>'}</Text>
        </TouchableOpacity>
      </View>

      <View style={guide.introRow}>
        <Image source={ASSETS.rappler} style={guide.introImage} resizeMode="cover" />
        <Text style={guide.introText}>
          Ang baha ay nangyayari kapag ang tubig ay umaapaw sa karaniwang tuyong lupa, kadalasang dulot ng malakas na ulan, pag-apaw ng ilog, o pagkasira ng dam, na nagdudulot ng pinsala at panganib sa mga tao at ari-arian.
        </Text>
      </View>

      {/* Article source credit */}
      <Text style={guide.sourceTitle}>
        PANOORIN: Bilyon-bilyon ang pondo para sa flood control projects. Bakit baha pa rin?
      </Text>
      <Text style={guide.sourceAuthor}>Rappler.com, James Patrick Cruz</Text>
      <Text style={guide.sourceDate}>Jul 26, 2025 8:30 PM PHT</Text>

      {/* ── MGA DAPAT TANDAAN KAPAG MAY BAHA ── */}
      <Text style={guide.sectionMainTitle}>MGA DAPAT TANDAAN KAPAG MAY BAHA</Text>

      {/* BAGO BUMAHA */}
      <Text style={guide.sectionSubTitle}>BAGO BUMAHA</Text>
      {TIPS_BEFORE.map((t, i) => (
        <TipCard key={t.key} imageKey={t.key} text={t.text} align={i % 2 === 0 ? 'left' : 'right'} />
      ))}

      {/* HABANG MAY BAHA */}
      <Text style={[guide.sectionSubTitle, { marginTop: vs(20) }]}>HABANG MAY BAHA</Text>
      {TIPS_DURING.map((t) => (
        <TipCard key={t.key} imageKey={t.key} text={t.text} align={t.align} />
      ))}

      {/* PAGTAPOS NG BAHA */}
      <Text style={[guide.sectionSubTitle, { marginTop: vs(20) }]}>PAGTAPOS NG BAHA</Text>
      {TIPS_AFTER.map((t, i) => (
        <TipCard key={t.key} imageKey={t.key} text={t.text} align={i % 2 === 0 ? 'left' : 'right'} />
      ))}
    </ScrollView>
  );
}

// ── Emergency Hotlines ───
function HotlinesView({ onBack }) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={hotline.scroll}
    >
      <View style={hotline.subHeader}>
        <Text style={hotline.pageTitle}>GUIDE</Text>
        <Text style={hotline.backBtn} onPress={onBack}>{'<'} HOTLINES</Text>
      </View>

      {/* Emergency hotlines image */}
      <Image source={ASSETS.emergencyHotline} style={hotline.heroImage} resizeMode="contain" />

      <Text style={hotline.heading}>EMERGENCY HOTLINES</Text>

      <Text style={hotline.intro}>
        Narito ang emergency contact numbers ng lungsod na pwedeng tawagan o padalahan ng mensahe kung kakailanganin ng agarang tulong at aksyon.
      </Text>

      {/* Hotlines card */}
      <View style={hotline.card}>
        {/* Quezon City Emergency */}
        <Text style={hotline.contactLabel}>Quezon City Emergency Hotline:</Text>
        <Text style={hotline.contactNumber}>122</Text>

        <View style={hotline.divider} />

        {/* EOC */}
        <Text style={hotline.contactLabel}>Emergency Operations Center:</Text>
        <Text style={hotline.contactNumber}>
          0977-031-2892 (Globe){'\n'}
          0947-885-9929 (Smart){'\n'}
          8-988-4242 local 7245
        </Text>

        <View style={hotline.divider} />

        {/* EMS & SAR */}
        <Text style={hotline.contactLabel}>Emergency Medical Services / Search and Rescue:</Text>
        <Text style={hotline.contactNumber}>
          0947-884-7498 (Smart){'\n'}
          8928-4396
        </Text>
      </View>

      {/* Source */}
      <Text style={hotline.sourceUrl}>
        https://quezoncity.gov.ph/emergency-hotline-numbers/
      </Text>
      <Text style={hotline.sourceDate}>July 29, 2023</Text>
    </ScrollView>
  );
}

// ── Main GuideScreen Component ─
export default function GuideScreen({ navigation }) {
  const [view, setView] = useState('guide'); 
  const { profile } = useProfile();

  const handleNavPress = (key) => {
    if (key === 'home')    { navigation.navigate('Home'); }
    else if (key === 'weather') { navigation.navigate('Weather'); }
    else if (key === 'news')    { navigation.navigate('News'); }
  };

  const firstName = profile.name ? profile.name.split(' ')[0] : 'User';

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={['#55D6FE', '#BAEDFF', '#FFFFFF']}
        locations={[0.0011, 0.2097, 0.9239]}
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
          style={styles.iconBtn}
          onPress={() => navigation.navigate('Notifications')}
          activeOpacity={0.8}
        >
          <Image source={ASSETS.notifications} style={styles.headerIcon} resizeMode="contain" />
        </TouchableOpacity>
      </View>

      {view === 'guide'
        ? <GuideMainView onOpenHotlines={() => setView('hotlines')} />
        : <HotlinesView   onBack={() => setView('guide')} />
      }

      <BottomNav active="guide" onPress={handleNavPress} />
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
});


const guide = StyleSheet.create({
  scroll: {
    paddingHorizontal: s(20),
    paddingBottom: vs(100),
    paddingTop: vs(20),
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vs(12),
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: ms(24),
    color: '#000000',
  },
  hotlinesBtn: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: ms(12),
    color: '#000000',
  },
  introRow: {
    flexDirection: 'row',
    gap: s(12),
    marginBottom: vs(8),
    alignItems: 'flex-start',
  },
  introImage: {
    width: s(186),
    height: vs(114),
    borderRadius: s(10),
  },
  introText: {
    flex: 1,
    fontFamily: 'Poppins_500Medium',
    fontSize: ms(9),
    color: '#000000',
    lineHeight: ms(14),
  },
  sourceTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: ms(11),
    color: '#000000',
    lineHeight: ms(10),
    marginBottom: vs(2),
  },
  sourceAuthor: {
    fontFamily: 'Poppins_500Medium',
    fontSize: ms(8),
    color: 'rgba(0,0,0,0.56)',
    marginBottom: vs(1),
  },
  sourceDate: {
    fontFamily: 'Poppins_500Medium',
    fontSize: ms(8),
    color: 'rgba(0,0,0,0.56)',
    marginBottom: vs(20),
  },
  sectionMainTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: ms(15),
    color: '#000000',
    textAlign: 'center',
    marginBottom: vs(16),
  },
  sectionSubTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: ms(12),
    color: '#000000',
    marginBottom: vs(8),
  },
});


const tip = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C7DCF0',
    borderRadius: s(10),
    padding: s(10),
    marginBottom: vs(10),
    minHeight: vs(78),
    gap: s(8),
  },
  image: {
    width: s(120),
    height: vs(70),
  },
  text: {
    fontFamily: 'Poppins_500Medium',
    fontSize: ms(11),
    color: '#000000',
    lineHeight: ms(16),
  },
});

// Hotlines 
const hotline = StyleSheet.create({
  scroll: {
    paddingHorizontal: s(20),
    paddingBottom: vs(100),
    paddingTop: vs(4),
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vs(8),
  },
  backBtn: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: ms(12),
    color: '#000000',
  },
  pageTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: ms(24),
    color: '#000000',
  },
  heroImage: {
    width: s(362),
    height: vs(92),
    alignSelf: 'flex-start',
    marginBottom: vs(8),
  },
  heading: {
    fontFamily: 'Poppins_700Bold',
    fontSize: ms(24),
    color: '#000000',
    textAlign: 'center',
    marginBottom: vs(8),
  },
  intro: {
    fontFamily: 'Poppins_500Medium',
    fontSize: ms(10),
    color: '#000000',
    textAlign: 'center',
    lineHeight: ms(15),
    marginBottom: vs(16),
  },
  card: {
    backgroundColor: '#C7DCF0',
    borderRadius: s(10),
    paddingHorizontal: s(20),
    paddingVertical: vs(16),
    marginBottom: vs(12),
    alignItems: 'center',
  },
  contactLabel: {
    fontFamily: 'Poppins_700Bold',
    fontSize: ms(15),
    color: '#000000',
    textAlign: 'center',
    lineHeight: ms(22),
    marginBottom: vs(4),
  },
  contactNumber: {
    fontFamily: 'Poppins_500Medium',
    fontSize: ms(15),
    color: '#000000',
    textAlign: 'center',
    textDecorationLine: 'underline',
    lineHeight: ms(22),
    marginBottom: vs(12),
  },
  divider: {
    width: '80%',
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
    marginBottom: vs(12),
  },
  sourceUrl: {
    fontFamily: 'Poppins_500Medium',
    fontSize: ms(10),
    color: 'rgba(0,0,0,0.56)',
    textDecorationLine: 'underline',
    textAlign: 'left',
    marginBottom: vs(2),
  },
  sourceDate: {
    fontFamily: 'Poppins_500Medium',
    fontSize: ms(7),
    color: 'rgba(0,0,0,0.56)',
    textAlign: 'right',
  },
});

// Bottom nav 
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