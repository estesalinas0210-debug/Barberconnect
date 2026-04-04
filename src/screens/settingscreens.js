import React, { useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator,Image} from 'react-native';

export default function SettingsScreen() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const user = auth().currentUser;
  if (!user) return null;
  const [photoURL, setPhotoURL] = useState(null);
  const [uploading, setUploading] = useState(false);
  

  // 🔥 Cargar datos
  useEffect(() => {
  const loadUserData = async () => {
    try {
      const doc = await firestore()
        .collection('users')
        .doc(user.uid)
        .get();

      if (doc.exists) {
        const data = doc.data();

        setName(data.name || '');
        setPhone(data.phone || '');
        setEmail(data.email || user.email);
        setPhotoURL(data.photoURL || null); // ✅ AQUÍ sí
      } else {
        setEmail(user.email);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  loadUserData();
}, []);

  // 🔁 Subir imagen
  const pickImage = async () => {
    if (!result.assets || result.assets.length === 0) return;
  const result = await launchImageLibrary({
    mediaType: 'photo',
    quality: 0.7,
  });

  if (result.didCancel) return;

  const uri = result.assets[0].uri;

  uploadImage(uri);
};

const uploadImage = async (uri) => {
  try {
    setUploading(true);

    const user = auth().currentUser;
    const filename = `profile_${user.uid}.jpg`;

    const reference = storage().ref(`profileImages/${filename}`);

    await reference.putFile(uri);

    const url = await reference.getDownloadURL();

    // 💾 guardar en Firestore
    await firestore()
      .collection('users')
      .doc(user.uid)
      .set({ photoURL: url }, { merge: true });

    setPhotoURL(url);

    Alert.alert('Foto actualizada 📸');
  } catch (error) {
    console.log(error);
    Alert.alert('Error al subir imagen');
  } finally {
    setUploading(false);
  }
};

  // 💾 Guardar perfil
  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('El nombre es obligatorio');
      return;
    }

    setSaving(true);

    try {
      await firestore()
        .collection('users')
        .doc(user.uid)
        .set(
          {
            name,
            phone,
            email,
          },
          { merge: true }
        );

      Alert.alert('Perfil actualizado 💈');
    } catch (error) {
      Alert.alert('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  // 🔓 Logout
  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Seguro?', [
      { text: 'Cancelar' },
      {
        text: 'Salir',
        onPress: async () => {
          await auth().signOut();
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    
    <View style={styles.container}>
      <Text style={styles.title}>Mi Perfil 💈</Text>

    <View style={styles.avatarContainer}>
      <TouchableOpacity onPress={pickImage}>
        {photoURL ? (
          <Image source={{ uri: photoURL }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {name ? name.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
        )}
      </TouchableOpacity>
      {uploading && <Text style={{ marginTop: 10 }}>Subiendo...</Text>}
    </View>
      
      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Tu nombre"
      />

      <Text style={styles.label}>Teléfono</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        placeholder="+549..."
      />

      <Text style={styles.label}>Correo</Text>
      <TextInput
        style={[styles.input, { backgroundColor: '#ddd' }]}
        value={email}
        editable={false}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>
          {saving ? 'Guardando...' : 'Guardar'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogout}>
        <Text style={styles.logout}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarContainer: {
  alignItems: 'center',
  marginBottom: 20,
},

avatar: {
  width: 100,
  height: 100,
  borderRadius: 50,
},

avatarPlaceholder: {
  width: 100,
  height: 100,
  borderRadius: 50,
  backgroundColor: '#c59d5f',
  justifyContent: 'center',
  alignItems: 'center',
},

avatarText: {
  fontSize: 40,
  color: '#fff',
  fontWeight: 'bold',
},
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  label: {
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#eee',
    padding: 15,
    borderRadius: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#c59d5f',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
  },
  logout: {
    marginTop: 30,
    color: 'red',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  center: {
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  }
});