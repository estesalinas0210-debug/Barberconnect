import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const productos = [
   
    { id: 1, 
      name: 'Pomada moldeadore', 
      price: '$20',
      Image: require('../imagenes/pomada.jpg'),
      description: 'Un corte de cabello clásico y moderno para hombres, realizado por barberos expertos utilizando técnicas de corte precisas y herramientas de alta calidad. El servicio incluye un lavado de cabello, corte personalizado según las preferencias del cliente, y un peinado final para lograr un look impecable y a la moda.'
    },
      

    { id: 2, 
      name: 'Cera para cabello', 
      price: '$15',
      Image: require('../imagenes/cera.jpg'),
      description: 'Un corte de cabello clásico y moderno para hombres, realizado por barberos expertos utilizando técnicas de corte precisas y herramientas de alta calidad. El servicio incluye un lavado de cabello, corte personalizado según las preferencias del cliente, y un peinado final para lograr un look impecable y a la moda.'
    },
      

    { id: 3, 
      name: 'Texturizador', 
      price: '$25',
      Image: require('../imagenes/texturizador.jpg'),
      description: 'Un corte de cabello clásico y moderno para hombres, realizado por barberos expertos utilizando técnicas de corte precisas y herramientas de alta calidad. El servicio incluye un lavado de cabello, corte personalizado según las preferencias del cliente, y un peinado final para lograr un look impecable y a la moda.'
    },
      

    { id: 4, 
      name: 'Shampoo y acondicionador', 
      price: '$30',
      Image: require('../imagenes/sh&aco.jpg'),
      description: 'Un corte de cabello clásico y moderno para hombres, realizado por barberos expertos utilizando técnicas de corte precisas y herramientas de alta calidad. El servicio incluye un lavado de cabello, corte personalizado según las preferencias del cliente, y un peinado final para lograr un look impecable y a la moda.'
    },
      

    { id: 5, 
      name: 'Masaje capilar', 
      price: '$20',
      Image: require('../imagenes/masaje_capilar.jpg'),
      description: 'Un corte de cabello clásico y moderno para hombres, realizado por barberos expertos utilizando técnicas de corte precisas y herramientas de alta calidad. El servicio incluye un lavado de cabello, corte personalizado según las preferencias del cliente, y un peinado final para lograr un look impecable y a la moda.'
    },
  // puedes dejar los demás igual
];

const ProductCard = React.memo(({ item, isExpanded, onPress }) => {
  const animation = new Animated.Value(isExpanded ? 1 : 0);

  React.useEffect(() => {
    Animated.spring(animation, {
      toValue: isExpanded ? 1 : 0,
      friction: 7,
      tension: 70,
      useNativeDriver: true,
    }).start();
  }, [isExpanded]);

  const rotateArrow = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const animatedContentStyle = {
    opacity: animation,
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [-10, 0],
        }),
      },
    ],
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.price}>{item.price}</Text>
          </View>

          <View style={{ alignItems: 'center' }}>
            <Image source={item.Image} style={styles.image} />
            <Animated.Text
              style={{ transform: [{ rotate: rotateArrow }], marginTop: 6 }}
            >
              ▼
            </Animated.Text>
          </View>
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <Animated.View style={[styles.expanded, animatedContentStyle]}>
          <Text style={styles.description}>{item.description}</Text>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Comprar</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
});

export default function SettingsScreen() {
  const [selectedId, setSelectedId] = useState(null);

  const renderItem = useCallback(
    ({ item }) => (
      <ProductCard
        item={item}
        isExpanded={selectedId === item.id}
        onPress={() =>
          setSelectedId(selectedId === item.id ? null : item.id)
        }
      />
    ),
    [selectedId]
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={productos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={7}
        removeClippedSubviews
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 18,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  price: {
    fontSize: 15,
    color: '#777',
    marginTop: 4,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 16,
  },
  expanded: {
    marginTop: 15,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#444',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#111',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});