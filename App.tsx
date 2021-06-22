import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import listCharactersService from './src/api';
import CharactersScreen from './src/CharactersScreen';

const PUBLIC_KEY = 'd38c3e71397286b3b21d3ea99160fb8b';
const PRIVATE_KEY = '7ec5298d4994c38856f9e1427e9fd8ccd1555137';

const App = () => {
  const timestamp = Number(new Date());

  return (
    <SafeAreaView style={styles.container}>
      <CharactersScreen
        listCharactersService={listCharactersService}
        timestamp={timestamp}
        publicKey={PUBLIC_KEY}
        privateKey={PRIVATE_KEY}
        baseUrl={'https://gateway.marvel.com/v1/public/characters'}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
