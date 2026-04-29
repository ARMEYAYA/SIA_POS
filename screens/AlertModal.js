import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  Dimensions,
} from 'react-native';
import { s, vs, ms } from './Scale';

const { width: SCREEN_W } = Dimensions.get('window');

// ── Alert Config ──
const ALERT_CONFIG = {
  1: {
    levelColor:  '#FFE862',
    levelText:   'Alert Level 1',
    description:
      'Water level is at knee height. Keep monitoring updates and prepare essential items in case conditions worsen.',
  },
  2: {
    levelColor:  '#FF8F62',
    levelText:   'Alert Level 2',
    description:
      'Floodwater has reached waist level. Move to higher ground if possible and secure important belongings. Follow local safety instructions.',
  },
  3: {
    levelColor:  '#D90000',
    levelText:   'Alert Level 3',
    description:
      'Floodwater is at chest level. This is life-threatening. Evacuate immediately to a safe location and avoid entering floodwaters. Call emergency services if needed.',
  },
};

const ALERT_IMAGES = {
  1: require('../assets/Alert1.png'),
  2: require('../assets/Alert2.png'),
  3: require('../assets/Alert3.png'),
};

// ── AlertModal ──
export default function AlertModal({
  visible,
  alertLevel,
  alertImage,
  onClose,
  onStayUpdated,
}) {
  const config = ALERT_CONFIG[alertLevel];
  if (!config) return null;

  const imageSource = ALERT_IMAGES[alertLevel] ?? alertImage;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>

        {/* Card */}
        <View style={styles.card}>

          {imageSource && (
            <Image
              source={imageSource}
              style={styles.alertImage}
              resizeMode="contain"
            />
          )}

          {/* FLOOD ADVISORY */}
          <Text style={styles.advisoryTitle}>FLOOD ADVISORY</Text>

          {/* Alert Level label */}
          <Text style={[styles.levelText, { color: config.levelColor }]}>
            {config.levelText}
          </Text>

          <Text style={styles.description}>{config.description}</Text>

          {/* Close button */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.closeBtnText}>Close</Text>
          </TouchableOpacity>

          {/* Stay updated */}
          <TouchableOpacity onPress={onStayUpdated ?? onClose} activeOpacity={0.7}>
            <Text style={styles.stayUpdated}>Stay updated</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

// ── Styles ──
const CARD_W = Math.min(s(375), SCREEN_W - s(30));

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(13, 13, 13, 0.59)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  card: {
    width: CARD_W,
    backgroundColor: '#FFFFFF',
    borderRadius: s(20),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
    alignItems: 'center',
    paddingHorizontal: s(20),
    paddingTop: vs(28),
    paddingBottom: vs(28),
  },

  alertImage: {
    width: CARD_W - s(40),
    height: vs(260),
    marginBottom: vs(16),
    borderRadius: s(12),
  },

  advisoryTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: ms(20),
    color: '#0A3564',
    marginBottom: vs(6),
    textAlign: 'center',
  },

  levelText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: ms(36),
    lineHeight: ms(44),
    textAlign: 'center',
    marginBottom: vs(12),
  },

  description: {
    fontFamily: 'Roboto_700Bold',
    fontSize: ms(14),
    lineHeight: ms(19),
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.56)',
    marginBottom: vs(20),
    paddingHorizontal: s(10),
  },

  closeBtn: {
    width: s(242),
    height: vs(37),
    backgroundColor: 'rgba(217, 217, 217, 0.63)',
    borderRadius: s(20),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: vs(12),
  },
  closeBtnText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: ms(15),
    color: '#0A3564',
  },

  stayUpdated: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: ms(15),
    color: '#0A3564',
    textAlign: 'center',
  },
});