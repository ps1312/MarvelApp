type Hero = {
  id: number;
  name: string;
};

const listHeroesService = async (url: string): Promise<Hero[]> => {
  try {
    const result = await fetch(url);
    const json = await result.json();
    return json.data.results.map((item: any) => {
      if (!isHero(item)) {
        throw new Error();
      }

      return {id: item.id, name: item.name};
    });
  } catch (error) {
    throw new Error();
  }
};

function isHero(item: any): item is Hero {
  return (item as Hero).id !== undefined;
}

describe('listHeroesService()', () => {
  test('make request with provided url', () => {
    global.fetch = mockRejectedFetch();

    const url = 'https://any-url.com';
    listHeroesService(url);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenLastCalledWith(url);
  });

  test('throws error when fetch fails', async () => {
    global.fetch = mockRejectedFetch();

    const url = 'https://any-url.com';
    await expect(listHeroesService(url)).rejects.toThrow();
  });

  test('throws error when fetch returns invalid data', async () => {
    global.fetch = mockInvalidFetchResponse();

    const url = 'https://any-url.com';
    await expect(listHeroesService(url)).rejects.toThrow();
  });

  test('returns empty heroes list when fetch succeeds with no heroes', async () => {
    global.fetch = mockValidFetchResponse();

    const url = 'https://any-url.com';
    const result = await listHeroesService(url);
    expect(result.length).toEqual(0);
  });

  test('throws error when fetch returns invalid heroes', async () => {
    const hero1 = {invalid: 'hero'};

    global.fetch = mockValidFetchResponse([hero1]);

    await expect(listHeroesService('https://any-url.com')).rejects.toThrow();
  });

  test('returns heroes list when fetch succeeds', async () => {
    const hero1: Hero = {id: 1, name: 'any name'};
    const hero2: Hero = {id: 2, name: 'another name'};

    global.fetch = mockValidFetchResponse([hero1, hero2]);

    const url = 'https://any-url.com';
    const result = await listHeroesService(url);
    expect(result.length).toEqual(2);
    expect(result[0]).toStrictEqual(hero1);
    expect(result[1]).toStrictEqual(hero2);
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
