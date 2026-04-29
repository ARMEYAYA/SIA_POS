import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Image, SafeAreaView, ScrollView, Modal,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { s, vs, ms } from './Scale';

const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

function ReqRow({ met, label }) {
  return (
    <View style={req.row}>
      <View style={[req.icon, { backgroundColor: met ? '#13BC21' : '#D90000' }]}>
        <Ionicons name={met ? 'checkmark' : 'close'} size={s(9)} color="#FFF" />
      </View>
      <Text style={[req.label, { color: met ? '#13BC21' : '#D90000' }]}>{label}</Text>
    </View>
  );
}

function PermissionModal({ visible, title, body, onDeny, onAllow, allowLabel }) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={pm.overlay}>
        <LinearGradient
          colors={['#FFFFFF', '#DDF6FF', '#BAEDFF']}
          locations={[0, 0.25, 1]}
          style={pm.card}
        >
          <Text style={pm.title}>{title}</Text>
          <Text style={pm.body}>{body}</Text>
          <View style={pm.row}>
            <TouchableOpacity style={pm.denyBtn} onPress={onDeny}>
              <Text style={pm.denyTxt}>Don't Allow</Text>
            </TouchableOpacity>
            <TouchableOpacity style={pm.allowBtn} onPress={onAllow}>
              <Text style={pm.allowTxt}>{allowLabel}</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
}

export default function SignUpScreen({ navigation }) {
  const [form, setForm] = useState({
    lastName: '', firstName: '', mi: '',
    email: '', street: '', barangay: '',
    city: '', province: '', password: '', confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwFocused, setPwFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locationModal, setLocationModal] = useState(false);
  const [notifModal, setNotifModal] = useState(false);

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: '' }));
  };

  const pw = form.password;
  const reqs = {
    length: pw.length >= 8,
    capital: /[A-Z]/.test(pw),
    number: /[0-9]/.test(pw),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(pw),
  };
  const allReqsMet = Object.values(reqs).every(Boolean);

  const validate = () => {
    const e = {};
    if (!form.lastName.trim()) e.lastName = 'Required';
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.email) e.email = 'Email is required';
    else if (!isValidEmail(form.email)) e.email = 'Enter a valid email';
    if (!form.street.trim()) e.street = 'Street is required';
    if (!form.barangay.trim()) e.barangay = 'Barangay is required';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.province.trim()) e.province = 'Province is required';
    if (!form.password) e.password = 'Password is required';
    else if (!allReqsMet) e.password = 'Password does not meet requirements';
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreateAccount = () => {
    if (!validate()) return;
    setLocationModal(true);
  };

  const afterPermissions = async () => {
  setNotifModal(false);
  setLoading(true);
  try {
    await new Promise((r) => setTimeout(r, 1500));
    navigation.navigate('HomeScreen');  
  } catch {
    setErrors({ general: 'Registration failed. Please try again.' });
  } finally {
    setLoading(false);
  }
};

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={['#55D6FE', '#BAEDFF', '#FFFFFF']}
        locations={[0.0011, 0.5233, 0.9239]}
        style={StyleSheet.absoluteFillObject}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />

          <Text style={styles.heading}>Sign Up</Text>
          <Text style={styles.subheading}>Hello, Welcome Back!</Text>

          {!!errors.general && (
            <Text style={styles.genErr}>{errors.general}</Text>
          )}

          <Text style={styles.sectionLabel}>Name:</Text>
          <View style={styles.nameRow}>
            <View style={{ flex: 1.4 }}>
              <TextInput
                style={[styles.input, !!errors.lastName && styles.inputErr]}
                placeholder="Last Name"
                placeholderTextColor="#A0A0A0"
                value={form.lastName}
                onChangeText={(v) => set('lastName', v)}
              />
              {!!errors.lastName && <Text style={styles.errTxt}>{errors.lastName}</Text>}
            </View>
            <View style={{ flex: 1.6 }}>
              <TextInput
                style={[styles.input, !!errors.firstName && styles.inputErr]}
                placeholder="First Name"
                placeholderTextColor="#A0A0A0"
                value={form.firstName}
                onChangeText={(v) => set('firstName', v)}
              />
              {!!errors.firstName && <Text style={styles.errTxt}>{errors.firstName}</Text>}
            </View>
            <View style={{ width: s(52) }}>
              <TextInput
                style={styles.input}
                placeholder="M.I"
                placeholderTextColor="rgba(0,0,0,0.4)"
                value={form.mi}
                onChangeText={(v) => set('mi', v)}
                maxLength={1}
              />
            </View>
          </View>

          <Text style={styles.sectionLabel}>Email Address:</Text>
          <TextInput
            style={[styles.input, styles.fullInput, !!errors.email && styles.inputErr]}
            placeholder="@gmail.com"
            placeholderTextColor="#A0A0A0"
            value={form.email}
            onChangeText={(v) => set('email', v)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {!!errors.email && <Text style={styles.errTxt}>{errors.email}</Text>}

          <Text style={styles.sectionLabel}>Address:</Text>
          <TextInput
            style={[styles.input, styles.fullInput, !!errors.street && styles.inputErr]}
            placeholder="Street"
            placeholderTextColor="#A0A0A0"
            value={form.street}
            onChangeText={(v) => set('street', v)}
          />
          {!!errors.street && <Text style={styles.errTxt}>{errors.street}</Text>}

          <View style={styles.addressRow}>
            <View style={{ flex: 1.4 }}>
              <TextInput
                style={[styles.input, !!errors.barangay && styles.inputErr]}
                placeholder="Barangay"
                placeholderTextColor="#A0A0A0"
                value={form.barangay}
                onChangeText={(v) => set('barangay', v)}
              />
              {!!errors.barangay && <Text style={styles.errTxt}>{errors.barangay}</Text>}
            </View>
            <View style={{ flex: 1 }}>
              <TextInput
                style={[styles.input, !!errors.city && styles.inputErr]}
                placeholder="City"
                placeholderTextColor="#A0A0A0"
                value={form.city}
                onChangeText={(v) => set('city', v)}
              />
              {!!errors.city && <Text style={styles.errTxt}>{errors.city}</Text>}
            </View>
          </View>

          <TextInput
            style={[styles.input, styles.fullInput, !!errors.province && styles.inputErr]}
            placeholder="Province"
            placeholderTextColor="#A0A0A0"
            value={form.province}
            onChangeText={(v) => set('province', v)}
          />
          {!!errors.province && <Text style={styles.errTxt}>{errors.province}</Text>}

          <Text style={styles.sectionLabel}>Password:</Text>
          <View style={[styles.input, styles.fullInput, styles.rowInput,
            !!errors.password && styles.inputErr]}>
            <TextInput
              style={[styles.inputTxt, { flex: 1 }]}
              placeholder="Password"
              placeholderTextColor="#A0A0A0"
              value={form.password}
              onChangeText={(v) => set('password', v)}
              secureTextEntry={!showPw}
              onFocus={() => setPwFocused(true)}
              onBlur={() => setPwFocused(false)}
            />
            <TouchableOpacity onPress={() => setShowPw(!showPw)}>
              <Ionicons
                name={showPw ? 'eye-outline' : 'eye-off-outline'}
                size={s(18)} color="#A0A0A0"
              />
            </TouchableOpacity>
          </View>
          {!!errors.password && <Text style={styles.errTxt}>{errors.password}</Text>}

          {(pwFocused || pw.length > 0) && (
            <View style={styles.reqs}>
              <ReqRow met={reqs.length} label="Minimum of 8 - 10 characters" />
              <ReqRow met={reqs.capital} label="Must contain at least 1 Capital Letter" />
              <ReqRow met={reqs.number} label="Must contain at least 1 number" />
              <ReqRow met={reqs.special} label="Must contain at least 1 Special character" />
            </View>
          )}

          <View style={[styles.input, styles.fullInput, styles.rowInput,
            { marginTop: vs(12) }, !!errors.confirmPassword && styles.inputErr]}>
            <TextInput
              style={[styles.inputTxt, { flex: 1 }]}
              placeholder="Confirm Password"
              placeholderTextColor="#A0A0A0"
              value={form.confirmPassword}
              onChangeText={(v) => set('confirmPassword', v)}
              secureTextEntry={!showConfirm}
            />
            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
              <Ionicons
                name={showConfirm ? 'eye-outline' : 'eye-off-outline'}
                size={s(18)} color="#A0A0A0"
              />
            </TouchableOpacity>
          </View>
          {!!errors.confirmPassword && (
            <Text style={styles.errTxt}>{errors.confirmPassword}</Text>
          )}

          <TouchableOpacity
            style={[styles.createBtn, loading && { opacity: 0.7 }]}
            onPress={handleCreateAccount}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color="#0A3564" />
              : <Text style={styles.createTxt}>Create Account</Text>}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.navigate('LoginWithEmail')}
          >
            <Text style={styles.loginLinkTxt}>
              Already have an account?{'  '}
              <Text style={styles.loginLinkBold}>Log In</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <PermissionModal
        visible={locationModal}
        title="Allow Location"
        body="Enable location access to provide accurate flood alerts, weather updates, and nearby safety information in your area."
        allowLabel="Allow Location"
        onDeny={() => { setLocationModal(false); setNotifModal(true); }}
        onAllow={() => { setLocationModal(false); setNotifModal(true); }}
      />
      <PermissionModal
        visible={notifModal}
        title="Allow Notifications"
        body="Turn on notifications to receive real-time flood alerts, weather updates, and important safety announcements."
        allowLabel="Allow Notifications"
        onDeny={() => afterPermissions()}
        onAllow={() => afterPermissions()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll:      { flexGrow: 1, paddingHorizontal: s(34), paddingBottom: vs(40) },
  logo:        { width: s(360), height: vs(113), marginTop: vs(100), marginLeft: s(-15), alignItems: 'center' },
  heading: { fontFamily: 'Poppins_600SemiBold', fontSize: ms(34), color: '#0A3564', marginTop: vs(82) },
  subheading: { fontFamily: 'Roboto_400Regular', fontSize: ms(14), color: '#000000', marginBottom: vs(16) },
  genErr: { fontFamily: 'Roboto_400Regular', fontSize: ms(12), color: '#D90000', marginBottom: vs(8) },
  sectionLabel: {
    fontFamily: 'Poppins_700Bold', fontSize: ms(11),
    color: '#0A3564', marginBottom: vs(4), marginTop: vs(10),
  },
  nameRow: { flexDirection: 'row', gap: s(6) },
  addressRow: { flexDirection: 'row', gap: s(6), marginTop: vs(6), marginBottom: vs(6) },
  input: {
    height: vs(49),
    backgroundColor: 'rgba(218,218,218,0.26)',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: s(10),
    paddingHorizontal: s(12),
    fontFamily: 'Roboto_500Medium',
    fontSize: ms(13),
    color: 'rgba(0,0,0,0.56)',
  },
  fullInput: { width: '100%', marginTop: vs(2) },
  inputErr: { borderColor: '#D90000' },
  rowInput: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: s(12), height: vs(49),
  },
  inputTxt: { fontFamily: 'Roboto_500Medium', fontSize: ms(13), color: 'rgba(0,0,0,0.56)' },
  errTxt: { fontFamily: 'Roboto_400Regular', fontSize: ms(10), color: '#D90000', marginTop: vs(2), marginLeft: s(4) },
  reqs: { marginTop: vs(6), gap: vs(3) },
  createBtn: {
    height: vs(44),
    backgroundColor: '#55D6FE',
    borderRadius: s(20),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: vs(20),
  },
  createTxt: { fontFamily: 'Poppins_700Bold', fontSize: ms(15), color: '#0A3564' },
  loginLink: { alignItems: 'center', marginTop: vs(14) },
  loginLinkTxt: { fontFamily: 'Roboto_400Regular', fontSize: ms(14), color: 'rgba(0,0,0,0.56)' },
  loginLinkBold: { fontFamily: 'Roboto_700Bold' },
});

const req = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: s(6) },
  icon: { width: s(15), height: s(15), borderRadius: s(2), alignItems: 'center', justifyContent: 'center' },
  label: { fontFamily: 'Roboto_400Regular', fontSize: ms(11) },
});

const pm = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(13,13,13,0.59)', alignItems: 'center', justifyContent: 'center' },
  card: { width: s(358), borderRadius: s(20), padding: s(24), alignItems: 'center' },
  title: { fontFamily: 'Poppins_600SemiBold', fontSize: ms(18), lineHeight: ms(28), color: '#0A3564', marginBottom: vs(8) },
  body: { fontFamily: 'Roboto_400Regular', fontSize: ms(14), lineHeight: ms(20), color: 'rgba(0,0,0,0.56)', textAlign: 'center', marginBottom: vs(20) },
  row: { flexDirection: 'row', gap: s(12), width: '100%' },
  denyBtn: { flex: 1, height: vs(37), backgroundColor: '#FFFFFF', borderRadius: s(20), alignItems: 'center', justifyContent: 'center' },
  denyTxt: { fontFamily: 'Poppins_600SemiBold', fontSize: ms(13), color: '#0A3564' },
  allowBtn: { flex: 1, height: vs(37), backgroundColor: '#55D6FE', borderRadius: s(20), alignItems: 'center', justifyContent: 'center' },
  allowTxt: { fontFamily: 'Poppins_600SemiBold', fontSize: ms(13), color: '#0A3564' },
});