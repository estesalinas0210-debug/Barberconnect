import React, { useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

export default function ClientHomeScreen() {
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookedTimes, setBookedTimes] = useState([]);

  const date = new Date().toISOString().split('T')[0];

  const times = [
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '15:00',
    '16:00',
    '17:00',
  ];

  // 🔥 Cargar horarios ocupados
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('appointments')
      .where('date', '==', date)
      .onSnapshot((querySnapshot) => {
        const booked = [];
        querySnapshot.forEach((doc) => {
          booked.push(doc.data().time);
        });
        setBookedTimes(booked);
      });

    return () => unsubscribe();
  }, []);

  // 📅 Reservar turno
  const bookAppointment = async () => {
    try {
      if (!selectedTime) {
        Alert.alert('Selecciona un horario');
        return;
      }

      const user = auth().currentUser;

      await firestore().collection('appointments').add({
        userId: user.uid,
        date,
        time: selectedTime,
        status: 'pending',
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      Alert.alert('Turno reservado 💈');
      setSelectedTime(null);
    } catch (error) {
      console.log(error);
      Alert.alert('Error al reservar');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecciona un horario</Text>

      {times.map((time) => {
        const isBooked = bookedTimes.includes(time);

        return (
          <TouchableOpacity
            key={time}
            style={[
              styles.timeButton,
              isBooked && styles.booked,
              selectedTime === time && styles.selected,
            ]}
            disabled={isBooked}
            onPress={() => setSelectedTime(time)}
          >
            <Text style={styles.text}>
              {time} {isBooked ? '❌' : ''}
            </Text>
          </TouchableOpacity>
        );
      })}

      <TouchableOpacity style={styles.button} onPress={bookAppointment}>
        <Text style={styles.buttonText}>Reservar turno</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  timeButton: {
    padding: 15,
    backgroundColor: '#ddd',
    marginBottom: 10,
    borderRadius: 10,
  },
  selected: {
    backgroundColor: '#c59d5f',
  },
  booked: {
    backgroundColor: '#999',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#111',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  text: {
    textAlign: 'center',
  },
  card: {
    padding: 15,
    backgroundColor: '#eee',
    marginBottom: 10,
    borderRadius: 10,
  },
});