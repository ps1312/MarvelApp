global.fetch = jest.fn();

const listHeroesService = (url: string) => {
  fetch(url);
};

describe('', () => {
  test('make request with provided url', () => {
    const url = 'https://any-url.com';
    listHeroesService(url);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenLastCalledWith(url);
  });
});

export {};
