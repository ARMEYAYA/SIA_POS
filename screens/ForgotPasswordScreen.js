import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Image, SafeAreaView,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { s, vs, ms } from './Scale';

const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!email) { setError('Email is required'); return; }
    if (!isValidEmail(email)) { setError('Enter a valid email address'); return; }
    setError('');
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      navigation.navigate('ForgotVerifyEmail', { email });
    } catch {
      setError('Could not send code. Please try again.');
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
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.container}>
          <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.heading}>Forgot Password</Text>
          <Text style={styles.subtext}>
            Please write your email to receive confirmation code
          </Text>
          <View style={[styles.inputBox, !!error && styles.inputErr]}>
            <TextInput
              style={styles.inputTxt}
              placeholder="Enter Email"
              placeholderTextColor="#A0A0A0"
              value={email}
              onChangeText={(v) => { setEmail(v); setError(''); }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          {!!error && <Text style={styles.errTxt}>{error}</Text>}
          <TouchableOpacity
            style={[styles.btn, (!email || loading) && styles.btnDisabled]}
            onPress={handleConfirm}
            disabled={!email || loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color="#0A3564" />
              : <Text style={styles.btnTxt}>Confirm Email</Text>}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
safe: { flex: 1, backgroundColor: '#55D6FE' },
  container: { flex: 1, alignItems: 'center', paddingHorizontal: s(38) },
  logo: { width: s(201), height: vs(113), marginTop: vs(100), marginLeft: s(-15) },
  heading: { fontFamily: 'Poppins_600SemiBold', fontSize: ms(32), color: '#0A3564', marginTop: vs(150), alignSelf: 'flex-start' },
  subtext: { fontFamily: 'Roboto_400Regular', fontSize: ms(14), color: '#000000', textAlign: 'center', marginTop: vs(16), alignSelf: 'flex-start', marginBottom: vs(20) },
  inputBox: {
    width: '100%', height: vs(49),
    backgroundColor: 'rgba(218,218,218,0.26)',
    borderWidth: 1, borderColor: '#FFFFFF',
    borderRadius: s(10), paddingHorizontal: s(16),
    justifyContent: 'center', marginBottom: vs(26),
  },
  inputErr: { borderColor: '#D90000' },
  inputTxt: { fontFamily: 'Roboto_500Medium', fontSize: ms(14), color: '#333' },
  errTxt: { fontFamily: 'Roboto_400Regular', fontSize: ms(11), color: '#D90000', alignSelf: 'flex-start', marginBottom: vs(12) },
  btn: { width: s(237), height: vs(40), backgroundColor: '#55D6FE', borderRadius: s(20), alignItems: 'center', justifyContent: 'center', marginTop: vs(16) },
  btnDisabled: { opacity: 0.5 },
  btnTxt: { fontFamily: 'Poppins_700Bold', fontSize: ms(15), color: '#0A3564' },
});