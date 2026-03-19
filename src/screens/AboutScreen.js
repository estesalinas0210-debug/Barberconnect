import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';

export default function AboutScreen() {

 const openLink = async (url) => {
  try {
    await Linking.openURL(url);
  } catch (error) {
    console.log("Error al abrir enlace:", error);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sobre Nosotros</Text>

      <Text style={styles.description}>
        Somos una barbería profesional especializada en cortes modernos y clásicos.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
        openLink(
        'https://wa.me/5492974622685?text=Hola%20quiero%20hacer%20una%20consulta'
  )
}
      >
        <Text style={styles.buttonText}>WhatsApp</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => openLink('https://instagram.com/estebansalinass_')}
      >
        <Text style={styles.buttonText}>Instagram</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => openLink('https://www.facebook.com/esteban.salinas.missionary')}
      >
        <Text style={styles.buttonText}>Facebook</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 50 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 15 },
  description: { marginBottom: 30, fontSize: 16 },
  button: {
    backgroundColor: '#111',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '600' },
});