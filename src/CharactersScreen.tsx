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
  StyleSheet,
} from 'react-native';
import debounce from 'lodash.debounce';
import {Character, ListCharactersServiceResult} from './api';
import Pagination from './Pagination';

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
  const delayedSearch = debounce(term => {
    setPage(0);
    setSearchTerm(term);
  }, 300);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);

  const fetchCharacters = useCallback(async () => {
    setError(false);
    setLoading(true);
    const hash = md5(timestamp + privateKey + publicKey);

    try {
      let queryParams = `?offset=${
        page * 10
      }&limit=10&ts=${timestamp}&apikey=${publicKey}&hash=${hash}`;
      if (searchTerm !== '') {
        queryParams += `&nameStartsWith=${searchTerm}`;
      }
      const url = baseUrl + queryParams;
      const {items, total: apiTotal} = await listCharactersService(url);
      setCharacters(items);
      setTotal(apiTotal);
    } catch (e) {
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
    page,
  ]);

  useEffect(() => {
    fetchCharacters();
  }, [fetchCharacters]);

  return (
    <View style={styles.container}>
      {error ? (
        <Button title={'Tentar novamente'} onPress={() => fetchCharacters()} />
      ) : (
        <View>
          <View style={styles.searchBarContainer}>
            <TextInput
              placeholder={'Search for a character...'}
              onChangeText={delayedSearch}
            />
          </View>
          <View style={styles.charactersListContainer}>
            {loading ? (
              <ActivityIndicator testID={'activityIndicator'} />
            ) : (
              <>
                <FlatList
                  data={characters}
                  renderItem={({item}) => (
                    <View key={item.id}>
                      <Image
                        style={styles.thumbnailImage}
                        source={{uri: item.thumbUrl}}
                        accessibilityLabel={item.thumbUrl}
                      />
                      <Text>{item.name}</Text>
                    </View>
                  )}
                  style={styles.flatList}
                  keyExtractor={item => `${item.id}`}
                  ListEmptyComponent={() => (
                    <Text>Nenhum personagem encontrado</Text>
                  )}
                />
                <View style={styles.footerContainer}>
                  <Pagination
                    total={total}
                    current={page}
                    onPageChange={setPage}
                  />
                </View>
              </>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

type Props = {
  listCharactersService: (url: string) => Promise<ListCharactersServiceResult>;
  timestamp: number;
  publicKey: string;
  privateKey: string;
  baseUrl: string;
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  searchBarContainer: {
    width: '100%',
    height: '10%',
  },
  charactersListContainer: {
    width: '100%',
    height: '90%',
  },
  thumbnailImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  flatList: {
    height: '80%',
  },
  footerContainer: {
    width: '100%',
    height: '10%',
  },
});

export default CharactersScreen;
