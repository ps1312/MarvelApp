import React, {useState, useEffect, useCallback} from 'react';
import {ActivityIndicator, Button} from 'react-native';
import {Serie} from '../services/getCharactersSeries';

const CharacterDetailsScreen = ({
  getCharacterSeries,
  getCharacterEvents,
  baseUrl,
}: Props) => {
  const [error, setError] = useState(false);

  const fetchDetails = useCallback(async () => {
    setError(false);
    try {
      await getCharacterSeries(baseUrl);
      await getCharacterEvents(baseUrl);
    } catch (e) {
      setError(true);
    }
  }, [baseUrl, getCharacterEvents, getCharacterSeries]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return error ? (
    <Button title={'Tentar novamente'} onPress={() => fetchDetails()} />
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
