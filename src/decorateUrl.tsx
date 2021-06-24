import md5 from 'md5';
import {PUBLIC_KEY, PRIVATE_KEY} from '@env';

export default (url: string) => {
  const timestamp = Date.now();

  const hash = md5(timestamp + PRIVATE_KEY + PUBLIC_KEY);

  let queryParams = `?&ts=${timestamp}&apikey=${PUBLIC_KEY}&hash=${hash}`;
  return url + queryParams;
};
