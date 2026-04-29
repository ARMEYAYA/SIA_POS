import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Platform,
  StatusBar as RNStatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { s, vs, ms } from './Scale';


function ToggleRow({ title, subtitle, value, onToggle, indent = false }) {
  return (
    <View style={[styles.toggleRow, indent && styles.indented]}>
      <View style={styles.toggleTextWrap}>
        <Text style={[styles.toggleTitle, indent && styles.toggleTitleSm]}>{title}</Text>
        <Text style={[styles.toggleSub, indent && styles.toggleSubSm]}>{subtitle}</Text>
      </View>
      <TouchableOpacity
        onPress={onToggle}
        activeOpacity={0.85}
        style={[styles.toggleTrack, value && styles.toggleTrackOn]}
      >
        <View style={[styles.toggleThumb, value && styles.toggleThumbOn]} />
      </TouchableOpacity>
    </View>
  );
}

// ── Main Screen ──
export default function NotificationScreen({ navigation }) {
  const [location, setLocation] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [floodAlerts, setFloodAlerts] = useState(true);
  const [weather, setWeather] = useState(true);
  const [news, setNews] = useState(true);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={s(24)} color="#0A3564" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <ToggleRow
          title="Allow Location"
          subtitle="Enable location access for accurate flood alerts in your area."
          value={location}
          onToggle={() => setLocation(v => !v)}
        />

        <ToggleRow
          title="Allow Notifications"
          subtitle="Turn on notifications to receive real-time alerts and updates."
          value={notifications}
          onToggle={() => setNotifications(v => !v)}
        />

        <ToggleRow
          title="Flood Alerts"
          subtitle="Allow notifications for flood level updates and warnings."
          value={floodAlerts}
          onToggle={() => setFloodAlerts(v => !v)}
          indent
        />

        <ToggleRow
          title="Weather"
          subtitle="Allow notifications for weather updates and heavy rain alerts."
          value={weather}
          onToggle={() => setWeather(v => !v)}
          indent
        />

        <ToggleRow
          title="News"
          subtitle="Allow notifications for local flood-related news and advisories."
          value={news}
          onToggle={() => setNews(v => !v)}
          indent
        />
      </ScrollView>
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
    paddingHorizontal: s(22),
    height: vs(60),
  },
  backBtn: {
    width: s(36),
    height: s(36),
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Poppins_500Medium',
    fontSize: ms(16),
    color: '#1C1B1F',
    flex: 1,
    textAlign: 'center',
    marginRight: s(36),
  },
  scroll: {
    paddingTop: vs(16),
    paddingBottom: vs(40),
  },

  toggleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: s(38),
    paddingVertical: vs(14),
  },
  indented: {
    paddingLeft: s(50),
  },
  toggleTextWrap: {
    flex: 1,
    paddingRight: s(16),
  },
  toggleTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: ms(14),
    color: 'rgba(0,0,0,0.56)',
    marginBottom: vs(4),
  },
  toggleTitleSm: {
    fontSize: ms(12),
  },
  toggleSub: {
    fontFamily: 'Roboto_400Regular',
    fontSize: ms(12),
    lineHeight: ms(14),
    color: 'rgba(0,0,0,0.56)',
  },
  toggleSubSm: {
    fontSize: ms(10),
  },

  toggleTrack: {
    width: s(35),
    height: vs(18),
    borderRadius: s(10),
    backgroundColor: '#D9D9D9',
    justifyContent: 'center',
    paddingHorizontal: s(2),
  },
  toggleTrackOn: {
    backgroundColor: '#2938ad',
  },
  toggleThumb: {
    width: s(15),
    height: vs(16),
    borderRadius: s(8),
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
  },
  toggleThumbOn: {
    alignSelf: 'flex-end',
  },
});