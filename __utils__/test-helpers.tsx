import {ApiEvent, CharacterEvent} from '../src/services/getCharactersEvents';
import {ApiSerie, Serie} from '../src/services/getCharactersSeries';
import {ApiCharacter, Character} from '../src/services/listCharactersService';

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
    thumbUrl: `${path}/portrait_xlarge.${extension}`,
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

const makeEvent = (
  id: number = 1,
  title: string = 'any title',
  description?: string,
  start: string = 'any date',
  end: string = 'any date',
  path: string = 'any-path.com',
  extension: string = 'jpg',
): [ApiEvent, CharacterEvent] => {
  const apiEvent: ApiEvent = {
    id,
    title,
    description,
    start,
    end,
    thumbnail: {path, extension},
  };
  const expectedEvent: CharacterEvent = {
    id,
    title,
    description,
    start,
    end,
    thumbUrl: `${path}/portrait_xlarge.${extension}`,
  };

  return [apiEvent, expectedEvent];
};

export {makeCharacter, makeSerie, makeEvent};
