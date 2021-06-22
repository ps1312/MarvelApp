import md5 from 'md5';

jest.mock('md5', () => jest.fn());

const listHeroesService = (credential: string) => {
  md5(credential);
};

describe('', () => {
  test('calls to md5 hash with provided credential', () => {
    const anyCredential = 'any';
    listHeroesService(anyCredential);

    expect(md5).toHaveBeenCalledTimes(1);
    expect(md5).toHaveBeenLastCalledWith(anyCredential);
  });
});
