import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import MainLoginScreen from '../screens/MainLoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import TabNavigations from '../navigation/TabNavigations';
import BarberTabNavigator from '../screens/BarberTabNavigator';

import { View, ActivityIndicator } from 'react-native';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      console.log("USER:", user);

      if (user && role === 'barber') {
        return BARBER;
      }
      if (!user) {
        // 🔥 usuario NO logueado
        setUser(null);
        setRole(null);
        setLoadingRole(false);
        return;
      }

      // 🔥 usuario logueado
      setUser(user);

      try {
        const doc = await firestore()
          .collection('users')
          .doc(user.uid)
          .get();

        console.log("DOC:", doc.exists);

        if (doc.exists) {
          setRole(doc.data().role);
        } else {
          console.log("No existe doc → client");
          setRole('client');
        }
      } catch (error) {
        console.log("Firestore error:", error);
        setRole('client');
      }

      setLoadingRole(false); // 🔥 SIEMPRE
    });

    return unsubscribe;
  }, []);

  // 🔥 LOADING BONITO (NO PANTALLA VACÍA)
  if (loadingRole) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
  <Stack.Navigator screenOptions={{ headerShown: false }}>

    {!user && (
      <>
        <Stack.Screen name="MainLoginScreen" component={MainLoginScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      </>
    )}

    {user && role === 'client' && (
      <Stack.Screen name="ClientTabs" component={TabNavigations} />
    )}

    {user && role === 'barber' && (
      <Stack.Screen name="BarberTabs" component={BarberTabNavigator} />
    )}

  </Stack.Navigator>
);
}