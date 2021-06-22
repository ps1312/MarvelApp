global.fetch = jest.fn();

type Hero = {};

const listHeroesService = async (url: string): Promise<Hero[]> => {
  try {
    const result = await fetch(url);
    const json = await result.json();
    return json.data.results.map(() => ({}));
  } catch (error) {
    throw new Error();
  }
};

describe('listHeroesService()', () => {
  test('make request with provided url', () => {
    const url = 'https://any-url.com';
    listHeroesService(url);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenLastCalledWith(url);
  });

  test('throws error when fetch fails', async () => {
    global.fetch = jest.fn().mockRejectedValueOnce('');

    const url = 'https://any-url.com';
    await expect(listHeroesService(url)).rejects.toThrow();
  });

  test('throws error when fetch returns invalid data', async () => {
    global.fetch = jest.fn().mockImplementationOnce(() => {
      return new Promise((resolve, _) => {
        resolve({json: () => ({invalid: 'json'})});
      });
    });

    const url = 'https://any-url.com';
    await expect(listHeroesService(url)).rejects.toThrow();
  });

  test('returns empty heroes list when fetch succeeds with no heroes', async () => {
    global.fetch = jest.fn().mockImplementationOnce(() => {
      return new Promise((resolve, _) => {
        resolve({json: () => ({data: {results: []}})});
      });
    });

    const url = 'https://any-url.com';
    const result = await listHeroesService(url);
    expect(result.length).toEqual(0);
  });
});

export {};
