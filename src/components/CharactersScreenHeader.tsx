import React from 'react';
import {StyleSheet, Text, View, PixelRatio} from 'react-native';

const CharactersScreenHeader = () => {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleBold}>BUSCA MARVEL</Text>
        <Text style={styles.titleLight}>TESTE MOBILE</Text>
      </View>
      <View style={styles.separator} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 24,
    marginVertical: 12,
  },
  titleContainer: {
    flexDirection: 'row',
  },
  titleBold: {
    fontSize: PixelRatio.get() <= 2 ? 22 : 24,
    fontWeight: 'bold',
    color: '#D42026',
  },
  titleLight: {
    fontSize: PixelRatio.get() <= 2 ? 22 : 24,
    fontWeight: '200',
    color: '#D42026',
  },
  separator: {
    borderBottomColor: '#D42026',
    borderBottomWidth: 4,
    width: 85,
    paddingTop: 8,
  },
});

export default CharactersScreenHeader;
