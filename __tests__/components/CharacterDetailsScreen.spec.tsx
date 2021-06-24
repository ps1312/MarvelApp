import React from 'react';
import {
  act,
  fireEvent,
  render,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react-native';
import CharacterDetailsScreen from '../../src/components/CharacterDetailsScreen';
import {Serie} from '../../src/services/getCharactersSeries';
import {CharacterEvent} from '../../src/services/getCharactersEvents';
import {Character} from '../../src/services/listCharactersService';

describe('CharacterDetailsScreen.tsx', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('displays a loading indicator on init', async () => {
    const {getByTestId} = makeCharacterDetailsScreen();
    expect(getByTestId('activityIndicator')).not.toBeNull();
    await waitForElementToBeRemoved(() => getByTestId('activityIndicator'));
  });

  test('should make requests to events and series', async () => {
    const baseUrl = 'http://another-url.com/';
    const eventsSpy = jest.fn().mockResolvedValue(new Error());
    const seriesSpy = jest.fn().mockResolvedValue(new Error());

    makeCharacterDetailsScreen(seriesSpy, eventsSpy, baseUrl);

    await waitFor(() => {
      expect(eventsSpy).toHaveBeenCalledTimes(1);
      expect(eventsSpy).toHaveBeenCalledTimes(1);
    });
  });

  test('should display a retry button when requests fails', async () => {
    const {getByText} = makeCharacterDetailsScreen();

    await waitFor(() => expect(getByText('Tentar novamente')).not.toBeNull());
  });

  test('should make request when retry button is tapped', async () => {
    const eventsSpy = jest.fn().mockRejectedValue(new Error());
    const seriesSpy = jest.fn().mockRejectedValue(new Error());

    const {findByText, getByTestId} = makeCharacterDetailsScreen(
      seriesSpy,
      eventsSpy,
    );

    await act(async () => {
      fireEvent.press(await findByText('Tentar novamente'));
      expect(getByTestId('activityIndicator')).not.toBeNull();
      expect(seriesSpy).toHaveBeenCalledTimes(2);
    });
  });

  test('should display character data passed as props', async () => {
    const character: Character = {
      id: 1,
      name: 'any-name',
      thumbUrl: 'http://any-url.com',
    };
    const seriesSpy = jest.fn().mockResolvedValue([]);
    const eventsSpy = jest.fn().mockResolvedValue([]);
    const {getByText, getByLabelText} = makeCharacterDetailsScreen(
      seriesSpy,
      eventsSpy,
      'http://any-url.com',
      character,
    );

    await waitFor(() => {
      getByText(character.name);
      const image1 = getByLabelText(character.thumbUrl);
      expect(image1.props.source.uri).toEqual(character.thumbUrl);
    });
  });

  test('should display header and empty state on sections when data is empty', async () => {
    const seriesSpy = jest.fn().mockResolvedValue([]);
    const eventsSpy = jest.fn().mockResolvedValue([]);
    const {getByText} = makeCharacterDetailsScreen(seriesSpy, eventsSpy);

    await waitFor(() => {
      getByText('Series');
      getByText('Nenhuma serie encontrada');
      getByText('Eventos');
      getByText('Nenhum evento encontrado');
    });
  });

  test('should display correct series and events', async () => {
    const serie: Serie = {
      id: 1,
      title: 'serie 1',
      startYear: 2000,
      endYear: 2001,
      thumbUrl: 'http://any-url.com',
    };
    const seriesSpy = jest.fn().mockResolvedValue([serie]);
    const event: CharacterEvent = {
      id: 1,
      title: 'event 1',
      start: 'start',
      end: 'end',
      thumbUrl: 'http://any-url.com',
    };
    const eventsSpy = jest.fn().mockResolvedValue([event]);
    const {getByText} = makeCharacterDetailsScreen(seriesSpy, eventsSpy);

    await waitFor(() => {
      getByText('Series');
      getByText(serie.title);
      getByText('Eventos');
      getByText(event.title);
    });
  });
});

const makeCharacterDetailsScreen = (
  getCharacterSeries = jest.fn().mockRejectedValue(new Error()),
  getCharacterEvents = jest.fn().mockRejectedValue(new Error()),
  baseUrl = 'http://any-url.com/',
  character: Character = {
    id: 1,
    name: 'any-name',
    thumbUrl: 'http://any-url.com',
  },
) => {
  return render(
    <CharacterDetailsScreen
      getCharacterEvents={getCharacterEvents}
      getCharacterSeries={getCharacterSeries}
      baseUrl={baseUrl}
      character={character}
    />,
  );
};
