import md5 from 'md5';
import {PUBLIC_KEY, PRIVATE_KEY} from '@env';

const md5MockedValue = 'hashed';
jest.mock('md5', () => jest.fn().mockReturnValue(md5MockedValue));

const decorateUrl = (url: string) => {
  const timestamp = Date.now();

  const hash = md5(timestamp + PRIVATE_KEY + PUBLIC_KEY);

  const decoratedUrl = url + 'ts';
  let queryParams = `?&ts=${timestamp}&apikey=${PUBLIC_KEY}&hash=${hash}`;
  return decoratedUrl + queryParams;
};

describe('decorateUrl()', () => {
  test('calls md5 when decorating url with correct values', async () => {
    const timestamp = 1111111111111;
    jest.spyOn(Date, 'now').mockReturnValue(timestamp);

    decorateUrl('http://any-url.com');

    expect(md5).toHaveBeenCalledTimes(1);
    expect(md5).toHaveBeenCalledWith(timestamp + PRIVATE_KEY + PUBLIC_KEY);
  });

  test('append timestamp, public key and hash to url as query params', () => {
    const timestamp = 1111111111111;
    jest.spyOn(Date, 'now').mockReturnValue(timestamp);
    const newUrl = decorateUrl('http://any-url.com');

    expect(newUrl.includes(`ts=${timestamp}`)).toBeTruthy();
    expect(newUrl.includes(`apikey=${PUBLIC_KEY}`)).toBeTruthy();
    expect(newUrl.includes(`hash=${md5MockedValue}`)).toBeTruthy();
  });
});

export {};
