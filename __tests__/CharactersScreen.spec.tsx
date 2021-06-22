import React from 'react';
import {ActivityIndicator} from 'react-native';
import renderer from 'react-test-renderer';
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
  const hash = md5(timestamp + publicKey + privateKey);

  listCharactersService(
    baseUrl + `?ts=${timestamp()}&limit=10&apikey=${publicKey}&hash=${hash}`,
  );

  return <ActivityIndicator />;
};

describe('CharactersScreen.tsx', () => {
  test('should make request to characters and display a loading indicator on init', () => {
    const listCharactersService = jest.fn();
    const timestamp = () => 9999999999999;
    const publicKey = 'public marvel key';
    const privateKey = 'private marvel key';
    const baseUrl = 'http://any-url.com/';

    const testInstance = renderer.create(
      <CharactersScreen
        listCharactersService={listCharactersService}
        timestamp={timestamp}
        publicKey={publicKey}
        privateKey={privateKey}
        baseUrl={baseUrl}
      />,
    ).root;

    const activityIndicator = testInstance.findByType(ActivityIndicator);
    expect(activityIndicator).not.toBeNull();

    expect(md5).toHaveBeenCalledTimes(1);
    expect(md5).toHaveBeenCalledWith(timestamp + publicKey + privateKey);

    const expectedUrl =
      baseUrl +
      `?ts=${timestamp()}&limit=10&apikey=${publicKey}&hash=${md5MockedValue}`;
    expect(listCharactersService).toHaveBeenCalledTimes(1);
    expect(listCharactersService).toHaveBeenCalledWith(expectedUrl);
  });
});
