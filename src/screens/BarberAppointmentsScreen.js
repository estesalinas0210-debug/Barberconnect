import React, { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
} from 'react-native';

export default function BarberAppointmentsScreen() {
  const [appointments, setAppointments] = useState([]);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
  const unsubscribe = firestore()
    .collection('appointments')
    .where('date', '==', today)
    .onSnapshot(
      (snapshot) => {
        if (!snapshot) {
          setAppointments([]);
          return;
        }

        const list = [];

        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data) {
            list.push({ id: doc.id, ...data });
          }
        });

        setAppointments(list);
      },
      (error) => {
        console.log('Firestore error:', error);
        setAppointments([]);
      }
    );

  return () => unsubscribe();
}, []);

  const confirmAppointment = async (id) => {
    await firestore().collection('appointments').doc(id).update({
      status: 'confirmed',
    });
    Alert.alert('Turno confirmado 💈');
  };

  const cancelAppointment = async (id) => {
    await firestore().collection('appointments').doc(id).delete();
    Alert.alert('Turno cancelado ❌');
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.time}>🕒 {item.time}</Text>
      <Text>Cliente: {item.userName || 'Sin nombre'}</Text>
      <Text>Estado: {item.status}</Text>

      {item.status === 'pending' && (
        <TouchableOpacity
          style={styles.confirm}
          onPress={() => confirmAppointment(item.id)}
        >
          <Text style={styles.btnText}>Confirmar</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.cancel}
        onPress={() => cancelAppointment(item.id)}
      >
        <Text style={styles.btnText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Turnos de Hoy 💈</Text>

      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text>No hay turnos hoy</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, marginBottom: 20, fontWeight: 'bold' },

  card: {
    backgroundColor: '#eee',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },

  time: { fontSize: 16, fontWeight: 'bold' },

  confirm: {
    marginTop: 10,
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 8,
  },

  cancel: {
    marginTop: 10,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 8,
  },

  btnText: { color: '#fff', textAlign: 'center' },
});