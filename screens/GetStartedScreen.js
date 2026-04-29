import React, { useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, Image, SafeAreaView, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { s, vs, ms, W, H } from './Scale';

export default function GetStartedScreen({ navigation }) {
  const circleX = useRef(new Animated.Value(0)).current;
  const [btnWidth, setBtnWidth] = useState(0);
  const circleSize = s(39);
  const circleStartLeft = s(9);

  const handlePress = () => {
    const endX = btnWidth - circleStartLeft - circleSize - circleStartLeft;

    Animated.timing(circleX, {
      toValue: endX,
      duration: 480,
      useNativeDriver: true,
    }).start(() => {
      circleX.setValue(0);
      navigation.navigate('LoginMethod');
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={['#55D6FE', '#BAEDFF', '#FFFFFF']}
        locations={[0.0011, 0.5233, 0.9239]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.container}>
        <Image
          source={require('../assets/untitled_design_4.png')}
          style={styles.hero}
          resizeMode="contain"
        />

        <View style={styles.textBlock}>
          <Text style={styles.headline}>
            Stay Safe.{'\n'}Stay updated{'\n'}within your{'\n'}community
          </Text>
          <Text style={styles.subtext}>
            Real-time flood alerts specifically{'\n'}for your Barangay.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.btn}
          onPress={handlePress}
          activeOpacity={0.9}
          onLayout={(e) => setBtnWidth(e.nativeEvent.layout.width)}
        >
          <Animated.View
            style={[
              styles.btnCircle,
              { transform: [{ translateX: circleX }] },
            ]}
          />
          <Text style={styles.btnText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#55D6FE', 
  },
  container: {
    flex: 1,
    width: W,
  },
  hero: {
    width: W - s(6),
    height: vs(232),
    marginTop: vs(144),
    alignSelf: 'center',
  },
  textBlock: {
    paddingHorizontal: s(38),
    marginTop: vs(100),
  },
  headline: {
    fontFamily: 'Poppins_700Bold',
    fontSize: ms(35),
    lineHeight: ms(36),
    color: '#0A3564',
    marginBottom: vs(55),
  },
  subtext: {
    fontFamily: 'Roboto_400Regular',
    fontSize: ms(16),
    lineHeight: ms(20),
    color: '#8D969B',
  },
  btn: {
    position: 'absolute',
    bottom: vs(56),
    left: s(25),
    right: s(25),
    height: vs(51),
    backgroundColor: '#55D6FE',
    borderRadius: s(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden', 
  },
  btnCircle: {
    position: 'absolute',
    left: s(9),
    width: s(39),
    height: s(39),
    borderRadius: s(20),
    backgroundColor: 'rgba(186,237,255,0.74)',
  },
  btnText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: ms(14),
    color: '#0A3564',
  },
});