import md5 from 'md5';
import React, {useState, useEffect, useCallback} from 'react';
import {View, ActivityIndicator, Button, Text, FlatList} from 'react-native';
import {Character} from './api';

type Props = {
  listCharactersService: (url: string) => Promise<Character[]>;
  timestamp: number;
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [characters, setCharacters] = useState<Character[]>([]);

  const fetchCharacters = useCallback(async () => {
    setLoading(true);
    const hash = md5(timestamp + privateKey + publicKey);

    try {
      const queryParams = `?ts=${timestamp}&apikey=${publicKey}&hash=${hash}`;
      const url = baseUrl + queryParams;
      const result = await listCharactersService(url);
      setCharacters(result);
    } catch {
      setError(true);
    }

    setLoading(false);
  }, [baseUrl, listCharactersService, privateKey, publicKey, timestamp]);

  useEffect(() => {
    fetchCharacters();
  }, [fetchCharacters]);

  return (
    <View>
      {loading ? (
        <ActivityIndicator testID={'activityIndicator'} />
      ) : error ? (
        <Button title={'Tentar novamente'} onPress={() => fetchCharacters()} />
      ) : (
        <FlatList
          data={characters}
          renderItem={({item}) => <Text key={item.id}>{item.name}</Text>}
          keyExtractor={item => `${item.id}`}
          ListFooterComponent={<Text>Fuck</Text>}
        />
      )}
    </View>
  );
};

export default CharactersScreen;
