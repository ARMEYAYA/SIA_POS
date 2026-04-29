import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, Image, SafeAreaView, Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { s, vs, ms } from './Scale';

function GoogleModal({ visible, onCancel, onContinue }) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={modal.overlay}>
        <LinearGradient
          colors={['#FFFFFF', '#DDF6FF', '#BAEDFF']}
          locations={[0, 0.25, 1]}
          style={modal.card}
        >
          <Text style={modal.title}>
            "FLOODGUARD" Wants to Use{'\n'}"google.com" to Sign In
          </Text>
          <Text style={modal.sub}>
            This allows the app to share information about you
          </Text>
          <View style={modal.row}>
            <TouchableOpacity style={modal.cancelBtn} onPress={onCancel}>
              <Text style={modal.cancelTxt}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={modal.continueBtn} onPress={onContinue}>
              <Text style={modal.continueTxt}>Continue</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
}

export default function LoginMethodScreen({ navigation }) {
  const [googleModal, setGoogleModal] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={['#55D6FE', '#BAEDFF', '#FFFFFF']}
        locations={[0.0011, 0.5233, 0.9239]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.container}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.headline}>
          Log in to FLOODGUARD using your preferred method!
        </Text>

        <TouchableOpacity
          style={styles.outlineBtn}
          onPress={() => navigation.navigate('LoginWithEmail')}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="email-outline" size={s(26)} color="#333" style={styles.icon} />
          <Text style={styles.outlineTxt}>Continue with Email</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.outlineBtn, { marginTop: vs(12) }]}
          onPress={() => setGoogleModal(true)}
          activeOpacity={0.8}
        >
          <AntDesign name="google" size={s(24)} color="#EA4335" style={styles.icon} />
          <Text style={styles.outlineTxt}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.forgotWrap}
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text style={styles.forgotTxt}>Forgot Password</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.solidBtn}
          onPress={() => navigation.navigate('LoginWithEmail')}
          activeOpacity={0.85}
        >
          <Text style={styles.solidTxt}>Log In</Text>
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
      </View>

      <GoogleModal
        visible={googleModal}
        onCancel={() => setGoogleModal(false)}
        onContinue={() => setGoogleModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, paddingHorizontal: s(34) },
  logo: {
    width: s(360),
    height: vs(113),
    marginTop: vs(100),
    marginLeft: s(-15),
  },
  headline: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: ms(28),
    lineHeight: ms(34),
    color: '#0A3564',
    marginTop: vs(120),
    marginBottom: vs(28),
  },
  outlineBtn: {
    height: vs(49),
    borderRadius: s(40),
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.56)',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(20),
  },
  icon: { marginRight: s(12) },
  outlineTxt: {
    fontFamily: 'Roboto_700Bold',
    fontSize: ms(15),
    color: '#000000',
  },
  forgotWrap: {
    alignSelf: 'flex-end',
    marginTop: vs(14),
    marginBottom: vs(6),
  },
  forgotTxt: {
    fontFamily: 'Roboto_400Regular',
    fontSize: ms(11),
    color: '#000000',
  },
  solidBtn: {
    height: vs(49),
    backgroundColor: '#55D6FE',
    borderRadius: s(20),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: vs(8),
  },
  solidTxt: {
    fontFamily: 'Poppins_700Bold',
    fontSize: ms(16),
    color: '#0A3564',
  },
  signUpWrap: { alignItems: 'center', marginTop: vs(18) },
  signUpTxt: {
    fontFamily: 'Roboto_400Regular',
    fontSize: ms(14),
    color: '#0A3564',
  },
  signUpLink: {
    fontFamily: 'Roboto_700Bold',
    textDecorationLine: 'underline',
  },
});

const modal = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(13,13,13,0.59)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: s(358),
    borderRadius: s(20),
    padding: s(24),
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: ms(18),
    lineHeight: ms(24),
    color: '#0A3564',
    textAlign: 'center',
    marginBottom: vs(12),
  },
  sub: {
    fontFamily: 'Roboto_400Regular',
    fontSize: ms(13),
    color: '#000000',
    textAlign: 'center',
    marginBottom: vs(20),
  },
  row: { flexDirection: 'row', gap: s(12), width: '100%' },
  cancelBtn: {
    flex: 1,
    height: vs(41),
    backgroundColor: '#FFFFFF',
    borderRadius: s(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelTxt: { fontFamily: 'Poppins_500Medium', fontSize: ms(15), color: '#0A3564' },
  continueBtn: {
    flex: 1.6,
    height: vs(41),
    backgroundColor: '#55D6FE',
    borderRadius: s(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueTxt: { fontFamily: 'Poppins_700Bold', fontSize: ms(15), color: '#0A3564' },
});