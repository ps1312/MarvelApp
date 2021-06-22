global.fetch = jest.fn();

const listHeroesService = async (url: string) => {
  try {
    await fetch(url);
    throw new Error();
  } catch {
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
    global.fetch = jest.fn().mockResolvedValueOnce('');

    const url = 'https://any-url.com';
    await expect(listHeroesService(url)).rejects.toThrow();
  });
});

export {};
