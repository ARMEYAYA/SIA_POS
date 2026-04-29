import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Image, SafeAreaView, Modal,
  KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { s, vs, ms } from './Scale';

// ── Requirement ───
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

// ── Success ───
function SuccessModal({ visible, onBack }) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={sm.overlay}>
        <LinearGradient
          colors={['#FFFFFF', '#DDF6FF', '#BAEDFF']}
          locations={[0, 0.25, 1]}
          style={sm.card}
        >
          <View style={sm.iconCircle}>
            <Ionicons name="checkmark" size={s(44)} color="#014BAA" />
          </View>
          <Text style={sm.title}>Password Changed!</Text>
          <Text style={sm.subtitle}>Your password has been changed successfully!</Text>
          <TouchableOpacity style={sm.backBtn} onPress={onBack}>
            <Text style={sm.backTxt}>Back to Login</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </Modal>
  );
}

const INITIAL_STATE = {
  newPw:       '',
  confirmPw:   '',
  showNew:     false,
  showConfirm: false,
  focused:     false,
  errors:      {},
  loading:     false,
  success:     false,
};

// ── Main Screen ulit ───
export default function NewPasswordScreen({ navigation }) {
  const [form, setForm] = useState(INITIAL_STATE);
  const isMounted = useRef(true);

  const patch = (delta) => setForm((prev) => ({ ...prev, ...delta }));

  useFocusEffect(
    useCallback(() => {
      isMounted.current = true;
      setForm(INITIAL_STATE);
      return () => { isMounted.current = false; };
    }, [])
  );

  const reqs = {
    length:  form.newPw.length >= 8,
    capital: /[A-Z]/.test(form.newPw),
    number:  /[0-9]/.test(form.newPw),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(form.newPw),
  };
  const allMet = Object.values(reqs).every(Boolean);

  const handleReset = async () => {
    const e = {};
    if (!form.newPw)                    e.newPw     = 'Password is required';
    else if (!allMet)                   e.newPw     = 'Password does not meet requirements';
    if (!form.confirmPw)                e.confirmPw = 'Please confirm your password';
    else if (form.newPw !== form.confirmPw) e.confirmPw = 'Passwords do not match';

    patch({ errors: e });
    if (Object.keys(e).length > 0) return;

    patch({ loading: true });
    try {
      await new Promise((r) => setTimeout(r, 1200));
      if (isMounted.current) patch({ success: true });
    } catch {
      if (isMounted.current) patch({ errors: { newPw: 'Reset failed. Please try again.' } });
    } finally {
      if (isMounted.current) patch({ loading: false });
    }
  };

  const handleBackToLogin = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'LoginWithEmail' }],
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={['#55D6FE', '#BAEDFF', '#FFFFFF']}
        locations={[0.0011, 0.5233, 0.9239]}
        style={StyleSheet.absoluteFillObject}
      />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.heading}>New Password</Text>

          {/* New Password field */}
          <View style={[styles.inputBox, !!form.errors.newPw && styles.inputErr]}>
            <TextInput
              style={[styles.inputTxt, { flex: 1 }]}
              placeholder="New Password"
              placeholderTextColor="#A0A0A0"
              value={form.newPw}
              onChangeText={(v) => patch({ newPw: v, errors: { ...form.errors, newPw: '' } })}
              secureTextEntry={!form.showNew}
              onFocus={() => patch({ focused: true })}
              onBlur={() => patch({ focused: false })}
            />
            <TouchableOpacity onPress={() => patch({ showNew: !form.showNew })}>
              <Ionicons name={form.showNew ? 'eye-outline' : 'eye-off-outline'} size={s(18)} color="#A0A0A0" />
            </TouchableOpacity>
          </View>
          {!!form.errors.newPw && <Text style={styles.errTxt}>{form.errors.newPw}</Text>}

          {/* Requirements */}
          {(form.focused || form.newPw.length > 0) && (
            <View style={styles.reqs}>
              <ReqRow met={reqs.length}  label="Minimum of 8 - 10 characters" />
              <ReqRow met={reqs.capital} label="Must contain at least 1 Capital Letter" />
              <ReqRow met={reqs.number}  label="Must contain at least 1 number" />
              <ReqRow met={reqs.special} label="Must contain at least 1 Special character" />
            </View>
          )}

          {/* Confirm Password */}
          <View style={[styles.inputBox, { marginTop: vs(16) }, !!form.errors.confirmPw && styles.inputErr]}>
            <TextInput
              style={[styles.inputTxt, { flex: 1 }]}
              placeholder="Confirm New Password"
              placeholderTextColor="#A0A0A0"
              value={form.confirmPw}
              onChangeText={(v) => patch({ confirmPw: v, errors: { ...form.errors, confirmPw: '' } })}
              secureTextEntry={!form.showConfirm}
            />
            <TouchableOpacity onPress={() => patch({ showConfirm: !form.showConfirm })}>
              <Ionicons name={form.showConfirm ? 'eye-outline' : 'eye-off-outline'} size={s(18)} color="#A0A0A0" />
            </TouchableOpacity>
          </View>
          {!!form.errors.confirmPw && <Text style={styles.errTxt}>{form.errors.confirmPw}</Text>}

          {/* Reset button */}
          <TouchableOpacity
            style={[styles.resetBtn, form.loading && styles.btnLoading]}
            onPress={handleReset}
            disabled={form.loading}
            activeOpacity={0.85}
          >
            {form.loading
              ? <ActivityIndicator color="#0A3564" />
              : <Text style={styles.resetTxt}>Reset Password</Text>}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <SuccessModal visible={form.success} onBack={handleBackToLogin} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: '#55D6FE' },
  scroll:    { flexGrow: 1, alignItems: 'center', paddingHorizontal: s(41), paddingBottom: vs(40) },
  logo:      { width: s(201), height: vs(113), marginTop: vs(100), marginLeft: s(-15) },
  heading:   { fontFamily: 'Poppins_600SemiBold', fontSize: ms(32), color: '#0A3564', marginTop: vs(116), alignSelf: 'flex-start', marginBottom: vs(20) },
  inputBox: {
    width: '100%', height: vs(49),
    backgroundColor: 'rgba(218,218,218,0.26)',
    borderWidth: 1, borderColor: '#FFFFFF',
    borderRadius: s(10), paddingHorizontal: s(14),
    flexDirection: 'row', alignItems: 'center',
  },
  inputErr:  { borderColor: '#D90000' },
  inputTxt:  { fontFamily: 'Roboto_500Medium', fontSize: ms(14), color: '#333' },
  errTxt:    { fontFamily: 'Roboto_400Regular', fontSize: ms(11), color: '#D90000', marginTop: vs(3), marginLeft: s(4) },
  reqs:      { marginTop: vs(8), gap: vs(4) },
  resetBtn:  { width: s(237), height: vs(41), backgroundColor: '#55D6FE', borderRadius: s(20), alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginTop: vs(24) },
  btnLoading:{ opacity: 0.7 },
  resetTxt:  { fontFamily: 'Poppins_700Bold', fontSize: ms(15), color: '#0A3564' },
});

const req = StyleSheet.create({
  row:   { flexDirection: 'row', alignItems: 'center', gap: s(6) },
  icon:  { width: s(15), height: s(15), borderRadius: s(2), alignItems: 'center', justifyContent: 'center' },
  label: { fontFamily: 'Roboto_400Regular', fontSize: ms(11) },
});

const sm = StyleSheet.create({
  overlay:    { flex: 1, backgroundColor: 'rgba(13,13,13,0.59)', alignItems: 'center', justifyContent: 'center' },
  card:       { width: s(358), borderRadius: s(20), padding: s(28), alignItems: 'center' },
  iconCircle: { width: s(78), height: s(78), borderRadius: s(39), backgroundColor: '#D9D9D9', alignItems: 'center', justifyContent: 'center', marginBottom: vs(10) },
  title:      { fontFamily: 'Poppins_600SemiBold', fontSize: ms(22), color: '#0A3564', marginBottom: vs(4) },
  subtitle:   { fontFamily: 'Roboto_400Regular', fontSize: ms(14), color: '#000000', textAlign: 'center', marginBottom: vs(20) },
  backBtn:    { width: s(237), height: vs(41), backgroundColor: '#FFFFFF', borderRadius: s(20), alignItems: 'center', justifyContent: 'center' },
  backTxt:    { fontFamily: 'Poppins_700Bold', fontSize: ms(15), color: '#0A3564' },
});