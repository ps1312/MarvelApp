import React from 'react';
import {render, waitFor} from '@testing-library/react-native';
import CharacterDetailsScreen from '../../src/components/CharacterDetailsScreen';

describe('CharacterDetailsScreen.tsx', () => {
  test('displays a loading indicator on init', async () => {
    const {getByTestId} = makeCharacterDetailsScreen();
    expect(getByTestId('activityIndicator')).not.toBeNull();
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
