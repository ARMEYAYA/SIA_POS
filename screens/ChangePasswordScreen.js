import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  StatusBar as RNStatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { s, vs, ms } from './Scale';

// ── Password Input ──
function PasswordInput({ placeholder, value, onChangeText }) {
  const [visible, setVisible] = useState(false);
  return (
    <View style={styles.inputWrap}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#A0A0A0"
        secureTextEntry={!visible}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
      />
      <TouchableOpacity onPress={() => setVisible(v => !v)} activeOpacity={0.7} style={styles.eyeBtn}>
        <Ionicons name={visible ? 'eye' : 'eye-off'} size={s(18)} color="#A0A0A0" />
      </TouchableOpacity>
    </View>
  );
}

// ── Main Screen ──
export default function ChangePasswordScreen({ navigation }) {
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [logoutOthers, setLogoutOthers] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={s(24)} color="#0A3564" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Password</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.sectionTitle}>Change Password</Text>
        <Text style={styles.subtitle}>
          Your password must be at least 8 - 10 characters and should include a combination of
          numbers, letters and special characters (!$@%).
        </Text>

        {/* Inputs */}
        <PasswordInput
          placeholder="Current Password"
          value={current}
          onChangeText={setCurrent}
        />
        <PasswordInput
          placeholder="New Password"
          value={newPass}
          onChangeText={setNewPass}
        />
        <PasswordInput
          placeholder="Confirm New Password"
          value={confirm}
          onChangeText={setConfirm}
        />

        {/* Forgot Password */}
        <TouchableOpacity activeOpacity={0.7} style={styles.forgotBtn}>
          <Text style={styles.forgotTxt}>Forgot Password?</Text>
        </TouchableOpacity>

        <View style={styles.checkRow}>
          <TouchableOpacity
            onPress={() => setLogoutOthers(v => !v)}
            activeOpacity={0.8}
            style={[styles.checkbox, logoutOthers && styles.checkboxChecked]}
          >
            {logoutOthers && <Ionicons name="checkmark" size={s(12)} color="#0A3564" />}
          </TouchableOpacity>
          <Text style={styles.checkLabel}>Log out of other devices.</Text>
        </View>

        {/* Submit button */}
        <TouchableOpacity style={styles.submitBtn} activeOpacity={0.85}>
          <Text style={styles.submitTxt}>Change Password</Text>
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
  scroll: {
    paddingHorizontal: s(33),
    paddingBottom: vs(40),
  },

  sectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: ms(20),
    color: 'rgba(0,0,0,0.56)',
    marginTop: vs(18),
    marginBottom: vs(8),
  },
  subtitle: {
    fontFamily: 'Roboto_400Regular',
    fontSize: ms(14),
    lineHeight: ms(16),
    color: '#48464C',
    marginBottom: vs(24),
  },

  inputWrap: {
    width: '100%',
    height: vs(49),
    borderWidth: 1,
    borderColor: '#A0A0A0',
    borderRadius: s(10),
    backgroundColor: 'rgba(218,218,218,0.26)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(12),
    marginBottom: vs(12),
  },
  input: {
    flex: 1,
    fontFamily: 'Roboto_500Medium',
    fontSize: ms(15),
    color: '#000000',
  },
  eyeBtn: {
    padding: s(4),
  },

  // Forgot
  forgotBtn: {
    alignSelf: 'flex-start',
    marginTop: vs(4),
    marginBottom: vs(10),
  },
  forgotTxt: {
    fontFamily: 'Roboto_700Bold',
    fontSize: ms(14),
    color: '#0A3564',
  },

  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
    marginBottom: vs(28),
  },
  checkbox: {
    width: s(17),
    height: vs(16),
    borderWidth: 1,
    borderColor: '#A0A0A0',
    borderRadius: s(5),
    backgroundColor: 'rgba(218,218,218,0.26)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: 'rgba(85,214,254,0.3)',
    borderColor: '#0A3564',
  },
  checkLabel: {
    fontFamily: 'Roboto_400Regular',
    fontSize: ms(13),
    color: '#48464C',
  },

  // Submit
  submitBtn: {
    alignSelf: 'center',
    width: s(237),
    height: vs(41),
    backgroundColor: '#55D6FE',
    borderRadius: s(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitTxt: {
    fontFamily: 'Poppins_700Bold',
    fontSize: ms(16),
    color: '#0A3564',
  },
});