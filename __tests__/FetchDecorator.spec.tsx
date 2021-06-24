import md5 from 'md5';

const md5MockedValue = 'hashed';
jest.mock('md5', () => jest.fn().mockReturnValue(md5MockedValue));

const PRIVATE_KEY = '7ec5298d4994c38856f9e1427e9fd8ccd1555137';
const PUBLIC_KEY = 'd38c3e71397286b3b21d3ea99160fb8b';

const decorateUrl = (url: string) => {
  const timestamp = Date.now();

  md5(timestamp + PRIVATE_KEY + PUBLIC_KEY);

  const decoratedUrl = url + 'ts';
  return decoratedUrl;
};

describe('decorateUrl()', () => {
  test('calls md5 when decorating url with correct values', async () => {
    const timestamp = 1111111111111;
    jest.spyOn(Date, 'now').mockReturnValue(timestamp);

    decorateUrl('http://any-url.com');

    expect(md5).toHaveBeenCalledTimes(1);
    expect(md5).toHaveBeenCalledWith(timestamp + PRIVATE_KEY + PUBLIC_KEY);
  });
});

export {};
