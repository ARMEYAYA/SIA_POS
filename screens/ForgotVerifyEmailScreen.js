import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Image, SafeAreaView, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { s, vs, ms } from './Scale';

const RESEND_SECS = 60;

export default function ForgotVerifyEmailScreen({ navigation, route }) {
  const email = route?.params?.email || 'your email';
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
    const c = [...code]; c[i] = text; setCode(c); setError('');
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
    if (code.join('').length < 4) { setError('Enter the 4-digit code.'); return; }
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      navigation.navigate('NewPassword');
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
        <Text style={styles.heading}>Forgot Password</Text>
        <Text style={styles.subHeading}>Verify Email</Text>
        <Text style={styles.subtext}>Verification code sent to {email}</Text>

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

        <TouchableOpacity
          style={[styles.btn, (!filled || loading) && styles.btnDisabled]}
          onPress={handleConfirm}
          disabled={!filled || loading}
          activeOpacity={0.85}
        >
          {loading
            ? <ActivityIndicator color="#0A3564" />
            : <Text style={styles.btnTxt}>Confirm Code</Text>}
        </TouchableOpacity>

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
  logo: { width: s(201), height: vs(113), marginTop: vs(100), marginLeft: s(-15) },
  heading: { fontFamily: 'Poppins_600SemiBold', fontSize: ms(28), color: '#0A3564', marginTop: vs(72) },
  subHeading: { fontFamily: 'Poppins_500Medium', fontSize: ms(22), color: '#0A3564', marginTop: vs(6) },
  subtext: { fontFamily: 'Roboto_400Regular', fontSize: ms(14), color: '#000000', textAlign: 'center', marginTop: vs(10), marginBottom: vs(20), paddingHorizontal: s(10) },
  otpRow: { flexDirection: 'row', gap: s(8), marginBottom: vs(14) },
  otpBox: {
    width: s(70), height: vs(80),
    backgroundColor: 'rgba(218,218,218,0.26)',
    borderWidth: 1, borderColor: '#FFFFFF',
    borderRadius: s(20), alignItems: 'center', justifyContent: 'center',
  },
  otpBoxFilled: { borderColor: '#55D6FE', backgroundColor: 'rgba(85,214,254,0.1)' },
  otpInput: { fontFamily: 'Roboto_500Medium', fontSize: ms(40), color: '#333', width: '100%' },
  errTxt: { fontFamily: 'Roboto_400Regular', fontSize: ms(12), color: '#D90000', marginBottom: vs(8) },
  btn: { width: s(237), height: vs(41), backgroundColor: '#55D6FE', borderRadius: s(20), alignItems: 'center', justifyContent: 'center', marginBottom: vs(14) },
  btnDisabled: { opacity: 0.5 },
  btnTxt: { fontFamily: 'Poppins_700Bold', fontSize: ms(15), color: '#0A3564' },
  resendTxt: { fontFamily: 'Roboto_400Regular', fontSize: ms(14), color: '#0A3564' },
  resendActive: { textDecorationLine: 'underline' },
});