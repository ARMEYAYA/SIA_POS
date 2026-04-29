import React from 'react';
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
import * as ImagePicker from 'expo-image-picker';
import { s, vs, ms } from './Scale';
import { useProfile } from './AppContext';

function SectionHeader({ title }) {
  return <Text style={styles.sectionHeader}>{title}</Text>;
}

function MenuRow({ label, onPress, sublabel, bold }) {
  return (
    <TouchableOpacity style={styles.menuRow} onPress={onPress} activeOpacity={0.7}>
      <Text style={[styles.menuLabel, bold && styles.menuLabelBold]}>{label}</Text>
      <View style={styles.menuRight}>
        {sublabel ? <Text style={styles.menuSublabel}>{sublabel}</Text> : null}
        {onPress && !bold && <Ionicons name="chevron-forward" size={s(13)} color="#000000" />}
      </View>
    </TouchableOpacity>
  );
}

// ── Main ProfileScreen ───
export default function ProfileScreen({ navigation }) {
  const { profile, updateProfile } = useProfile();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });

    if (!result.canceled && result.assets?.length > 0) {
      updateProfile({ avatarUri: result.assets[0].uri });
    }
  };

  const displayEmail = profile.email || '—';

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={s(24)} color="#0A3564" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your account</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarOuter}>
            {profile.avatarUri ? (
              <Image source={{ uri: profile.avatarUri }} style={styles.avatarImg} />
            ) : (
              <Ionicons name="person-circle" size={s(171)} color="#D9D9D9" />
            )}
            <TouchableOpacity style={styles.cameraBtn} onPress={pickImage} activeOpacity={0.8}>
              <Ionicons name="camera" size={s(16)} color="#1C1B1F" />
            </TouchableOpacity>
          </View>

          {/* Name */}
          <Text style={styles.userName}>{profile.name || 'Your Name'}</Text>

          {/*Email*/}
          <Text style={styles.userEmail}>{displayEmail}</Text>
        </View>

        {/* Settings */}
        <SectionHeader title="Settings" />
        <MenuRow
          label="Personal Information"
          onPress={() => navigation.navigate('PersonalInformation')}
        />
        <MenuRow
          label="Password"
          sublabel="Change password"
          onPress={() => navigation.navigate('ChangePassword')}
        />
        <MenuRow
          label="Permission"
          onPress={() => navigation.navigate('Notification')}
        />

        {/* Support */}
        <SectionHeader title="Support" />
        <TouchableOpacity style={styles.menuRow} activeOpacity={0.7}>
          <Text style={styles.supportLabel}>Terms of Service</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuRow} activeOpacity={0.7}>
          <Text style={styles.supportLabel}>Privacy and Policy</Text>
        </TouchableOpacity>

        {/* Logout */}
        <SectionHeader title="LogOut" />
        <MenuRow
          label="Delete Account"
          onPress={() => navigation.navigate('ManageAccount')}
        />
        <TouchableOpacity style={styles.menuRow} activeOpacity={0.7}>
          <Text style={styles.logoutLabel}>LogOut</Text>
        </TouchableOpacity>
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
  scroll: { paddingBottom: vs(40) },

  avatarSection: {
    alignItems: 'center',
    paddingTop: vs(20),
    paddingBottom: vs(20),
  },
  avatarOuter: {
    width: s(171),
    height: s(171),
    borderRadius: s(85),
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarImg: {
    width: s(171),
    height: s(171),
    borderRadius: s(85),
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: s(32),
    height: s(32),
    borderRadius: s(16),
    backgroundColor: '#D9D9D9',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  userName: {
    fontFamily: 'Poppins_700Bold',
    fontSize: ms(20),
    color: '#48464C',
    marginTop: vs(12),
  },
  userEmail: {
    fontFamily: 'Poppins_500Medium',
    fontSize: ms(13),
    color: 'rgba(0,0,0,0.56)',
    marginTop: vs(2),
  },

  // Sections
  sectionHeader: {
    fontFamily: 'Poppins_500Medium',
    fontSize: ms(20),
    color: 'rgba(0,0,0,0.56)',
    marginLeft: s(22),
    marginTop: vs(18),
    marginBottom: vs(4),
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(37),
    paddingVertical: vs(10),
  },
  menuLabel:     { fontFamily: 'Poppins_400Regular', fontSize: ms(16), color: '#48464C' },
  menuLabelBold: { fontFamily: 'Poppins_700Bold',    color: '#0A3564' },
  menuRight:     { flexDirection: 'row', alignItems: 'center', gap: s(6) },
  menuSublabel:  { fontFamily: 'Roboto_400Regular',  fontSize: ms(10), color: '#000000' },
  logoutLabel:   { fontFamily: 'Poppins_700Bold',    fontSize: ms(16), color: '#0A3564' },
  supportLabel:  { fontFamily: 'Poppins_500Medium',  fontSize: ms(16), color: '#48464C', marginLeft: s(6) },
});