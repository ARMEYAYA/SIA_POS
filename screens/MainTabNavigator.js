import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen    from './HomeScreen';
import WeatherScreen from './WeatherScreen';
import NewsScreen    from './NewsScreen';
import GuideScreen   from './GuideScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
        animation: 'none',
      }}
    >
      <Tab.Screen name="Home"    component={HomeScreen} />
      <Tab.Screen name="Weather" component={WeatherScreen} />
      <Tab.Screen name="News"    component={NewsScreen} />
      <Tab.Screen name="Guide"   component={GuideScreen} />
    </Tab.Navigator>
  );
}