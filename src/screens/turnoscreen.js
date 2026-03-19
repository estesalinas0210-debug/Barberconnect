import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Linking,
} from 'react-native';

export default function TurnoScreen() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [appointments, setAppointments] = useState([]);

  const dates = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  const times = ['10:00', '11:00', '12:00', '16:00', '17:00', '18:00'];

  const isTimeBooked = (day, hour) => {
    return appointments.some(
      (item) => item.date === day && item.time === hour
    );
  };

  const bookAppointment = async () => {
  if (!selectedDate || !selectedTime) {
    Alert.alert('Error', 'Selecciona día y horario');
    return;
  }

  if (isTimeBooked(selectedDate, selectedTime)) {
    Alert.alert('Horario ocupado', 'Elige otro horario');
    return;
  }

  const newAppointment = {
    id: Date.now().toString(),
    date: selectedDate,
    time: selectedTime,
  };

  setAppointments([...appointments, newAppointment]);

  const message = `Hola! Quiero confirmar mi turno:
📅 Día: ${selectedDate}
⏰ Hora: ${selectedTime}`;

  const phoneNumber = "5492975072564";

  // 👇 Usamos directamente wa.me sin canOpenURL
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  try {
    await Linking.openURL(url);
  } catch (error) {
    Alert.alert("Error", "No se pudo abrir WhatsApp");
  }

  setSelectedDate(null);
  setSelectedTime(null);
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agendar Turno</Text>

      <Text style={styles.subtitle}>Selecciona un día</Text>
      <View style={styles.row}>
        {dates.map((day) => (
          <TouchableOpacity
            key={day}
            style={[
              styles.option,
              selectedDate === day && styles.selected,
            ]}
            onPress={() => setSelectedDate(day)}
          >
            <Text style={styles.optionText}>{day}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.subtitle}>Selecciona un horario</Text>
      <View style={styles.row}>
        {times.map((hour) => {
          const booked = isTimeBooked(selectedDate, hour);

          return (
            <TouchableOpacity
              key={hour}
              disabled={booked}
              style={[
                styles.option,
                selectedTime === hour && styles.selected,
                booked && styles.booked,
              ]}
              onPress={() => setSelectedTime(hour)}
            >
              <Text
                style={[
                  styles.optionText,
                  booked && styles.bookedText,
                ]}
              >
                {hour}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={styles.button} onPress={bookAppointment}>
        <Text style={styles.buttonText}>Confirmar Turno</Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>Turnos Agendados</Text>

      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.appointmentItem}>
            <Text>
              {item.date} - {item.time}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 15,
    marginBottom: 10,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  option: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 10,
    margin: 5,
  },
  selected: {
    backgroundColor: 'rgba(104, 247, 69, 0.8)',
  },
  booked: {
    backgroundColor: '#ff4d4d',
  },
  bookedText: {
    color: '#fff',
    textDecorationLine: 'line-through',
  },
  optionText: {
    color: '#000',
  },
  button: {
    backgroundColor: '#111',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  appointmentItem: {
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    marginBottom: 5,
  },
});