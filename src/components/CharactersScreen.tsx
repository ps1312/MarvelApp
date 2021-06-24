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
  TouchableOpacity,
} from 'react-native';
import debounce from 'lodash.debounce';
import Pagination from './Pagination';
import {
  Character,
  ListCharactersServiceResult,
} from '../services/listCharactersService';

const CharactersScreen = ({
  listCharactersService,
  baseUrl,
  onCharacterPress,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState<Params>({page: 0, searchTerm: ''});

  const delayedSearch = debounce(term => {
    setParams({searchTerm: term, page: term === '' ? 0 : params.page});
  }, 300);

  const fetchCharacters = useCallback(async () => {
    setError(false);
    setLoading(true);

    try {
      let queryParams = `&offset=${params.page * 10}&limit=10`;
      if (params.searchTerm !== '') {
        queryParams += `&nameStartsWith=${params.searchTerm}`;
      }
      const url = baseUrl + queryParams;
      const {items, total: apiTotal} = await listCharactersService(url);
      setCharacters(items);
      setTotal(apiTotal);
    } catch (e) {
      setError(true);
    }

    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, baseUrl]);

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
              <ActivityIndicator
                size={'large'}
                testID={'activityIndicator'}
                color="red"
              />
            ) : (
              <>
                <FlatList
                  data={characters}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => onCharacterPress(item)}>
                      <Image
                        style={styles.thumbnailImage}
                        source={{uri: item.thumbUrl}}
                        accessibilityLabel={item.thumbUrl}
                      />
                      <Text>{item.name}</Text>
                    </TouchableOpacity>
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
                    current={params.page}
                    onPageChange={newPage =>
                      setParams({searchTerm: params.searchTerm, page: newPage})
                    }
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
  baseUrl: string;
  onCharacterPress: (character: Character) => void;
};

type Params = {
  searchTerm: string;
  page: number;
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
