import { Tabs } from 'expo-router';
import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { HapticTab } from '@/components/haptic-tab';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const activeColor = '#403F3A'; // dark brown highlight
  const inactiveColor = '#9B8F87'; // soft muted brown
  const bgColor = '#F6EDE3'; // Soma beige background

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: bgColor,
          borderTopColor: 'transparent',
          height: 70,
          paddingBottom: 10,
          paddingTop: 6,
          elevation: 0,
        },
        tabBarIcon: ({ focused }) => {
          let iconName = 'home-outline'; // default icon

          switch (route.name) {
            case 'index':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'dashboard':
              iconName = focused ? 'chart-bar' : 'chart-bar';
              break;
            case 'calendar':
              iconName = focused ? 'calendar-month' : 'calendar-month-outline';
              break;
            default:
              iconName = 'circle-outline';
          }

          const color = focused ? activeColor : inactiveColor;

          // 🪶 fade + scale animation
          const fadeAnim = useRef(new Animated.Value(focused ? 1 : 0.6)).current;
          const scaleAnim = useRef(new Animated.Value(focused ? 1.1 : 1)).current;

          useEffect(() => {
            Animated.parallel([
              Animated.timing(fadeAnim, {
                toValue: focused ? 1 : 0.6,
                duration: 300,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
              }),
              Animated.spring(scaleAnim, {
                toValue: focused ? 1.15 : 1,
                friction: 5,
                useNativeDriver: true,
              }),
            ]).start();
          }, [focused]);

          return (
            <Animated.View
              style={[
                styles.iconWrapper,
                { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
              ]}
            >
              <MaterialCommunityIcons name={iconName} size={28} color={color} />
              {focused && <View style={styles.activeDot} />}
            </Animated.View>
          );
        },
      })}
    >
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activeDot: {
    position: 'absolute',
    bottom: -6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#403F3A',
  },
});
