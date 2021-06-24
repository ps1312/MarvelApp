import React, {useState, useEffect, useCallback} from 'react';
import {
  ActivityIndicator,
  Button,
  SectionList,
  Text,
  Image,
} from 'react-native';
import {CharacterEvent} from '../services/getCharactersEvents';
import {Serie} from '../services/getCharactersSeries';
import {Character} from '../services/listCharactersService';

const CharacterDetailsScreen = ({
  getCharacterSeries,
  getCharacterEvents,
  baseUrl,
  character,
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

  return error ? (
    <Button title={'Tentar novamente'} onPress={() => fetchDetails()} />
  ) : loading ? (
    <ActivityIndicator testID={'activityIndicator'} />
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
        renderItem={({item, section}) => {
          if (section.title === character?.name) {
            return (
              <Image
                style={{width: 40, height: 40}}
                source={{uri: item.thumbUrl}}
                accessibilityLabel={item.thumbUrl}
              />
            );
          }
          return <Text>{item.title}</Text>;
        }}
      />
    </>
  );
};

interface Props {
  getCharacterSeries: (url: string) => Promise<Serie[]>;
  getCharacterEvents: (url: string) => Promise<CharacterEvent[]>;
  baseUrl: string;
  character?: Character;
}

export default CharacterDetailsScreen;
