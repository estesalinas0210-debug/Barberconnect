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
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator
} from 'react-native';

export default function MainLoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // 🔥 AUTO LOGIN + DETECCIÓN DE ROL
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const doc = await firestore()
            .collection('users')
            .doc(user.uid)
            .get();

          const role = doc.exists ? doc.data().role : 'client';

          if (role === 'barber') {
            navigation.replace('BarberHome');
          } else {
            navigation.replace('ClientHome');
          }
        } catch (error) {
          navigation.replace('ClientHome');
        }
      }
    });

    return unsubscribe;
  }, []);

  const handleLogin = async () => {
    // 🔎 Validación PRO
    if (!email.trim() || !password) {
      Alert.alert('Atención', 'Por favor, ingresa tu correo y contraseña.');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'El correo no es válido.');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email.trim(),
        password
      );

      const user = userCredential.user;

      // 🔐 Verificar email
      if (!user.emailVerified) {
        Alert.alert(
          'Verificación requerida',
          'Debes verificar tu correo antes de ingresar.'
        );
        return;
      }

      // 🔥 Obtener rol desde Firestore
      const doc = await firestore()
        .collection('users')
        .doc(user.uid)
        .get();

      const role = doc.exists ? doc.data().role : 'client';

      // 🚀 Redirección inteligente
      if (role === 'barber') {
        navigation.replace('BarberHome');
      } else {
        navigation.replace('ClientHome');
      }

    } catch (error) {
      console.log("Firebase Login Error:", error.code);

      let errorMessage = 'Ocurrió un error al intentar ingresar.';

      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'El formato del correo electrónico no es válido.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No existe una cuenta con este correo.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'La contraseña es incorrecta.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Demasiados intentos fallidos. Inténtalo más tarde.';
          break;
      }

      Alert.alert('Error de acceso', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.logo}>💈 BarberConnect</Text>
          <Text style={styles.subtitle}>Inicia sesión para agendar tu turno</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Correo Electrónico</Text>
          <TextInput
            style={styles.input}
            placeholder="ejemplo@correo.com"
            placeholderTextColor="#666"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#666"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.buttonText}>Ingresar</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.footerLink}
          onPress={() => navigation.navigate('RegisterScreen')}
        >
          <Text style={styles.linkText}>
            ¿No tienes una cuenta? <Text style={styles.linkHighlight}>Regístrate</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 25,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    color: '#fff',
    fontSize: 34,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  subtitle: {
    color: '#888',
    marginTop: 5,
    fontSize: 16,
  },
  inputContainer: {
    width: '100%',
  },
  label: {
    color: '#c59d5f',
    fontSize: 14,
    marginBottom: 8,
    marginLeft: 4,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#1c1c1c',
    color: '#fff',
    padding: 18,
    borderRadius: 15,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  button: {
    backgroundColor: '#c59d5f',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#c59d5f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 18,
  },
  footerLink: {
    marginTop: 35,
    alignItems: 'center',
  },
  linkText: {
    color: '#888',
    fontSize: 15,
  },
  linkHighlight: {
    color: '#c59d5f',
    fontWeight: 'bold',
  },
});