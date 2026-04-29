import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Platform,
  StatusBar as RNStatusBar,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { s, vs, ms } from './Scale';
import { useProfile } from './AppContext';


function ValidationToast({ visible, message, type }) {
  if (!visible) return null;
  const isSuccess = type === 'success';
  return (
    <View style={[toastStyles.wrap, isSuccess ? toastStyles.successWrap : toastStyles.errorWrap]}>
      <View style={[toastStyles.dot, isSuccess ? toastStyles.dotSuccess : toastStyles.dotError]}>
        <Ionicons name={isSuccess ? 'checkmark' : 'close'} size={s(13)} color="#FFFFFF" />
      </View>
      <Text style={[toastStyles.txt, isSuccess ? toastStyles.txtSuccess : toastStyles.txtError]}>
        {message}
      </Text>
    </View>
  );
}

// ── Inline field error message ───
function FieldError({ message }) {
  if (!message) return null;
  return (
    <View style={fieldErrStyles.wrap}>
      <Ionicons name="alert-circle-outline" size={s(13)} color="#DC2626" style={{ marginTop: 1 }} />
      <Text style={fieldErrStyles.txt}>{message}</Text>
    </View>
  );
}

function EditableRow({
  label,
  value,
  onChangeText,
  multiline,
  keyboardType,
  autoCapitalize,
  fieldError,
  onBlur,
}) {
  return (
    <View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>{label}</Text>
        <TextInput
          style={[
            styles.infoInput,
            multiline && styles.infoInputMulti,
            fieldError && styles.infoInputError,
          ]}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          placeholder={`Enter ${label.toLowerCase()}`}
          placeholderTextColor="#C0C0C0"
          multiline={multiline}
          numberOfLines={multiline ? 2 : 1}
          textAlignVertical={multiline ? 'top' : 'center'}
          keyboardType={keyboardType ?? 'default'}
          autoCapitalize={autoCapitalize ?? 'sentences'}
          autoCorrect={false}
        />
      </View>
      {fieldError ? (
        <View style={styles.fieldErrorWrap}>
          <FieldError message={fieldError} />
        </View>
      ) : null}
    </View>
  );
}

// ── Read-only Row ───
function ReadOnlyRow({ label, value, onPress, actionLabel }) {
  return (
    <TouchableOpacity
      style={styles.infoRow}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <Text style={styles.infoLabel}>{label}</Text>
      <View style={styles.infoRight}>
        <Text style={[styles.infoValue, !value && styles.infoValueAction]}>
          {value || actionLabel}
        </Text>
        {onPress && (
          <Ionicons name="chevron-forward" size={s(13)} color="#000000" />
        )}
      </View>
    </TouchableOpacity>
  );
}

const isValidGmail = (email) =>
  /^[a-zA-Z0-9._%+\-]+@gmail\.com$/i.test(email.trim());

// ── Main Screen ulit ───
export default function PersonalInformationScreen({ navigation }) {
  const { profile, updateProfile } = useProfile();

  const [name,    setName]    = useState(profile.name    ?? '');
  const [address, setAddress] = useState(profile.address ?? '');
  const [email,   setEmail]   = useState(profile.email   ?? '');
  const [emailError, setEmailError] = useState('');
  const [toastState, setToastState] = useState({ visible: false, message: '', type: 'success' });

  const isDirty =
    name.trim()    !== (profile.name    ?? '').trim()  ||
    address.trim() !== (profile.address ?? '').trim()  ||
    email.trim()   !== (profile.email   ?? '').trim();

  const showToast = useCallback((message, type = 'success') => {
    setToastState({ visible: true, message, type });
    setTimeout(() => setToastState((t) => ({ ...t, visible: false })), 3500);
  }, []);

  const handleEmailBlur = () => {
    if (!email.trim()) { setEmailError(''); return; }
    if (!isValidGmail(email)) {
      setEmailError('Only @gmail.com addresses are accepted.');
    } else {
      setEmailError('');
    }
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    if (emailError) setEmailError('');
  };

  useEffect(() => {
    if (!isDirty) return;
    const timer = setTimeout(() => {
      const emailOk = !email.trim() || isValidGmail(email);
      if (emailOk) {
        updateProfile({ name, address, email });
      } else {
        updateProfile({ name, address });
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [name, address, email]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showToast('Permission to access photos is required.', 'error');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (!result.canceled && result.assets?.length > 0) {
      updateProfile({ avatarUri: result.assets[0].uri });
      showToast('Profile photo updated!', 'success');
    }
  };

  const handleConfirm = () => {
    if (!name.trim()) {
      showToast('Name cannot be empty.', 'error');
      return;
    }
    if (!address.trim()) {
      showToast('Address cannot be empty.', 'error');
      return;
    }
    if (email.trim() && !isValidGmail(email)) {
      setEmailError('Only @gmail.com addresses are accepted.');
      showToast('Please enter a valid @gmail.com address.', 'error');
      return;
    }

    updateProfile({ name: name.trim(), address: address.trim(), email: email.trim() });
    showToast('Changes saved successfully!', 'success');
    setTimeout(() => navigation.goBack(), 1800);
  };

  return (

    <View style={styles.root}>

      <SafeAreaView style={styles.safe}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
            style={styles.headerBtn}
          >
            <Ionicons name="chevron-back" size={s(24)} color="#0A3564" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Personal Information</Text>

          {isDirty ? (
            <TouchableOpacity onPress={handleConfirm} activeOpacity={0.8} style={styles.headerBtn}>
              <Ionicons name="checkmark" size={s(26)} color="#0A3564" />
            </TouchableOpacity>
          ) : (
            <View style={styles.headerBtn} />
          )}
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
          >

            {/* ── Avatar ── */}
            <View style={styles.avatarSection}>
              <TouchableOpacity onPress={pickImage} activeOpacity={0.85} style={styles.avatarWrap}>
                {profile.avatarUri ? (
                  <Image source={{ uri: profile.avatarUri }} style={styles.avatarImg} />
                ) : (
                  <Ionicons name="person-circle" size={s(100)} color="#D9D9D9" />
                )}
                <View style={styles.cameraOverlay}>
                  <Ionicons name="camera" size={s(16)} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
              <Text style={styles.avatarHint}>Tap to change photo</Text>
            </View>

            {/* ── Subtitle ── */}
            <Text style={styles.subtitle}>
              Edit your personal information. Changes are reflected immediately across the app.
            </Text>

            {/* ── Personal Details ── */}
            <Text style={styles.groupLabel}>Personal Details</Text>
            <View style={styles.card}>
              <EditableRow
                label="Name"
                value={name}
                onChangeText={setName}
              />
              <View style={styles.divider} />
              <EditableRow
                label="Address"
                value={address}
                onChangeText={setAddress}
                multiline
              />
            </View>

            {/* ── Contact ── */}
            <Text style={styles.groupLabel}>Contact</Text>
            <View style={styles.card}>

              <EditableRow
                label="Email"
                value={email}
                onChangeText={handleEmailChange}
                onBlur={handleEmailBlur}
                keyboardType="email-address"
                autoCapitalize="none"
                fieldError={emailError}
              />

              {!emailError && (
                <View style={styles.emailHintWrap}>
                  <Ionicons name="information-circle-outline" size={s(13)} color="#8A8A8A" />
                  <Text style={styles.emailHint}>Only @gmail.com addresses are accepted.</Text>
                </View>
              )}

              <View style={styles.divider} />

              <ReadOnlyRow
                label="Mobile No."
                value={profile.mobile ?? ''}
                onPress={() => navigation.navigate('AddMobile')}
                actionLabel="Add Mobile No."
              />
            </View>

          </ScrollView>
        </KeyboardAvoidingView>

      </SafeAreaView>

      <ValidationToast
        visible={toastState.visible}
        message={toastState.message}
        type={toastState.type}
      />

    </View>
  );
}

// ── Styles ───
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
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
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerBtn: {
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
  },

  scroll: {
    paddingHorizontal: s(16),
    paddingBottom: vs(48),
    paddingTop: vs(12),
  },

  avatarSection: {
    alignItems: 'center',
    paddingTop: vs(16),
    paddingBottom: vs(16),
  },
  avatarWrap: {
    width: s(100),
    height: s(100),
    borderRadius: s(50),
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  cameraOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: s(28),
    backgroundColor: 'rgba(0,0,0,0.42)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarHint: {
    fontFamily: 'Roboto_400Regular',
    fontSize: ms(11),
    color: '#A0A0A0',
    marginTop: vs(6),
  },

  subtitle: {
    fontFamily: 'Roboto_400Regular',
    fontSize: ms(13),
    lineHeight: ms(18),
    color: '#8A8A8A',
    textAlign: 'center',
    marginBottom: vs(4),
    paddingHorizontal: s(8),
  },

  groupLabel: {
    fontFamily: 'Poppins_500Medium',
    fontSize: ms(12),
    color: '#0A3564',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: vs(6),
    marginLeft: s(4),
    marginTop: vs(16),
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: s(14),
    borderWidth: 1,
    borderColor: '#F0F0F0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(16),
    paddingVertical: vs(12),
    minHeight: vs(52),
    backgroundColor: '#FFFFFF',
  },
  infoLabel: {
    fontFamily: 'Poppins_400Regular',
    fontSize: ms(14),
    color: '#48464C',
    width: s(88),
  },
  infoInput: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    fontSize: ms(14),
    color: '#1C1B1F',
    paddingVertical: vs(2),
    paddingHorizontal: s(4),
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  infoInputMulti: {
    height: vs(40),
  },
  infoInputError: {
    borderBottomColor: '#DC2626',
  },

  infoRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: s(6),
  },
  infoValue: {
    fontFamily: 'Roboto_400Regular',
    fontSize: ms(13),
    color: '#1C1B1F',
    textAlign: 'right',
    flexShrink: 1,
  },
  infoValueAction: {
    color: '#0A3564',
  },

  divider: {
    height: 1,
    backgroundColor: '#F2F2F2',
    marginHorizontal: s(16),
  },

  fieldErrorWrap: {
    paddingHorizontal: s(16),
    paddingBottom: vs(8),
    backgroundColor: '#FFFFFF',
  },

  emailHintWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
    paddingHorizontal: s(16),
    paddingBottom: vs(8),
    backgroundColor: '#FFFFFF',
  },
  emailHint: {
    fontFamily: 'Roboto_400Regular',
    fontSize: ms(11),
    color: '#8A8A8A',
  },
});

const toastStyles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    bottom: vs(40),
    left: s(16),
    right: s(16),
    zIndex: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: s(12),
    paddingHorizontal: s(14),
    paddingVertical: vs(12),
    gap: s(10),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 10,
  },
  successWrap: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  errorWrap: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  dot: {
    width: s(24),
    height: s(24),
    borderRadius: s(12),
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  dotSuccess: { backgroundColor: '#16A34A' },
  dotError:   { backgroundColor: '#DC2626' },
  txt: {
    fontFamily: 'Poppins_400Regular',
    fontSize: ms(13),
    flex: 1,
    lineHeight: ms(18),
  },
  txtSuccess: { color: '#15803D' },
  txtError:   { color: '#B91C1C' },
});

const fieldErrStyles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: s(4),
  },
  txt: {
    fontFamily: 'Roboto_400Regular',
    fontSize: ms(11),
    color: '#DC2626',
    flex: 1,
    lineHeight: ms(15),
  },
});