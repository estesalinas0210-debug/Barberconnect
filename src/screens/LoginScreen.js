import React, { useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

// 🔥 Google
import { GoogleSignin } from '@react-native-google-signin/google-signin';
GoogleSignin.configure({
  webClientId: '1:574933300093:android:1ca02a9de557754aaa9214',
});

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('client');

  // 📞 teléfono
  const [phone, setPhone] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [code, setCode] = useState('');

  // 🔄 detectar sesión activa
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user && (user.emailVerified || user.phoneNumber)) {
        navigation.replace('TurnoScreen');
      }
    });

    return unsubscribe;
  }, []);

  // 🔧 configurar Google
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: 'TU_WEB_CLIENT_ID_AQUI', // ⚠️ luego te ayudo con esto
    });
  }, []);

  // =============================
  // 📧 REGISTRO EMAIL
  // =============================
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

      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password
      );

      const user = userCredential.user;

      // 📩 enviar verificación
      await user.sendEmailVerification();

      // 💾 guardar en Firestore
      await firestore().collection('users').doc(user.uid).set({
        email,
        role,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      Alert.alert(
        'Verificación',
        'Revisa tu correo y confirma tu cuenta antes de iniciar sesión'
      );
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Error', 'Ese correo ya está registrado');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Error', 'Correo inválido');
      } else if (error.code === 'auth/weak-password') {
        Alert.alert('Error', 'Mínimo 6 caracteres');
      } else {
        Alert.alert('Error', 'Error al registrarse');
      }
    }
  };

  // =============================
  // 🔐 LOGIN EMAIL
  // =============================
  const handleLogin = async () => {
    try {
      if (!email || !password) {
        Alert.alert('Error', 'Completa todos los campos');
        return;
      }

      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password
      );

      const user = userCredential.user;

      if (!user.emailVerified) {
        Alert.alert('Error', 'Debes verificar tu correo');
        return;
      }

      navigation.replace('TurnoScreen');
    } catch (error) {
      Alert.alert('Error', 'Credenciales incorrectas');
    }
  };

  // =============================
  // 🔴 GOOGLE LOGIN
  // =============================
  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();

      const { idToken } = await GoogleSignin.signIn();

      const googleCredential =
        auth.GoogleAuthProvider.credential(idToken);

      const userCredential = await auth().signInWithCredential(
        googleCredential
      );

      const user = userCredential.user;

      // 💾 guardar si no existe
      await firestore().collection('users').doc(user.uid).set(
        {
          email: user.email,
          role: 'client',
          createdAt: firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      navigation.replace('TurnoScreen');
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Google falló');
    }
  };

  // =============================
  // 📞 TELÉFONO
  // =============================
  const signInWithPhone = async () => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phone);
      setConfirm(confirmation);
      Alert.alert('Código enviado');
    } catch (error) {
      Alert.alert('Error', 'Número inválido');
    }
  };

  const confirmCode = async () => {
    try {
      await confirm.confirm(code);
      navigation.replace('TurnoScreen');
    } catch (error) {
      Alert.alert('Código incorrecto');
    }
  };

  // =============================
  // UI
  // =============================
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cuenta / Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
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

      {/* Roles */}
      <Text style={styles.label}>Tipo de cuenta:</Text>

      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[
            styles.roleButton,
            role === 'client' && styles.roleSelected,
          ]}
          onPress={() => setRole('client')}
        >
          <Text>Cliente</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.roleButton,
            role === 'barber' && styles.roleSelected,
          ]}
          onPress={() => setRole('barber')}
        >
          <Text>Barbero</Text>
        </TouchableOpacity>
      </View>

      {/* BOTONES */}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.googleBtn} onPress={handleGoogleLogin}>
        <Text style={styles.buttonText}>Continuar con Google</Text>
      </TouchableOpacity>

      {/* TELÉFONO */}
      <TextInput
        style={styles.input}
        placeholder="+549XXXXXXXX"
        value={phone}
        onChangeText={setPhone}
      />

      <TouchableOpacity style={styles.button} onPress={signInWithPhone}>
        <Text style={styles.buttonText}>Enviar código</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Código SMS"
        value={code}
        onChangeText={setCode}
      />

      <TouchableOpacity style={styles.button} onPress={confirmCode}>
        <Text style={styles.buttonText}>Confirmar código</Text>
      </TouchableOpacity>
    </View>
  );
}

// =============================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 25,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#3a3a3a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    color: '#fff',
  },
  button: {
    backgroundColor: '#111',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  googleBtn: {
    backgroundColor: '#4285F4',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
  },
  label: {
    marginTop: 10,
  },
  roleContainer: {
    flexDirection: 'row',
  },
  roleButton: {
    flex: 1,
    padding: 10,
    backgroundColor: '#eee',
    margin: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  roleSelected: {
    backgroundColor: '#999',
  },
});