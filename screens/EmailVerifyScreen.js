import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Image, SafeAreaView, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { s, vs, ms } from './Scale';

const RESEND_SECS = 56;

export default function EmailVerifyScreen({ navigation }) {
  const [code, setCode] = useState(['', '', '', '']);
  const [countdown, setCountdown] = useState(RESEND_SECS);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputs = useRef([]);

  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return; }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleChange = (text, i) => {
    const c = [...code];
    c[i] = text;
    setCode(c);
    setError('');
    if (text && i < 3) inputs.current[i + 1]?.focus();
  };

  const handleKeyPress = (e, i) => {
    if (e.nativeEvent.key === 'Backspace' && !code[i] && i > 0)
      inputs.current[i - 1]?.focus();
  };

  const handleResend = () => {
    if (!canResend) return;
    setCode(['', '', '', '']);
    setCountdown(RESEND_SECS);
    setCanResend(false);
    inputs.current[0]?.focus();
  };

  const handleConfirm = async () => {
    const full = code.join('');
    if (full.length < 4) { setError('Please enter the 4-digit code.'); return; }
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      navigation.navigate('HomeScreen');
    } catch {
      setError('Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fmt = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  const filled = code.every((d) => d !== '');

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={['#55D6FE', '#BAEDFF', '#FFFFFF']}
        locations={[0.0011, 0.5233, 0.9239]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.container}>
        <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />

        <Text style={styles.heading}>Verify Email</Text>
        <Text style={styles.subtext}>
          We have sent the verification code to your address
        </Text>

        {/* OTP boxes */}
        <View style={styles.otpRow}>
          {code.map((digit, i) => (
            <View key={i} style={[styles.otpBox, digit && styles.otpBoxFilled]}>
              <TextInput
                ref={(el) => (inputs.current[i] = el)}
                style={styles.otpInput}
                value={digit}
                onChangeText={(t) => handleChange(t.slice(-1), i)}
                onKeyPress={(e) => handleKeyPress(e, i)}
                keyboardType="number-pad"
                maxLength={1}
                textAlign="center"
                placeholder="0"
                placeholderTextColor="rgba(0,0,0,0.25)"
              />
            </View>
          ))}
        </View>

        {!!error && <Text style={styles.errTxt}>{error}</Text>}

        {/* Confirm button */}
        <TouchableOpacity
          style={[styles.confirmBtn, (!filled || loading) && styles.btnDisabled]}
          onPress={handleConfirm}
          disabled={!filled || loading}
          activeOpacity={0.85}
        >
          {loading
            ? <ActivityIndicator color="#0A3564" />
            : <Text style={styles.confirmTxt}>Confirm Email</Text>}
        </TouchableOpacity>

        {/* Resend */}
        <TouchableOpacity onPress={handleResend} disabled={!canResend}>
          <Text style={[styles.resendTxt, canResend && styles.resendActive]}>
            {canResend ? 'Resend Code' : `Resend Code in ${fmt(countdown)}`}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#55D6FE' },
  container: { flex: 1, alignItems: 'center', paddingHorizontal: s(21) },
  logo: { width: s(201), height: vs(113), marginTop: vs(58), alignSelf: 'flex-start', marginLeft: s(-15) },
  heading: { fontFamily: 'Poppins_600SemiBold', fontSize: ms(36), color: '#0A3564', marginTop: vs(45), alignSelf: 'center' },
  subtext: {
    fontFamily: 'Roboto_400Regular', fontSize: ms(14),
    color: '#A0A0A0', textAlign: 'center',
    marginTop: vs(16), marginBottom: vs(24), paddingHorizontal: s(20),
  },
  otpRow: { flexDirection: 'row', gap: s(10), marginBottom: vs(16) },
  otpBox: {
    width: s(75), height: vs(102),
    backgroundColor: 'rgba(218,218,218,0.26)',
    borderWidth: 1, borderColor: '#FFFFFF',
    borderRadius: s(20), alignItems: 'center', justifyContent: 'center',
  },
  otpBoxFilled: { borderColor: '#55D6FE', backgroundColor: 'rgba(85,214,254,0.1)' },
  otpInput: {
    fontFamily: 'Roboto_500Medium',
    fontSize: ms(48), color: '#333333', width: '100%',
  },
  errTxt: {
    fontFamily: 'Roboto_400Regular', fontSize: ms(12),
    color: '#D90000', marginBottom: vs(8),
  },
  confirmBtn: {
    width: s(237), height: vs(51),
    backgroundColor: '#55D6FE', borderRadius: s(10),
    alignItems: 'center', justifyContent: 'center', marginBottom: vs(14),
  },
  btnDisabled: { opacity: 0.5 },
  confirmTxt: { fontFamily: 'Poppins_700Bold', fontSize: ms(15), color: '#0A3564' },
  resendTxt: { fontFamily: 'Roboto_400Regular', fontSize: ms(14), color: 'rgba(0,0,0,0.56)' },
  resendActive: { color: '#0A3564', textDecorationLine: 'underline' },
});