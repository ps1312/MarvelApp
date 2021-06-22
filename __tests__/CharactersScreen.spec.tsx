import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Button, View} from 'react-native';
import {waitForElementToBeRemoved, render} from '@testing-library/react-native';
import md5 from 'md5';

import {Character} from '../src/api';

const md5MockedValue = 'hashed';
jest.mock('md5', () => jest.fn().mockReturnValue(md5MockedValue));

type Props = {
  listCharactersService: (url: string) => Promise<Character>;
  timestamp: () => number;
  publicKey: string;
  privateKey: string;
  baseUrl: string;
};

const CharactersScreen = ({
  listCharactersService,
  timestamp,
  publicKey,
  privateKey,
  baseUrl,
}: Props) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function makeRequest() {
      const hash = md5(timestamp() + publicKey + privateKey);

      try {
        const queryParams = `?ts=${timestamp()}&limit=10&apikey=${publicKey}&hash=${hash}`;
        const url = baseUrl + queryParams;
        await listCharactersService(url);
      } catch {}

      setLoading(false);
    }

    makeRequest();
  }, [baseUrl, listCharactersService, privateKey, publicKey, timestamp]);

  return (
    <View>
      {loading ? (
        <ActivityIndicator testID={'activityIndicator'} />
      ) : (
        <Button title={'RETRY'} onPress={() => {}} />
      )}
    </View>
  );
};

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
      baseUrl +
      `?ts=${timestamp()}&limit=10&apikey=${publicKey}&hash=${md5MockedValue}`;
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

    const {getByTestId} = render(
      <CharactersScreen
        listCharactersService={listCharactersService}
        timestamp={timestamp}
        publicKey={publicKey}
        privateKey={privateKey}
        baseUrl={baseUrl}
      />,
    );

    await waitForElementToBeRemoved(() => getByTestId('activityIndicator'));
  });
});