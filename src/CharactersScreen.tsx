import md5 from 'md5';
import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  ActivityIndicator,
  Button,
  Text,
  FlatList,
  Image,
  TextInput,
} from 'react-native';
import debounce from 'lodash.debounce';
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
  const [searchTerm, setSearchTerm] = useState('');
  const delayedSearch = debounce(term => setSearchTerm(term), 300);

  const fetchCharacters = useCallback(async () => {
    setLoading(true);
    const hash = md5(timestamp + privateKey + publicKey);

    try {
      let queryParams = `?ts=${timestamp}&apikey=${publicKey}&hash=${hash}`;
      if (searchTerm !== '') {
        queryParams += `&nameStartsWith=${searchTerm}`;
      }
      const url = baseUrl + queryParams;
      const result = await listCharactersService(url);
      setCharacters(result);
    } catch {
      setError(true);
    }

    setLoading(false);
  }, [
    baseUrl,
    listCharactersService,
    privateKey,
    publicKey,
    timestamp,
    searchTerm,
  ]);

  useEffect(() => {
    fetchCharacters();
  }, [fetchCharacters, searchTerm]);

  return (
    <View style={{width: '100%', height: '100%'}}>
      {loading ? (
        <ActivityIndicator testID={'activityIndicator'} />
      ) : error ? (
        <Button title={'Tentar novamente'} onPress={() => fetchCharacters()} />
      ) : (
        <View>
          <View style={{width: '100%', height: '10%', backgroundColor: 'red'}}>
            <TextInput
              placeholder={'Search for a character...'}
              onChangeText={delayedSearch}
            />
          </View>
          <FlatList
            data={characters}
            renderItem={({item}) => (
              <View>
                <Image
                  style={{width: 50, height: 50, borderRadius: 25}}
                  source={{uri: item.thumbUrl}}
                  accessibilityLabel={item.thumbUrl}
                />
                <Text key={item.id}>{item.name}</Text>
              </View>
            )}
            style={{height: '80%'}}
            keyExtractor={item => `${item.id}`}
          />
          <View
            style={{width: '100%', height: '10%', backgroundColor: 'red'}}
          />
        </View>
      )}
    </View>
  );
};

export default CharactersScreen;
