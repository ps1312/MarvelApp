import md5 from 'md5';
import React, {useState, useEffect} from 'react';
import {View, ActivityIndicator, Button} from 'react-native';
import {Character} from './api';

type Props = {
  listCharactersService: (url: string) => Promise<Character[]>;
  timestamp: () => number;
  publicKey: string;
  privateKey: string;
  baseUrl: string;
};

const CharactersScreen = ({
  listCharactersService,
  timestamp,
  publicKey,
  privateKey,
  baseUrl,
}: Props) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function makeRequest() {
      const hash = md5(timestamp() + publicKey + privateKey);

      try {
        const queryParams = `?ts=${timestamp()}&apikey=${publicKey}&hash=${hash}`;
        const url = baseUrl + queryParams;
        await listCharactersService(url);
      } catch {}

      setLoading(false);
    }

    makeRequest();
  }, [baseUrl, listCharactersService, privateKey, publicKey, timestamp]);

  return (
    <View>
      {loading ? (
        <ActivityIndicator testID={'activityIndicator'} />
      ) : (
        <Button title={'Tentar novamente'} onPress={() => {}} />
      )}
    </View>
  );
};

export default CharactersScreen;
