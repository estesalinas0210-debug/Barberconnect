import { Text, View, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';

const listitem = ({item}) => {
  
  const {name, price} = item;
  return (
    <View>
        <Text>{name}</Text>
        <Text>{price}</Text>
      </View>
    )
  }

   

export default listitem