import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  StatusBar as RNStatusBar,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { s, vs, ms } from './Scale';

// ── Main Screen ──
export default function AddMobileScreen({ navigation }) {
  const [step, setStep] = useState('enter'); // 'enter' | 'verify'
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');

  const handleSendCode = () => {
    if (phone.trim().length > 5) {
      setStep('verify');
    }
  };

  const handleConfirmCode = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={s(24)} color="#0A3564" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mobile Number</Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          <Text style={styles.sectionTitle}>Add a mobile number</Text>
          <Text style={styles.countryLabel}>Philippines (+63)</Text>

          {/* Phone Input */}
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder={step === 'enter' ? 'Enter mobile number' : '0999999999999999'}
              placeholderTextColor="#A0A0A0"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              maxLength={11}
            />
          </View>

          <Text style={styles.hint}>You may receive SMS notification from us.</Text>

          {step === 'enter' ? (
            /* Send Code Button */
            <TouchableOpacity style={styles.actionBtn} onPress={handleSendCode} activeOpacity={0.85}>
              <Text style={styles.actionBtnTxt}>Send Code</Text>
            </TouchableOpacity>
          ) : (
            <>
              {/* OTP Input */}
              <View style={[styles.inputWrap, styles.codeInput]}>
                <TextInput
                  style={[styles.input, { textAlign: 'center' }]}
                  placeholder="Enter Code"
                  placeholderTextColor="#A0A0A0"
                  keyboardType="number-pad"
                  value={code}
                  onChangeText={setCode}
                  maxLength={6}
                />
              </View>

              {/* Confirm Code Button */}
              <TouchableOpacity style={styles.actionBtn} onPress={handleConfirmCode} activeOpacity={0.85}>
                <Text style={styles.actionBtnTxt}>Confirm Code</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── Styles ───
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
    marginBottom: vs(10),
  },
  countryLabel: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: ms(16),
    color: '#000000',
    marginBottom: vs(12),
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
    marginBottom: vs(8),
  },
  codeInput: {
    width: s(245),
    alignSelf: 'center',
  },
  input: {
    flex: 1,
    fontFamily: 'Roboto_500Medium',
    fontSize: ms(15),
    color: '#000000',
  },

  hint: {
    fontFamily: 'Roboto_400Regular',
    fontSize: ms(14),
    lineHeight: ms(16),
    color: '#48464C',
    marginBottom: vs(20),
  },

  actionBtn: {
    alignSelf: 'center',
    width: s(237),
    height: vs(41),
    backgroundColor: '#55D6FE',
    borderRadius: s(20),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: vs(8),
  },
  actionBtnTxt: {
    fontFamily: 'Poppins_700Bold',
    fontSize: ms(16),
    color: '#0A3564',
  },
});