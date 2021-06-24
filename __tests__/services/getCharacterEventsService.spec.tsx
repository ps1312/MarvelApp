import {makeEvent} from '../../__utils__/test-helpers';
import getCharacterEventsService from '../../src/services/getCharactersEvents';

describe('getCharacterEventsService()', () => {
  test('make request to character series', async () => {
    global.fetch = mockValidFetchResponse();

    const url = 'https://any-url.com';
    await getCharacterEventsService(url);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(url);
  });

  test('throws error when fetch fails', async () => {
    global.fetch = mockRejectedFetch();

    const url = 'https://any-url.com';
    await expect(getCharacterEventsService(url)).rejects.toThrow();
  });

  test('throws error when fetch returns invalid data', async () => {
    global.fetch = mockInvalidFetchResponse();

    const url = 'https://any-url.com';
    await expect(getCharacterEventsService(url)).rejects.toThrow();
  });

  test('returns empty series when fetch succeeds with no data', async () => {
    global.fetch = mockValidFetchResponse();

    const url = 'https://any-url.com';
    const series = await getCharacterEventsService(url);
    expect(series.length).toEqual(0);
  });

  test('throws error when fetch returns invalid series', async () => {
    const serie1 = {};
    global.fetch = mockValidFetchResponse([serie1]);
    await expect(
      getCharacterEventsService('https://any-url.com'),
    ).rejects.toThrow();

    const serie2 = {id: 123};
    global.fetch = mockValidFetchResponse([serie2]);
    await expect(
      getCharacterEventsService('https://any-url.com'),
    ).rejects.toThrow();

    const serie3 = {name: 'name'};
    global.fetch = mockValidFetchResponse([serie3]);
    await expect(
      getCharacterEventsService('https://any-url.com'),
    ).rejects.toThrow();
  });

  test('returns series list when fetch succeeds', async () => {
    const [apiSerie1, expectedSerie1] = makeEvent();
    const [apiSerie2, expectedSerie2] = makeEvent(
      2,
      'another title',
      'description',
      '233',
      '244',
    );

    global.fetch = mockValidFetchResponse([apiSerie1, apiSerie2]);

    const url = 'https://any-url.com';
    const series = await getCharacterEventsService(url);
    expect(series.length).toEqual(2);

    expect(series[0]).toStrictEqual(expectedSerie1);
    expect(series[1]).toStrictEqual(expectedSerie2);
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

export {};
