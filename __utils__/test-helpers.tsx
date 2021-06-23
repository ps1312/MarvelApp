import {ApiCharacter, Character} from '../src/api';

const makeCharacter = (
  id: number = 1,
  name: string = 'name',
  path: string = 'any-path.com',
  extension: string = 'jpg',
): [ApiCharacter, Character] => {
  const apiCharacter: ApiCharacter = {
    id,
    name,
    thumbnail: {path, extension},
  };
  const expectedCharacter: Character = {
    id,
    name,
    thumbUrl: `${path}/portrait_small.${extension}`,
  };

  return [apiCharacter, expectedCharacter];
};
export {makeCharacter};
