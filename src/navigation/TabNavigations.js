import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';

// Screens
import settingscreen from "../screens/settingscreens";
import AboutScreen from "../screens/AboutScreen";
import turnoscreen from "../screens/turnoscreen";

const Tab = createBottomTabNavigator();

function MyTab() {
  return (
    <SafeAreaProvider>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen 
          name="Turnos" 
          component={turnoscreen}
          options={{ 
            tabBarIcon: ({ color }) => (
              <Icon name="calendar" size={20} color={color} />
            )
          }}
        />
        
        <Tab.Screen 
          name="Productos" 
          component={settingscreen}
          options={{ 
            tabBarIcon: ({ color }) => (
              <Icon name="shopping-cart" size={20} color={color} />
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
      </Tab.Navigator>
    </SafeAreaProvider>
  );
}

export default MyTab;