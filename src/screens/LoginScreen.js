import React, { useState } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('client'); // client | barber

  const handleRegister = async () => {
  try {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    // 🔐 Crear usuario en Firebase Auth
    const userCredential = await auth().createUserWithEmailAndPassword(
      email,
      password
    );

    const uid = userCredential.user.uid;

    // 💾 Guardar en Firestore
    await firestore().collection('users').doc(uid).set({
      email,
      role, // client | barber
      createdAt: firestore.FieldValue.serverTimestamp(),
    });

    Alert.alert('Éxito', 'Cuenta creada correctamente');

    // 👉 navegación futura
    // navigation.navigate('Login');

  } catch (error) {
    console.log(error);

    if (error.code === 'auth/email-already-in-use') {
      Alert.alert('Error', 'Ese correo ya está registrado');
    } else if (error.code === 'auth/invalid-email') {
      Alert.alert('Error', 'Correo inválido');
    } else if (error.code === 'auth/weak-password') {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
    } else {
      Alert.alert('Error', 'Ocurrió un error al registrarse');
    }
  }
};
const handleLogin = async () => {
  try {
    if (!username || !password) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }

    const userCredential = await auth().signInWithEmailAndPassword(
      username,
      password
    );

    setIsLoggedIn(true);

  } catch (error) {
    Alert.alert('Error', 'Credenciales incorrectas');
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar contraseña"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      {/* 🔥 Selección de rol */}
      <Text style={styles.label}>Selecciona tu tipo de cuenta:</Text>

      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[
            styles.roleButton,
            role === 'client' && styles.roleSelected,
          ]}
          onPress={() => setRole('client')}
        >
          <Text style={styles.roleText}>Cliente</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.roleButton,
            role === 'barber' && styles.roleSelected,
          ]}
          onPress={() => setRole('barber')}
        >
          <Text style={styles.roleText}>Barbero</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 25,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#3a3a3a',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  label: {
    marginTop: 10,
    marginBottom: 10,
    fontWeight: '600',
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  roleButton: {
    flex: 1,
    padding: 15,
    backgroundColor: '#eee',
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  roleSelected: {
    backgroundColor: '#9c9c9c',
  },
  roleText: {
    color: '#161616',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#111',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  link: {
    marginTop: 20,
    textAlign: 'center',
    color: '#555',
  },
});