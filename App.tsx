import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import listCharactersService from './src/api';
import CharactersScreen from './src/CharactersScreen';
import decorateUrl from './src/decorateUrl';

const App = () => {
  const service = (url: string) => listCharactersService(decorateUrl(url));

  return (
    <SafeAreaView style={styles.container}>
      <CharactersScreen
        listCharactersService={service}
        baseUrl={'https://gateway.marvel.com/v1/public/characters?'}
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
