import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { UserContext } from '../context/UserContext';

export default function UserAvatar({ size = 40 }) {
  const userData = useContext(UserContext);

  if (!userData) return null;

  const { name, photoURL } = userData;

  if (photoURL) {
    return (
      <Image
        source={{ uri: photoURL }}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
        }}
      />
    );
  }

  return (
    <View
      style={[
        styles.placeholder,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Text style={styles.text}>
        {name ? name.charAt(0).toUpperCase() : 'U'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: '#c59d5f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
});