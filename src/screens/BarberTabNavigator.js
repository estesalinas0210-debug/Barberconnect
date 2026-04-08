import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import auth from '@react-native-firebase/auth';

import BarberAppointmentsScreen from '../screens/BarberAppointmentsScreen';
import SettingsScreen from '../screens/SettingScreens'; // tu perfil

const Tab = createBottomTabNavigator();

export default function BarberTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerTitle : 'BarberConnect',
        tabBarActiveTintColor: '#c59d5f',
        tabBarStyle: { backgroundColor: '#0f0f0f' },
      }}
    >
      <Tab.Screen
        name="Turnos"
        component={BarberAppointmentsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="calendar" size={20} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Perfil"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="user" size={20} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}