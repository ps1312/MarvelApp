global.fetch = jest.fn();

const listHeroesService = async (url: string) => {
  try {
    await fetch(url);
  } catch {
    throw new Error();
  }
};

describe('', () => {
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
});

export {};
