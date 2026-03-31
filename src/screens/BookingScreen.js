import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert
} from 'react-native';

import { db } from './firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export default function BookingScreen() {
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const handleBooking = async () => {
    if (!name || !time) {
      Alert.alert('Completa todos los campos');
      return;
    }

    try {
      await addDoc(collection(db, 'appointments'), {
        name,
        time,
        createdAt: new Date()
      });

      Alert.alert('Turno reservado 💈');
      setName('');
      setTime('');
    } catch (error) {
      console.log(error);
      Alert.alert('Error al guardar');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reservar Turno</Text>

      <TextInput
        placeholder="Tu nombre"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Hora (ej: 15:00)"
        value={time}
        onChangeText={setTime}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleBooking}>
        <Text style={styles.buttonText}>Reservar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 8
  },
  button: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 8
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center'
  }
});