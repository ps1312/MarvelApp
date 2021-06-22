import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';
import md5 from 'md5';
import listCharactersService from './src/api';

const PUBLIC_KEY = 'd38c3e71397286b3b21d3ea99160fb8b';
const PRIVATE_KEY = '7ec5298d4994c38856f9e1427e9fd8ccd1555137';

const App = () => {
  useEffect(() => {
    async function makeRequest() {
      const timestamp = Number(new Date());
      const hash = md5(timestamp + PRIVATE_KEY + PUBLIC_KEY);
      const result = await listCharactersService(
        `https://gateway.marvel.com/v1/public/characters?ts=${timestamp}&limit=10&apikey=${PUBLIC_KEY}&hash=${hash}`,
      );

      console.log(result);
    }

    makeRequest();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text>Marvel App</Text>
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
