import React, {useState, useEffect, useCallback} from 'react';
import {
  ActivityIndicator,
  Button,
  SectionList,
  Text,
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import {CharacterEvent} from '../services/getCharactersEvents';
import {Serie} from '../services/getCharactersSeries';
import {Character} from '../services/listCharactersService';

const CharacterDetailsScreen = ({
  getCharacterSeries,
  getCharacterEvents,
  baseUrl,
  character,
  onDetailsClose,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [series, setSeries] = useState<Serie[]>([]);
  const [events, setEvents] = useState<CharacterEvent[]>([]);

  const fetchDetails = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      setSeries(await getCharacterSeries(baseUrl));
      setEvents(await getCharacterEvents(baseUrl));
    } catch (e) {
      setError(true);
    }

    setLoading(false);
  }, [baseUrl, getCharacterEvents, getCharacterSeries]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const DATA = [
    {
      title: character?.name,
      emptyState: '',
      data: [character],
    },
    {
      title: 'Series',
      emptyState: 'Nenhuma serie encontrada',
      data: series,
    },
    {
      title: 'Eventos',
      emptyState: 'Nenhum evento encontrado',
      data: events,
    },
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onDetailsClose}>
        <Text>Voltar</Text>
      </TouchableOpacity>
      {error ? (
        <Button title={'Tentar novamente'} onPress={() => fetchDetails()} />
      ) : loading ? (
        <ActivityIndicator
          size={'large'}
          testID={'activityIndicator'}
          color={'red'}
        />
      ) : (
        <>
          <SectionList<any>
            sections={DATA}
            keyExtractor={(item, index) => item.title + index}
            renderSectionHeader={({section: {title}}) => <Text>{title}</Text>}
            renderSectionFooter={({section}: any) => {
              if (section.data.length === 0) {
                return <Text>{section.emptyState}</Text>;
              }

              return null;
            }}
            renderItem={({item}) => {
              return (
                <>
                  <Image
                    style={styles.characterImage}
                    source={{uri: item.thumbUrl}}
                    accessibilityLabel={item.thumbUrl}
                  />
                  <Text>{item.title}</Text>
                </>
              );
            }}
          />
        </>
      )}
    </View>
  );
};

interface Props {
  getCharacterSeries: (url: string) => Promise<Serie[]>;
  getCharacterEvents: (url: string) => Promise<CharacterEvent[]>;
  baseUrl: string;
  character?: Character;
  onDetailsClose: () => void;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  characterImage: {
    width: 40,
    height: 40,
  },
});

export default CharacterDetailsScreen;
