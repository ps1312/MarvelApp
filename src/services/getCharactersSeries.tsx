import {CharacterThumbnail} from './listCharactersService';

export default async (url: string): Promise<Serie[]> => {
  try {
    const seriesResult = await fetch(url + '/series');
    const json = await seriesResult.json();
    const series = json.data.results.map((item: any) => {
      if (!isApiSerie(item)) {
        throw new Error();
      }

      const imagePath = `${item.thumbnail.path}/portrait_xlarge.${item.thumbnail.extension}`;

      return {
        id: item.id,
        title: item.title,
        description: item.description,
        startYear: item.startYear,
        endYear: item.endYear,
        thumbUrl: imagePath,
      };
    });

    return series;
  } catch {
    throw new Error();
  }
};

function isApiSerie(item: any): item is ApiSerie {
  return (
    (item as ApiSerie).id !== undefined &&
    (item as ApiSerie).title !== undefined &&
    (item as ApiSerie).thumbnail !== undefined
  );
}

export type ApiSerie = {
  id: number;
  title: string;
  description?: string;
  startYear: number;
  endYear: number;
  thumbnail: CharacterThumbnail;
};

export type Serie = {
  id: number;
  title: string;
  description?: string;
  startYear: number;
  endYear: number;
  thumbUrl: string;
};
