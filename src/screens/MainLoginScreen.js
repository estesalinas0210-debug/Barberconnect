import React, { useState } from 'react';
import auth from '@react-native-firebase/auth';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

export default function MainLoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [phone, setPhone] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [code, setCode] = useState('');

  // 🔐 LOGIN EMAIL
  const handleEmailLogin = async () => {
    try {
      if (!email || !password) {
        Alert.alert('Error', 'Completa todos los campos');
        return;
      }

      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password
      );

      if (!userCredential.user.emailVerified) {
        Alert.alert('Error', 'Verifica tu correo');
        return;
      }

      navigation.replace('TurnoScreen');
    } catch (error) {
      Alert.alert('Error', 'Credenciales incorrectas');
    }
  };

  // 📞 ENVIAR SMS
  const sendCode = async () => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phone);
      setConfirm(confirmation);
      Alert.alert('Código enviado');
    } catch (error) {
      Alert.alert('Error', 'Número inválido');
    }
  };

  // 📲 CONFIRMAR SMS
  const confirmCode = async () => {
    try {
      await confirm.confirm(code);
      navigation.replace('TurnoScreen');
    } catch (error) {
      Alert.alert('Código incorrecto');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>💈 BarberConnect</Text>
      <Text style={styles.subtitle}>Inicia sesión</Text>

      {/* EMAIL */}
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleEmailLogin}>
        <Text style={styles.buttonText}>Ingresar con Email</Text>
      </TouchableOpacity>

      {/* DIVISOR */}
      <Text style={styles.divider}>— o —</Text>

      {/* TELÉFONO */}
      <TextInput
        style={styles.input}
        placeholder="+549XXXXXXXX"
        placeholderTextColor="#aaa"
        value={phone}
        onChangeText={setPhone}
      />

      <TouchableOpacity style={styles.button} onPress={sendCode}>
        <Text style={styles.buttonText}>Enviar código</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Código SMS"
        placeholderTextColor="#aaa"
        value={code}
        onChangeText={setCode}
      />

      <TouchableOpacity style={styles.button} onPress={confirmCode}>
        <Text style={styles.buttonText}>Confirmar código</Text>
      </TouchableOpacity>

      {/* REGISTRO */}
      <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
        <Text style={styles.link}>
          ¿No tienes una cuenta? Regístrate
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    justifyContent: 'center',
    padding: 25,
  },
  logo: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#1c1c1c',
    color: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#c59d5f', // dorado barbería 🔥
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  divider: {
    color: '#aaa',
    textAlign: 'center',
    marginVertical: 15,
  },
  link: {
    color: '#c59d5f',
    textAlign: 'center',
    marginTop: 20,
  },
});