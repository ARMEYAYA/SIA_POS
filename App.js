import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  Poppins_900Black,
} from '@expo-google-fonts/poppins';
import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto';

import { AppProvider } from './screens/AppContext';

// ── nag divide na ko para di malito, Auth Screens ───
import SplashScreen                from './screens/SplashScreen';
import GetStartedScreen            from './screens/GetStartedScreen';
import LoginMethodScreen           from './screens/LoginMethodScreen';
import LoginWithEmailScreen        from './screens/LoginWithEmailScreen';
import SignUpScreen                from './screens/SignUpScreen';
import EmailVerifyScreen           from './screens/EmailVerifyScreen';
import ForgotPasswordScreen        from './screens/ForgotPasswordScreen';
import ForgotVerifyEmailScreen     from './screens/ForgotVerifyEmailScreen';
import NewPasswordScreen           from './screens/NewPasswordScreen';

// ── Main Tab Navr ───
import MainTabNavigator            from './screens/MainTabNavigator';

// ── Main App Screens ────
import NewsScreen                  from './screens/NewsScreen';
import GuideScreen                 from './screens/GuideScreen';

import NotificationsScreen         from './screens/NotificationsScreen';

// ── Settings ────
import ProfileScreen               from './screens/ProfileScreen';
import PersonalInformationScreen   from './screens/PersonalInformationScreen';
import NotificationScreen          from './screens/NotificationScreen';   // permissions page
import ChangePasswordScreen        from './screens/ChangePasswordScreen';
import AddMobileScreen             from './screens/AddMobileScreen';
import ManageAccountScreen         from './screens/ManageAccountScreen';

const Stack = createStackNavigator();

const SETTINGS_SCREEN_OPTIONS = {
  headerShown: false,
  gestureEnabled: true,
};

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    Poppins_900Black,
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
        <ActivityIndicator size="large" color="#55D6FE" />
      </View>
    );
  }

  return (
    <AppProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{ headerShown: false, cardStyle: { backgroundColor: '#FFFFFF' } }}
        >
          {/* ── Auth Flow ── */}
          <Stack.Screen name="Splash"            component={SplashScreen} />
          <Stack.Screen name="GetStarted"        component={GetStartedScreen} />
          <Stack.Screen name="LoginMethod"       component={LoginMethodScreen} />
          <Stack.Screen name="LoginWithEmail"    component={LoginWithEmailScreen} />
          <Stack.Screen name="SignUp"            component={SignUpScreen} />
          <Stack.Screen name="EmailVerify"       component={EmailVerifyScreen} />
          <Stack.Screen name="ForgotPassword"    component={ForgotPasswordScreen} />
          <Stack.Screen name="ForgotVerifyEmail" component={ForgotVerifyEmailScreen} />
          <Stack.Screen name="NewPassword"       component={NewPasswordScreen} />


          <Stack.Screen
            name="HomeScreen"
            component={MainTabNavigator}
            options={{ headerShown: false, animationEnabled: false }}
          />

          <Stack.Screen
            name="Notifications"
            component={NotificationsScreen}
            options={SETTINGS_SCREEN_OPTIONS}
          />

          {/* ── Settings / Profile Screens ── */}
          <Stack.Screen name="ProfileScreen"       component={ProfileScreen}             options={SETTINGS_SCREEN_OPTIONS} />
          <Stack.Screen name="PersonalInformation" component={PersonalInformationScreen} options={SETTINGS_SCREEN_OPTIONS} />
          <Stack.Screen name="Notification"        component={NotificationScreen}        options={SETTINGS_SCREEN_OPTIONS} />
          <Stack.Screen name="ChangePassword"      component={ChangePasswordScreen}      options={SETTINGS_SCREEN_OPTIONS} />
          <Stack.Screen name="AddMobile"           component={AddMobileScreen}           options={SETTINGS_SCREEN_OPTIONS} />
          <Stack.Screen name="ManageAccount"       component={ManageAccountScreen}       options={SETTINGS_SCREEN_OPTIONS} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}