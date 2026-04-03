import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MainLoginScreen from '../screens/MainLoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import TurnoScreen from '../screens/TurnoScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="MainLoginScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="MainLoginScreen" component={MainLoginScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      <Stack.Screen name="TurnoScreen" component={TurnoScreen} />
    </Stack.Navigator>
  );
}