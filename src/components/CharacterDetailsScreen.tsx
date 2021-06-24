import React, {useEffect} from 'react';
import {ActivityIndicator} from 'react-native';
import {Serie} from '../services/getCharactersSeries';

const CharacterDetailsScreen = ({
  getCharacterSeries,
  getCharacterEvents,
  baseUrl,
}: Props) => {
  useEffect(() => {
    async function makeRequest() {
      try {
        await getCharacterSeries(baseUrl);
        await getCharacterEvents(baseUrl);
      } catch (e) {}
    }
    makeRequest();
  }, [baseUrl, getCharacterEvents, getCharacterSeries]);

  return <ActivityIndicator testID={'activityIndicator'} />;
};

interface Props {
  getCharacterSeries: (url: string) => Promise<Serie[]>;
  getCharacterEvents: (url: string) => Promise<Event[]>;
  baseUrl: string;
}

export default CharacterDetailsScreen;
