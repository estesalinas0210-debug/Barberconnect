import React, { useState } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator
} from 'react-native';

// Configuración de Google (Asegúrate de tener el webClientId correcto)
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('client'); // 'client' o 'barber'
  const [loading, setLoading] = useState(false);

const handleRegister = async () => {
  if (!email.trim() || !password || !confirmPassword) {
    Alert.alert('Error', 'Por favor, completa todos los campos.');
    return;
  }

  if (password !== confirmPassword) {
    Alert.alert('Error', 'Las contraseñas no coinciden.');
    return;
  }

  setLoading(true);

  try {
    const userCredential = await auth().createUserWithEmailAndPassword(
      email.trim(),
      password
    );

    const user = userCredential.user;

    // 🔥 Guardar usuario en Firestore
    await firestore().collection('users').doc(user.uid).set({
      email: user.email,
      role: role,
      uid: user.uid,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });

    // 📩 Enviar verificación (pero NO bloquear acceso)
    await user.sendEmailVerification();

    // 🔥 Cerrar sesión automáticamente (IMPORTANTE)
    await auth().signOut();

    Alert.alert(
      'Cuenta creada 💈',
      'Te enviamos un correo de verificación. Puedes iniciar sesión normalmente.',
      [
        {
          text: 'Ir al login',
          onPress: () => navigation.replace('MainLoginScreen'),
        },
      ]
    );

  } catch (error) {
    console.log(error.code);

    let msg = 'No se pudo crear la cuenta.';

    if (error.code === 'auth/email-already-in-use') {
      msg = 'Este correo ya está registrado.';
    } else if (error.code === 'auth/invalid-email') {
      msg = 'El formato del correo es inválido.';
    } else if (error.code === 'auth/weak-password') {
      msg = 'La contraseña debe tener al menos 6 caracteres.';
    }

    Alert.alert('Error', msg);

  } finally {
    setLoading(false);
  }
};

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        
        <View style={styles.header}>
          <Text style={styles.logo}>💈 BarberConnect</Text>
          <Text style={styles.subtitle}>Crea tu cuenta personalizada</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Correo Electrónico</Text>
          <TextInput
            style={styles.input}
            placeholder="ejemplo@correo.com"
            placeholderTextColor="#666"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor="#666"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Text style={styles.label}>Confirmar Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Repite tu contraseña"
            placeholderTextColor="#666"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          {/* SELECTOR DE ROL PRO */}
          <Text style={styles.label}>¿Quién eres?</Text>
          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[styles.roleButton, role === 'client' && styles.roleSelected]}
              onPress={() => setRole('client')}
            >
              <Text style={[styles.roleText, role === 'client' && styles.roleTextSelected]}>Cliente</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleButton, role === 'barber' && styles.roleSelected]}
              onPress={() => setRole('barber')}
            >
              <Text style={[styles.roleText, role === 'barber' && styles.roleTextSelected]}>Barbero</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.buttonText}>Registrarse Ahora</Text>}
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.footerLink}>
          <Text style={styles.linkText}>
            ¿Ya tienes cuenta? <Text style={styles.linkHighlight}>Inicia Sesión</Text>
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f' },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', padding: 25 },
  header: { alignItems: 'center', marginBottom: 30 },
  logo: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  subtitle: { color: '#888', marginTop: 5, fontSize: 16 },
  inputContainer: { width: '100%' },
  label: { color: '#c59d5f', fontSize: 13, marginBottom: 8, marginLeft: 4, fontWeight: 'bold', textTransform: 'uppercase' },
  input: {
    backgroundColor: '#1c1c1c',
    color: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#2a2a2a'
  },
  roleContainer: { flexDirection: 'row', marginBottom: 25, gap: 10 },
  roleButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#1c1c1c',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333'
  },
  roleSelected: { backgroundColor: '#c59d5f', borderColor: '#c59d5f' },
  roleText: { color: '#aaa', fontWeight: 'bold' },
  roleTextSelected: { color: '#000' },
  button: {
    backgroundColor: '#c59d5f',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
    elevation: 5
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#000', fontWeight: 'bold', fontSize: 18 },
  footerLink: { marginTop: 30, alignItems: 'center' },
  linkText: { color: '#888' },
  linkHighlight: { color: '#c59d5f', fontWeight: 'bold' }
});