import React from 'react';
import {
  waitForElementToBeRemoved,
  render,
  waitFor,
  fireEvent,
} from '@testing-library/react-native';
import md5 from 'md5';
import CharactersScreen from '../src/CharactersScreen';

const md5MockedValue = 'hashed';
jest.mock('md5', () => jest.fn().mockReturnValue(md5MockedValue));

describe('CharactersScreen.tsx', () => {
  test('should make request to characters and display a loading indicator on init', async () => {
    const listCharactersService = jest.fn().mockRejectedValue(new Error());
    const timestamp = () => 9999999999999;
    const publicKey = 'public marvel key';
    const privateKey = 'private marvel key';
    const baseUrl = 'http://any-url.com/';

    const {getByTestId} = render(
      <CharactersScreen
        listCharactersService={listCharactersService}
        timestamp={timestamp}
        publicKey={publicKey}
        privateKey={privateKey}
        baseUrl={baseUrl}
      />,
    );
    expect(getByTestId('activityIndicator')).not.toBeNull();

    expect(md5).toHaveBeenCalledTimes(1);
    expect(md5).toHaveBeenCalledWith(timestamp() + publicKey + privateKey);

    const expectedUrl =
      baseUrl + `?ts=${timestamp()}&apikey=${publicKey}&hash=${md5MockedValue}`;
    expect(listCharactersService).toHaveBeenCalledTimes(1);
    expect(listCharactersService).toHaveBeenCalledWith(expectedUrl);

    await waitForElementToBeRemoved(() => getByTestId('activityIndicator'));
  });

  test('should display a retry button when listCharactersService fails', async () => {
    const listCharactersService = jest.fn().mockRejectedValue(new Error());
    const timestamp = () => 9999999999999;
    const publicKey = 'public marvel key';
    const privateKey = 'private marvel key';
    const baseUrl = 'http://any-url.com/';

    const {getByText} = render(
      <CharactersScreen
        listCharactersService={listCharactersService}
        timestamp={timestamp}
        publicKey={publicKey}
        privateKey={privateKey}
        baseUrl={baseUrl}
      />,
    );

    await waitFor(() => getByText('Tentar novamente'));
  });

  test('should make request when retry button is tapped', async () => {
    const listCharactersService = jest.fn().mockRejectedValue(new Error());
    const timestamp = () => 9999999999999;
    const publicKey = 'public marvel key';
    const privateKey = 'private marvel key';
    const baseUrl = 'http://any-url.com/';

    const {getByText, getByTestId} = render(
      <CharactersScreen
        listCharactersService={listCharactersService}
        timestamp={timestamp}
        publicKey={publicKey}
        privateKey={privateKey}
        baseUrl={baseUrl}
      />,
    );

    await waitFor(() => {
      const retryButton = getByText('Tentar novamente');
      fireEvent.press(retryButton);

      expect(getByTestId('activityIndicator')).not.toBeNull();
      expect(listCharactersService).toHaveBeenCalledTimes(2);
    });
  });
});
