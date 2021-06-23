import React from 'react';
import {
  waitForElementToBeRemoved,
  render,
  waitFor,
  fireEvent,
  act,
} from '@testing-library/react-native';
import md5 from 'md5';
import CharactersScreen from '../src/CharactersScreen';
import {makeCharacter} from '../__utils__/test-helpers';

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
    const timestamp = 9999999999999;
    const publicKey = 'public marvel key';
    const privateKey = 'private marvel key';

    const {getByText} = makeCharactersScreen();

    expect(md5).toHaveBeenCalledTimes(1);
    expect(md5).toHaveBeenCalledWith(timestamp + privateKey + publicKey);

    await waitFor(() => {
      const retryButton = getByText('Tentar novamente');
      fireEvent.press(retryButton);

      expect(md5).toHaveBeenCalledTimes(2);
    });
  });

  test('should make request to characters with correct url', async () => {
    const timestamp = 111111111;
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
      baseUrl +
      `?offset=0&limit=10&ts=${timestamp}&apikey=${publicKey}&hash=${md5MockedValue}`;

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
    const {findByText, getByTestId} = makeCharactersScreen(serviceSpy);

    await act(async () => {
      fireEvent.press(await findByText('Tentar novamente'));
      expect(getByTestId('activityIndicator')).not.toBeNull();
      expect(serviceSpy).toHaveBeenCalledTimes(2);
    });
  });

  test('should display characters names and thumbnails when service succeeds', async () => {
    const [, characterModel1] = makeCharacter();
    const [, characterModel2] = makeCharacter(
      2,
      'another name',
      'another-thumburl.com',
    );

    const results = [characterModel1, characterModel2];
    const serviceSpy = jest.fn().mockResolvedValue({
      items: results,
      total: results.length,
    });
    const {getByText, getByLabelText} = makeCharactersScreen(serviceSpy);

    await waitFor(() => {
      expect(getByText(characterModel1.name)).not.toBeNull();
      const image1 = getByLabelText(characterModel1.thumbUrl);
      expect(image1.props.source.uri).toEqual(characterModel1.thumbUrl);

      expect(getByText(characterModel2.name)).not.toBeNull();
      const image2 = getByLabelText(characterModel2.thumbUrl);
      expect(image2.props.source.uri).toEqual(characterModel2.thumbUrl);
    });
  });

  test('search bar changes triggers request with search text', async () => {
    const serviceSpy = jest.fn().mockResolvedValue([]);

    const {getByPlaceholderText} = makeCharactersScreen(serviceSpy);

    await act(async () => {
      const input = getByPlaceholderText('Search for a character...');
      fireEvent.changeText(input, 'ir');

      await waitFor(() => {
        expect(serviceSpy).toHaveBeenCalledTimes(2);
        expect(serviceSpy.mock.calls[1][0].includes('ir')).toBeTruthy();
      });
    });
  });

  test('screen displays empty state when no characters exists', async () => {
    const serviceSpy = jest.fn().mockResolvedValue([]);

    const {findByText} = makeCharactersScreen(serviceSpy);

    expect(await findByText('Nenhum personagem encontrado')).not.toBeNull();
  });
});

const makeCharactersScreen = (
  listCharactersService = jest.fn().mockRejectedValue(new Error()),
  timestamp = 9999999999999,
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
