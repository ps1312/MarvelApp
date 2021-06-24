import React, {useState, useEffect} from 'react';
import {ActivityIndicator, Button} from 'react-native';
import {Serie} from '../services/getCharactersSeries';

const CharacterDetailsScreen = ({
  getCharacterSeries,
  getCharacterEvents,
  baseUrl,
}: Props) => {
  const [error, setError] = useState(false);

  useEffect(() => {
    async function makeRequest() {
      try {
        await getCharacterSeries(baseUrl);
        await getCharacterEvents(baseUrl);
      } catch (e) {
        setError(true);
      }
    }
    makeRequest();
  }, [baseUrl, getCharacterEvents, getCharacterSeries]);

  return error ? (
    <Button title={'Tentar novamente'} onPress={() => {}} />
  ) : (
    <ActivityIndicator testID={'activityIndicator'} />
  );
};

interface Props {
  getCharacterSeries: (url: string) => Promise<Serie[]>;
  getCharacterEvents: (url: string) => Promise<Event[]>;
  baseUrl: string;
}

export default CharacterDetailsScreen;
