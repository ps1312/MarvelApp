import React from 'react';
import {
  render,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react-native';
import CharacterDetailsScreen from '../../src/components/CharacterDetailsScreen';

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
});

const makeCharacterDetailsScreen = (
  getCharacterSeries = jest.fn().mockRejectedValue(new Error()),
  getCharacterEvents = jest.fn().mockRejectedValue(new Error()),
  baseUrl = 'http://any-url.com/',
) => {
  return render(
    <CharacterDetailsScreen
      getCharacterEvents={getCharacterEvents}
      getCharacterSeries={getCharacterSeries}
      baseUrl={baseUrl}
    />,
  );
};
