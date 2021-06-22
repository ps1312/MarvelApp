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
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('displays a loading indicator on init', async () => {
    const {getByTestId} = makeCharactersScreen();

    expect(getByTestId('activityIndicator')).not.toBeNull();

    await waitForElementToBeRemoved(() => getByTestId('activityIndicator'));
  });

  test('calls md5 when fetching for characters', async () => {
    const timestamp = () => 9999999999999;
    const publicKey = 'public marvel key';
    const privateKey = 'private marvel key';

    const {getByText} = makeCharactersScreen();

    expect(md5).toHaveBeenCalledTimes(1);
    expect(md5).toHaveBeenCalledWith(timestamp() + publicKey + privateKey);

    await waitFor(() => {
      const retryButton = getByText('Tentar novamente');
      fireEvent.press(retryButton);

      expect(md5).toHaveBeenCalledTimes(2);
    });
  });

  test('should make request to characters with correct url', async () => {
    const timestamp = () => 111111111;
    const publicKey = 'public marvel key';
    const baseUrl = 'http://another-url.com/';
    const serviceSpy = jest.fn().mockRejectedValue(new Error());

    const {getByTestId} = makeCharactersScreen(
      serviceSpy,
      timestamp,
      publicKey,
      'private key',
      baseUrl,
    );

    const expectedUrl =
      baseUrl + `?ts=${timestamp()}&apikey=${publicKey}&hash=${md5MockedValue}`;

    expect(serviceSpy).toHaveBeenCalledTimes(1);
    expect(serviceSpy).toHaveBeenCalledWith(expectedUrl);

    await waitForElementToBeRemoved(() => getByTestId('activityIndicator'));
  });

  test('should display a retry button when listCharactersService fails', async () => {
    const {getByText} = makeCharactersScreen();

    await waitFor(() => getByText('Tentar novamente'));
  });

  test('should make request when retry button is tapped', async () => {
    const serviceSpy = jest.fn().mockRejectedValue(new Error());
    const {getByText, getByTestId} = makeCharactersScreen(serviceSpy);

    await waitFor(() => {
      const retryButton = getByText('Tentar novamente');
      fireEvent.press(retryButton);

      expect(getByTestId('activityIndicator')).not.toBeNull();
      expect(serviceSpy).toHaveBeenCalledTimes(2);
    });
  });
});

const makeCharactersScreen = (
  listCharactersService = jest.fn().mockRejectedValue(new Error()),
  timestamp = () => 9999999999999,
  publicKey = 'public marvel key',
  privateKey = 'private marvel key',
  baseUrl = 'http://any-url.com/',
) => {
  return render(
    <CharactersScreen
      listCharactersService={listCharactersService}
      timestamp={timestamp}
      publicKey={publicKey}
      privateKey={privateKey}
      baseUrl={baseUrl}
    />,
  );
};
