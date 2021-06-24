import {ApiCharacter, ApiSerie, Character, Serie} from '../src/api';

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

const makeSerie = (
  id: number = 1,
  title: string = 'any title',
  description?: string,
  startYear: number = 1,
  endYear: number = 1,
  path: string = 'any-path.com',
  extension: string = 'jpg',
): [ApiSerie, Serie] => {
  const apiSerie: ApiSerie = {
    id,
    title,
    description,
    startYear,
    endYear,
    thumbnail: {path, extension},
  };
  const expectedSerie: Serie = {
    id,
    title,
    description,
    startYear,
    endYear,
    thumbUrl: `${path}/portrait_xlarge.${extension}`,
  };

  return [apiSerie, expectedSerie];
};

export {makeCharacter, makeSerie};
