import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { s, vs, ms } from './Scale';

// ── Confirm Delete ───
function ConfirmModal({ visible, onDelete, onCancel }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={modal.overlay}>
        <LinearGradient
          colors={['#FFFFFF', '#DDF6FF', '#BAEDFF']}
          locations={[0, 0.25, 1]}
          style={modal.card}
        >
          <Text style={modal.title}>Delete Account</Text>
          <Text style={modal.subtitle}>Please confirm that you want to proceed.</Text>
          <Text style={modal.body}>
            You will no longer receive flood alerts and emergency updates after deleting your account.
          </Text>

          <View style={modal.btnRow}>
            {/* Cancel */}
            <TouchableOpacity style={modal.cancelBtn} onPress={onCancel} activeOpacity={0.85}>
              <Text style={modal.cancelTxt}>cancel</Text>
            </TouchableOpacity>

            {/* Delete */}
            <TouchableOpacity style={modal.deleteBtn} onPress={onDelete} activeOpacity={0.85}>
              <Text style={modal.deleteBtnTxt}>Delete Account</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
}

// ── Success ────
function SuccessModal({ visible, onBackToLogin }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={modal.overlay}>
        <LinearGradient
          colors={['#FFFFFF', '#DDF6FF', '#BAEDFF']}
          locations={[0, 0.25, 1]}
          style={modal.card}
        >
          <View style={success.iconWrap}>
            <Ionicons name="checkmark-circle" size={s(78)} color="#014BAA" />
          </View>
          <Text style={modal.title}>Deleted Successfully!</Text>
          <Text style={success.body}>
            Your account has been successfully deleted. Stay safe and take care.
          </Text>

          <TouchableOpacity style={success.backBtn} onPress={onBackToLogin} activeOpacity={0.85}>
            <Text style={modal.cancelTxt}>Back to Login</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </Modal>
  );
}

// ── Main Screen ──
export default function ManageAccountScreen({ navigation }) {
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

  const handleDeletePress = () => setConfirmVisible(true);

  const handleConfirmDelete = () => {
    setConfirmVisible(false);
    setSuccessVisible(true);
  };

  const handleBackToLogin = () => {
    setSuccessVisible(false);
    navigation.navigate('LoginMethod');
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={s(24)} color="#0A3564" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Account</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.warningTitle}>Deleting your account is permanent</Text>
        <Text style={styles.warningBody}>
          Are you sure you want to delete your account? This action is permanent and cannot be
          undone. All your saved data, alerts, and activity history will be removed from the system.
        </Text>

        {/* Delete button */}
        <TouchableOpacity style={styles.deleteBtn} onPress={handleDeletePress} activeOpacity={0.85}>
          <Text style={styles.deleteBtnTxt}>Delete account</Text>
        </TouchableOpacity>

        {/* Cancel button */}
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
        >
          <Text style={styles.cancelTxt}>cancel</Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <ConfirmModal
        visible={confirmVisible}
        onDelete={handleConfirmDelete}
        onCancel={() => setConfirmVisible(false)}
      />
      <SuccessModal
        visible={successVisible}
        onBackToLogin={handleBackToLogin}
      />
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
  content: {
    paddingHorizontal: s(33),
    paddingTop: vs(20),
  },
  warningTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: ms(20),
    color: 'rgba(0,0,0,0.56)',
    marginBottom: vs(24),
  },
  warningBody: {
    fontFamily: 'Roboto_400Regular',
    fontSize: ms(14),
    lineHeight: ms(16),
    color: '#48464C',
    marginBottom: vs(28),
  },
  deleteBtn: {
    width: '100%',
    height: vs(49),
    backgroundColor: '#55D6FE',
    borderRadius: s(20),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: vs(14),
  },
  deleteBtnTxt: {
    fontFamily: 'Poppins_700Bold',
    fontSize: ms(16),
    color: '#0A3564',
  },
  cancelBtn: {
    width: '95%',
    alignSelf: 'center',
    height: vs(38),
    backgroundColor: 'rgba(217,217,217,0.7)',
    borderRadius: s(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelTxt: {
    fontFamily: 'Poppins_500Medium',
    fontSize: ms(16),
    color: '#0A3564',
  },
});

const modal = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(13,13,13,0.59)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: s(358),
    borderRadius: s(20),
    padding: s(24),
    paddingTop: vs(30),
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: ms(24),
    color: '#0A3564',
    marginBottom: vs(8),
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Roboto_400Regular',
    fontSize: ms(15),
    color: '#A0A0A0',
    textAlign: 'center',
    marginBottom: vs(10),
  },
  body: {
    fontFamily: 'Roboto_400Regular',
    fontSize: ms(14),
    lineHeight: ms(16),
    color: '#A0A0A0',
    textAlign: 'center',
    marginBottom: vs(28),
    paddingHorizontal: s(10),
  },
  btnRow: {
    flexDirection: 'row',
    gap: s(16),
    width: '100%',
    justifyContent: 'center',
  },
  cancelBtn: {
    width: s(121),
    height: vs(41),
    backgroundColor: '#FFFFFF',
    borderRadius: s(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelTxt: {
    fontFamily: 'Poppins_500Medium',
    fontSize: ms(16),
    color: '#0A3564',
  },
  deleteBtn: {
    width: s(194),
    height: vs(41),
    backgroundColor: '#55D6FE',
    borderRadius: s(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnTxt: {
    fontFamily: 'Poppins_700Bold',
    fontSize: ms(16),
    color: '#0A3564',
  },
});

const success = StyleSheet.create({
  iconWrap: {
    marginBottom: vs(8),
  },
  body: {
    fontFamily: 'Roboto_400Regular',
    fontSize: ms(15),
    lineHeight: ms(18),
    color: '#A0A0A0',
    textAlign: 'center',
    marginBottom: vs(24),
    paddingHorizontal: s(10),
  },
  backBtn: {
    width: s(237),
    height: vs(41),
    backgroundColor: '#FFFFFF',
    borderRadius: s(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
});