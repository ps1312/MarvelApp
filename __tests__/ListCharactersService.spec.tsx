import listCharactersService from '../src/api';
import {makeCharacter} from '../__utils__/test-helpers';

describe('listCharactersService()', () => {
  test('make request with provided url', () => {
    global.fetch = mockRejectedFetch();

    const url = 'https://any-url.com';
    listCharactersService(url);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenLastCalledWith(url);
  });

  test('throws error when fetch fails', async () => {
    global.fetch = mockRejectedFetch();

    const url = 'https://any-url.com';
    await expect(listCharactersService(url)).rejects.toThrow();
  });

  test('throws error when fetch returns invalid data', async () => {
    global.fetch = mockInvalidFetchResponse();

    const url = 'https://any-url.com';
    await expect(listCharactersService(url)).rejects.toThrow();
  });

  test('returns empty heroes list when fetch succeeds with no heroes', async () => {
    global.fetch = mockValidFetchResponse();

    const url = 'https://any-url.com';
    const result = await listCharactersService(url);
    expect(result.length).toEqual(0);
  });

  test('throws error when fetch returns invalid heroes', async () => {
    const character1 = {};
    global.fetch = mockValidFetchResponse([character1]);
    await expect(
      listCharactersService('https://any-url.com'),
    ).rejects.toThrow();

    const character2 = {id: 123};
    global.fetch = mockValidFetchResponse([character2]);
    await expect(
      listCharactersService('https://any-url.com'),
    ).rejects.toThrow();

    const character3 = {name: 'name'};
    global.fetch = mockValidFetchResponse([character3]);
    await expect(
      listCharactersService('https://any-url.com'),
    ).rejects.toThrow();
  });

  test('returns heroes list when fetch succeeds', async () => {
    const [apiCharacter1, expectedCharacter1] = makeCharacter();
    const [apiCharacter2, expectedCharacter2] = makeCharacter(
      2,
      'another name',
      'http://another-path.com',
      'png',
    );

    global.fetch = mockValidFetchResponse([apiCharacter1, apiCharacter2]);

    const url = 'https://any-url.com';
    const result = await listCharactersService(url);
    expect(result.length).toEqual(2);

    expect(result[0]).toStrictEqual(expectedCharacter1);
    expect(result[1]).toStrictEqual(expectedCharacter2);
  });
});

const mockRejectedFetch = () => jest.fn().mockRejectedValueOnce('');

const mockInvalidFetchResponse = () =>
  jest.fn().mockImplementationOnce(() => {
    return new Promise((resolve, _) => {
      resolve({json: () => ({invalid: 'json'})});
    });
  });

const mockValidFetchResponse = (results: any[] = []) =>
  jest.fn().mockImplementationOnce(() => {
    return new Promise((resolve, _) => {
      resolve({json: () => ({data: {results}})});
    });
  });
