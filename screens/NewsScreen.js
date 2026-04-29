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
  home:           require('../assets/home.png'),
  weather:        require('../assets/weather.png'),
  news:           require('../assets/news.png'),
  guide:          require('../assets/guide.png'),
  pag_asa:        require('../assets/Pag-asa.png'),
  oriental:       require('../assets/oriental.png'),
  mmda:           require('../assets/mmda.png'),
  cebu:           require('../assets/cebu.png'),
  flood_control:  require('../assets/flood-control.png'),
  captive_portal: require('../assets/captive-portal.png'),
};

// ── Articles Data ───
const ARTICLES = [
  {
    id: 1,
    imageKey: 'pag_asa',
    title: 'Potential supertyphoon may enter PAR next week - PAGASA',
    author: 'David Dizon, ABS-CBN News',
    date: 'Published April 08, 2026 11:27 AM PHT',
    featured: true,
    weatherNote: 'SUNNY WITH A CHANCE OF AFTERNOON THUNDERSTORM',
    body: [
      'MANILA — Tropical cyclone Sinlaku, which intensified into a super typhoon Sunday afternoon, is unlikely to enter the Philippine area of responsibility, according to PAGASA.',
      '"Inaasahan itong hindi papasok o mababa ang tsansa na pumasok sa ating Philippine area of responsibility," senior weather forecaster Aldczar Aurelio said in the agency\'s live weather broadcast early Monday. It will not impact the country\'s weather as well, Aurelio added. Sinlaku is packing winds of 205 kilometers per hour, with gustiness up to 250 kph.',
      'The super typhoon was spotted 2,580 kilometers east of Visayas at 3 a.m. Monday and is moving west northwestward at 15 kph. The weather disturbance is forecast to pass near Guam and Northern Mariana Islands on Tuesday, April 14.',
      'Meanwhile, the Philippines will continue to experience mostly hot and dry conditions. The ridge of a high pressure area still extends over Northern Luzon, restricting cloud formation and therefore bringing fair and dry weather in the area. The rest of the country will also be warm, with possible afternoon showers or localized thunderstorms.',
      'In Cotabato City, the heat index may hit danger level again at 42°C this Monday. Ten other areas, mostly in Luzon, also may reach 40 to 41°C heat index today:',
      '41°C\n• Borongan City\n• Cavite City\n• Coron, Palawan',
    ],
  },
  {
    id: 2,
    imageKey: 'oriental',
    title: 'Oriental Mindoro governor barred from inspecting collapsed flood control project',
    author: 'Jessie Cruzat, ABS-CBN News',
    date: 'Published April 18, 2026 09:09 PM PHT',
    body: [
      'ORIENTAL MINDORO — The governor of Oriental Mindoro has been barred from inspecting a collapsed flood control project in the province, drawing criticism from local officials and residents who are demanding accountability for the infrastructure failure.',
    ],
  },
  {
    id: 3,
    imageKey: 'mmda',
    title: 'MMDA identifies 49 flood prone areas in NCR',
    author: 'Johnson Manabat, ABS-CBN News',
    date: 'Published July 14, 2025 10:04 PM PHT',
    body: [
      'MANILA — The Metropolitan Manila Development Authority (MMDA) has identified 49 flood-prone areas across the National Capital Region, urging residents in these zones to remain vigilant especially during the rainy season.',
    ],
  },
  {
    id: 4,
    imageKey: 'cebu',
    title: 'Cebu flood control projects are either ghost or substandard: governor',
    author: 'Rowegie Abanto, ABS-CBN News',
    date: 'Published November 05, 2025 10:51 AM PHT',
    body: [
      'CEBU — Governor Gwendolyn Garcia has declared that flood control projects in the province are either ghost projects or were built below standard, calling for a full investigation into the billions of pesos allocated for flood mitigation infrastructure.',
    ],
  },
  {
    id: 5,
    imageKey: 'flood_control',
    title: 'Storm-ravaged Cebu province got P26.7 billion in flood control funds over last 3 years',
    author: 'Andrea Taguines, ABS-CBN News, ABS-CBN Research and Verification Unit',
    date: 'Published November 06, 2025 12:32 AM PHT',
    body: [
      'CEBU — Despite receiving P26.7 billion in flood control funding over the past three years, Cebu province continues to suffer devastating floods whenever a major storm hits, raising serious questions about how the funds were spent and whether the projects were properly implemented.',
    ],
  },
];

// ── Bottom Navi ───
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

// ── News List ──
function NewsListView({ onSelectArticle }) {
  const featured = ARTICLES[0];
  const gridArticles = ARTICLES.slice(1); // articles 2-5 in 2x2 grid

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={list.scroll}
    >
      {/* Section title */}
      <Text style={list.sectionTitle}>NEWS</Text>

      {/* Featured Article */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => onSelectArticle(featured)}
        style={list.featuredCard}
      >
        <Image
          source={ASSETS[featured.imageKey]}
          style={list.featuredImage}
          resizeMode="cover"
        />
        <Text style={list.featuredTitle} numberOfLines={2}>
          {featured.title}
        </Text>
        <Text style={list.featuredAuthor}>{featured.author}</Text>
        <Text style={list.featuredDate}>{featured.date}</Text>
      </TouchableOpacity>

      <View style={list.grid}>
        {gridArticles.map((article) => (
          <TouchableOpacity
            key={article.id}
            activeOpacity={0.85}
            onPress={() => onSelectArticle(article)}
            style={list.gridItem}
          >
            <Image
              source={ASSETS[article.imageKey]}
              style={list.gridImage}
              resizeMode="cover"
            />
            <Text style={list.gridTitle} numberOfLines={3}>
              {article.title}
            </Text>
            <Text style={list.gridAuthor} numberOfLines={1}>
              {article.author}
            </Text>
            <Text style={list.gridDate}>{article.date}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

// ── Article ──
function ArticleDetailView({ article, onBack }) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={detail.scroll}
    >
      <View style={detail.subHeader}>
        <TouchableOpacity onPress={onBack} activeOpacity={0.75} style={detail.backBtn}>
          <Ionicons name="chevron-back" size={s(18)} color="#000000" />
          <Text style={detail.backLabel}>News</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.75} style={detail.shareBtn}>
          <Image source={ASSETS.captive_portal} style={detail.shareIcon} resizeMode="contain" />
        </TouchableOpacity>
      </View>

      {/* Article title */}
      <Text style={detail.title}>{article.title}</Text>

      {/* Author & date */}
      <Text style={detail.author}>{article.author}</Text>
      <Text style={detail.date}>{article.date}</Text>

      {/* Hero image */}
      <Image
        source={ASSETS[article.imageKey]}
        style={detail.heroImage}
        resizeMode="cover"
      />

      {article.weatherNote ? (
        <Text style={detail.weatherNote}>{article.weatherNote}</Text>
      ) : null}

      {/* Body paragraphs */}
      {article.body.map((para, i) => (
        <Text
          key={i}
          style={[
            detail.bodyText,
            article.id === 1 && i === article.body.length - 1 && detail.bodyBold,
          ]}
        >
          {para}
        </Text>
      ))}
    </ScrollView>
  );
}

// ── Main NewsScreen ───
export default function NewsScreen({ navigation }) {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const { profile } = useProfile();

  const handleNavPress = (key) => {
    if (key === 'home')    { navigation.navigate('Home'); }
    else if (key === 'weather') { navigation.navigate('Weather'); }
    else if (key === 'guide')   { navigation.navigate('Guide'); }
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

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation.navigate('Notifications')}
          activeOpacity={0.8}
        >
          <Image source={ASSETS.notifications} style={styles.headerIcon} resizeMode="contain" />
        </TouchableOpacity>
      </View>

      {selectedArticle
        ? (
          <ArticleDetailView
            article={selectedArticle}
            onBack={() => setSelectedArticle(null)}
          />
        )
        : (
          <NewsListView onSelectArticle={setSelectedArticle} />
        )
      }

      <BottomNav active="news" onPress={handleNavPress} />
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

// News list styles
const list = StyleSheet.create({
  scroll: {
    paddingHorizontal: s(24),
    paddingBottom: vs(100),
    paddingTop: vs(4),
  },
  sectionTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: ms(24),
    color: '#000000',
    marginBottom: vs(10),
    paddingTop: vs(15),
  },

  // Featured article
  featuredCard: {
    marginBottom: vs(16),
  },
  featuredImage: {
    width: '100%',
    height: vs(191),
    borderRadius: s(10),
    marginBottom: vs(8),
  },
  featuredTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: ms(13),
    color: '#000000',
    lineHeight: ms(18),
    marginBottom: vs(2),
  },
  featuredAuthor: {
    fontFamily: 'Poppins_500Medium',
    fontSize: ms(9),
    color: 'rgba(0,0,0,0.56)',
    marginBottom: vs(1),
  },
  featuredDate: {
    fontFamily: 'Poppins_500Medium',
    fontSize: ms(7),
    color: 'rgba(0,0,0,0.56)',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: vs(16),
  },
  gridItem: {
    width: '47%',
  },
  gridImage: {
    width: '100%',
    height: vs(100),
    borderRadius: s(10),
    marginBottom: vs(4),
  },
  gridTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: ms(9),
    color: '#000000',
    lineHeight: ms(12),
    marginBottom: vs(2),
  },
  gridAuthor: {
    fontFamily: 'Poppins_500Medium',
    fontSize: ms(7),
    color: 'rgba(0,0,0,0.56)',
    marginBottom: vs(1),
  },
  gridDate: {
    fontFamily: 'Poppins_500Medium',
    fontSize: ms(5),
    color: 'rgba(0,0,0,0.56)',
  },
});

// Article 
const detail = StyleSheet.create({
  scroll: {
    paddingHorizontal: s(24),
    paddingBottom: vs(100),
    paddingTop: vs(4),
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vs(12),
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(2),
  },
  backLabel: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: ms(16),
    color: '#000000',
  },
  shareBtn: {
    padding: s(4),
  },
  shareIcon: {
    width: s(21),
    height: s(21),
  },
  title: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: ms(20),
    color: '#000000',
    lineHeight: ms(26),
    marginBottom: vs(8),
  },
  author: {
    fontFamily: 'Poppins_500Medium',
    fontSize: ms(9),
    color: 'rgba(0,0,0,0.56)',
    marginBottom: vs(2),
  },
  date: {
    fontFamily: 'Poppins_500Medium',
    fontSize: ms(9),
    color: 'rgba(0,0,0,0.56)',
    marginBottom: vs(12),
  },
  heroImage: {
    width: '100%',
    height: vs(191),
    borderRadius: s(10),
    marginBottom: vs(14),
  },
  weatherNote: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: ms(9),
    color: '#000000',
    marginBottom: vs(8),
  },
  bodyText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: ms(9),
    color: 'rgba(0,0,0,0.59)',
    lineHeight: ms(14),
    marginBottom: vs(10),
  },
  bodyBold: {
    fontFamily: 'Poppins_700Bold',
    color: 'rgba(0,0,0,0.59)',
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