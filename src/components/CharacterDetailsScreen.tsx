import React, {useState, useEffect, useCallback} from 'react';
import {ActivityIndicator, Button, SectionList, Text} from 'react-native';
import {CharacterEvent} from '../services/getCharactersEvents';
import {Serie} from '../services/getCharactersSeries';

const CharacterDetailsScreen = ({
  getCharacterSeries,
  getCharacterEvents,
  baseUrl,
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
        renderItem={({item}) => {
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
}

export default CharacterDetailsScreen;
