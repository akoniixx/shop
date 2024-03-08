import { View, StyleSheet, Image } from 'react-native';
import React from 'react';
import Text from '../../components/Text/Text';
import images from '../../assets/images';

export default function EmptyList() {
  return (
    <View style={styles.container}>
      <Image
        source={images.emptyGift}
        style={styles.image}
        resizeMode="contain"
      />
      <Text color="text3" fontFamily="NotoSans">
        ไม่มีรายชื่อ
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  image: {
    width: 180,
    height: 140,
  },
});
