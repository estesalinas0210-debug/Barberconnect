import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';
import MyTab from '../navigation/TabNavigations';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import MainLoginScreen from '../screens/MainLoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import BarberHomeScreen from '../screens/BarberHomeScreen';
import ClientHomeScreen from '../screens/ClientHomeScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(async (user) => {
      setUser(user);

      if (user) {
        try {
          const doc = await firestore()
            .collection('users')
            .doc(user.uid)
            .get();

          if (doc.exists) {
            setRole(doc.data().role);
          } else {
            setRole('client'); // fallback
          }
        } catch (error) {
          console.log(error);
          setRole('client');
        }
      } else {
        setRole(null);
      }

      setInitializing(false);
    });

    return subscriber;
  }, []);

  // 🔄 pantalla de carga (evita pantallas en blanco)
  if (initializing) {
  return (
    <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      
      {/* 🔓 NO LOGUEADO */}
      {!user && (
        <>
          <Stack.Screen name="MainLoginScreen" component={MainLoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        </>
      )}

      {/* 👤 CLIENTE */}
      {user && role === 'client' && (
        <Stack.Screen name="ClientTabs" component={MyTab} />
      )}

      {/* 💈 BARBERO */}
      {user && role === 'barber' && (
        <Stack.Screen name="BarberHome" component={BarberHomeScreen} />
      )}

    </Stack.Navigator>
  );
}