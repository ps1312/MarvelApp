import md5 from 'md5';
import {PUBLIC_KEY, PRIVATE_KEY} from '@env';
import decorateUrl from '../src/decorateUrl';

const md5MockedValue = 'hashed';
jest.mock('md5', () => jest.fn().mockReturnValue(md5MockedValue));

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
