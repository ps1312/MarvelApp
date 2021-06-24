import React, {useState, useEffect, useCallback} from 'react';
import {
  ActivityIndicator,
  Button,
  SectionList,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  View,
} from 'react-native';
import {CharacterEvent} from '../services/getCharactersEvents';
import {Serie} from '../services/getCharactersSeries';
import {Character} from '../services/listCharactersService';
import theme from '../theme';

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

  const renderCharacter = (item: Character | undefined) => {
    return (
      <View style={styles.characterInfoContainer}>
        <Image
          style={styles.characterImage}
          source={{uri: item?.thumbUrl}}
          accessibilityLabel={item?.thumbUrl}
        />
      </View>
    );
  };

  const renderSerie = (item: Serie) => {
    return (
      <>
        <Image
          style={styles.thumbnailImage}
          source={{uri: item.thumbUrl}}
          accessibilityLabel={item.thumbUrl}
        />
        <Text>{item.title}</Text>

        <Text>{item.description}</Text>
        <Text>{item.startYear}</Text>
        <Text>{item.startYear}</Text>
      </>
    );
  };

  const renderEvent = (item: CharacterEvent) => {
    return (
      <>
        <Image
          style={styles.thumbnailImage}
          source={{uri: item.thumbUrl}}
          accessibilityLabel={item.thumbUrl}
        />
        <Text>{item.title}</Text>

        <Text>{item.description}</Text>
        <Text>{item.start}</Text>
        <Text>{item.end}</Text>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.headerContainer} onPress={onDetailsClose}>
        <Text style={styles.headerCloseText}>X</Text>
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
            renderSectionHeader={({section: {title}}) => {
              if (title === character?.name) {
                return (
                  <View style={styles.characterInfoSectionHeaderContainer}>
                    <Text style={styles.characterInfoSectionHeaderText}>
                      {title}
                    </Text>
                  </View>
                );
              }
              return (
                <View style={styles.sectionHeaderContainer}>
                  <Text style={styles.sectionHeaderContainerText}>{title}</Text>
                </View>
              );
            }}
            renderSectionFooter={({section}: any) => {
              if (section.data.length === 0) {
                return <Text>{section.emptyState}</Text>;
              }

              return null;
            }}
            renderItem={({item, section}) => {
              if (section.title === character?.name) {
                return renderCharacter(character);
              } else if (section.title === 'Series') {
                return renderSerie(item);
              }
              return renderEvent(item);
            }}
          />
        </>
      )}
    </SafeAreaView>
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
  headerContainer: {
    height: 44,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  headerCloseText: {
    fontSize: 28,
    alignSelf: 'center',
    marginRight: 24,
  },
  characterImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: theme.primaryColor,
  },
  characterInfoContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    paddingVertical: 24,
  },
  characterInfoSectionHeaderContainer: {
    height: 44,
    backgroundColor: 'white',
  },
  characterInfoSectionHeaderText: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  thumbnailImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  sectionHeaderContainer: {
    height: 44,
    backgroundColor: theme.primaryColor,
    justifyContent: 'center',
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  sectionHeaderContainerText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CharacterDetailsScreen;
