import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, Button, View} from 'react-native';
import CharacterDetailsScreen from './src/components/CharacterDetailsScreen';
import CharactersScreen from './src/components/CharactersScreen';
import decorateUrl from './src/decorateUrl';
import getCharactersEvents from './src/services/getCharactersEvents';
import getCharactersSeries from './src/services/getCharactersSeries';
import listCharactersService, {
  Character,
} from './src/services/listCharactersService';

const App = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [character, setCharacter] = useState<Character>();
  const service = (url: string) => listCharactersService(decorateUrl(url));

  return (
    <SafeAreaView style={styles.container}>
      {showDetails && (
        <View style={styles.modal}>
          <Button title={'𝗫'} onPress={() => setShowDetails(false)} />
          <CharacterDetailsScreen
            getCharacterEvents={url =>
              getCharactersEvents(decorateUrl(url + 'events?'))
            }
            getCharacterSeries={url =>
              getCharactersSeries(decorateUrl(url + 'series?'))
            }
            baseUrl={`https://gateway.marvel.com/v1/public/characters/${character?.id}/`}
            character={character}
          />
        </View>
      )}

      <CharactersScreen
        listCharactersService={service}
        baseUrl={'https://gateway.marvel.com/v1/public/characters?'}
        onCharacterPress={selectedCharacter => {
          setShowDetails(true);
          setCharacter(selectedCharacter);
        }}
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
  modal: {
    position: 'absolute',
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
    zIndex: 99,
  },
});

export default App;
