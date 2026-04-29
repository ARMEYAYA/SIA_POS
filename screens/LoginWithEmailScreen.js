import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Image, SafeAreaView,
  KeyboardAvoidingView, Platform, ScrollView,
  ActivityIndicator, TouchableWithoutFeedback, Keyboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { s, vs, ms } from './Scale';

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function InputField({ value, onChangeText, placeholder, secureTextEntry,
  keyboardType, error, showToggle, onToggle, showText, autoCapitalize }) {
  return (
    <View style={inp.wrapper}>
      <View style={[inp.box, error && inp.boxError]}>
        <TextInput
          style={inp.text}
          placeholder={placeholder}
          placeholderTextColor="#A0A0A0"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType || 'default'}
          autoCapitalize={autoCapitalize || 'none'}
          autoCorrect={false}
        />
        {showToggle && (
          <TouchableOpacity onPress={onToggle} style={inp.eye}>
            <Ionicons
              name={showText ? 'eye-outline' : 'eye-off-outline'}
              size={s(20)}
              color="#A0A0A0"
            />
          </TouchableOpacity>
        )}
      </View>
      {!!error && <Text style={inp.errTxt}>{error}</Text>}
    </View>
  );
}

export default function LoginWithEmailScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!email) e.email = 'Email is required';
    else if (!isValidEmail(email)) e.email = 'Enter a valid email address';
    if (!password) e.password = 'Password is required';
    else if (password.length < 8) e.password = 'Password must be at least 8 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      navigation.navigate('HomeScreen');
    } catch {
      setErrors({ general: 'Invalid email or password. Please try again.' });
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
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Image
              source={require('../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />

            <Text style={styles.heading}>Sign In</Text>
            <Text style={styles.subheading}>Hello, Welcome Back!</Text>

            {!!errors.general && (
              <View style={styles.generalErr}>
                <Ionicons name="alert-circle-outline" size={s(16)} color="#D90000" />
                <Text style={styles.generalErrTxt}>{errors.general}</Text>
              </View>
            )}

            <InputField
              placeholder="Email"
              value={email}
              onChangeText={(t) => { setEmail(t); setErrors((e) => ({ ...e, email: '' })); }}
              keyboardType="email-address"
              error={errors.email}
            />

            <InputField
              placeholder="Password"
              value={password}
              onChangeText={(t) => { setPassword(t); setErrors((e) => ({ ...e, password: '' })); }}
              secureTextEntry={!showPw}
              showToggle
              showText={showPw}
              onToggle={() => setShowPw(!showPw)}
              error={errors.password}
            />

            <TouchableOpacity
              style={styles.forgotWrap}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.forgotTxt}>Forgot Password</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.loginBtn, loading && styles.btnLoading]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading
                ? <ActivityIndicator color="#0A3564" />
                : <Text style={styles.loginTxt}>Log In</Text>}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.signUpWrap}
              onPress={() => navigation.navigate('SignUp')}
            >
              <Text style={styles.signUpTxt}>
                Don't have an account?{'  '}
                <Text style={styles.signUpLink}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: '#FFFFFF' },
  kav:         { flex: 1 },
  scroll:      { flexGrow: 1, paddingHorizontal: s(34), paddingBottom: vs(40) },
  logo:        { width: s(360), height: vs(113), marginTop: vs(100), marginLeft: s(-15), alignItems: 'center' },
  heading:     { fontFamily: 'Poppins_600SemiBold', fontSize: ms(36), color: '#0A3564', marginTop: vs(150) },
  subheading:  { fontFamily: 'Roboto_400Regular', fontSize: ms(15), color: '#000000', marginTop: vs(8), marginBottom: vs(20) },
  generalErr:  { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF0F0', borderRadius: s(8), padding: s(10), marginBottom: vs(10), gap: s(6) },
  generalErrTxt:{ fontFamily: 'Roboto_400Regular', fontSize: ms(12), color: '#D90000', flex: 1 },
  forgotWrap:  { alignSelf: 'flex-end', marginTop: vs(8), marginBottom: vs(16) },
  forgotTxt:   { fontFamily: 'Roboto_400Regular', fontSize: ms(11), color: '#000000' },
  loginBtn:    { height: vs(49), backgroundColor: '#55D6FE', borderRadius: s(20), alignItems: 'center', justifyContent: 'center' },
  btnLoading:  { opacity: 0.7 },
  loginTxt:    { fontFamily: 'Poppins_700Bold', fontSize: ms(16), color: '#0A3564' },
  signUpWrap:  { alignItems: 'center', marginTop: vs(20) },
  signUpTxt:   { fontFamily: 'Roboto_400Regular', fontSize: ms(14), color: '#0A3564' },
  signUpLink:  { fontFamily: 'Roboto_700Bold', textDecorationLine: 'underline' },
});

const inp = StyleSheet.create({
  wrapper:  { marginBottom: vs(4) },
  box:      { height: vs(49), backgroundColor: 'rgba(218,218,218,0.26)', borderWidth: 1, borderColor: '#FFFFFF', borderRadius: s(10), flexDirection: 'row', alignItems: 'center', paddingHorizontal: s(12) },
  boxError: { borderColor: '#D90000' },
  text:     { flex: 1, fontFamily: 'Roboto_500Medium', fontSize: ms(14), color: '#333333' },
  eye:      { padding: s(4) },
  errTxt:   { fontFamily: 'Roboto_400Regular', fontSize: ms(11), color: '#D90000', marginTop: vs(3), marginLeft: s(4) },
});