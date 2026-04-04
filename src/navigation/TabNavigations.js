import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import auth from '@react-native-firebase/auth';
import UserAvatar from '../components/UserAvatar';

// Screens
import SettingScreen from "../screens/SettingScreens";
import AboutScreen from "../screens/AboutScreen";
import ClientHomeScreen from "../screens/ClientHomeScreen";

const Tab = createBottomTabNavigator();

function MyTab() {
  const logout = () => {
  auth().signOut();
};
  return (
    <SafeAreaProvider>
      <Tab.Navigator 
        screenOptions={{ 
          headerTitle : 'BarberConnect',
          tabBarActiveTintColor: '#c59d5f',
          tabBarStyle: { backgroundColor: '#0f0f0f' }
        }}
      >
        <Tab.Screen 
          name="Inicio" 
          component={ClientHomeScreen}
          options={{ 
            tabBarIcon: ({ color }) => (
              <Icon name="calendar" size={20} color={color} />
            )
          }}
        />
        
        <Tab.Screen 
          name="Sobre Nosotros" 
          component={AboutScreen}
          options={{ 
            tabBarIcon: ({ color }) => (
              <Icon name="info-circle" size={20} color={color} />
            )
          }}
        />

        <Tab.Screen 
          name="Perfil" 
          component={SettingScreen}
          options={{ 
            tabBarIcon: () => <UserAvatar size={25} />
          }}
        />

      </Tab.Navigator>
    </SafeAreaProvider>
  );
}

export default MyTab;