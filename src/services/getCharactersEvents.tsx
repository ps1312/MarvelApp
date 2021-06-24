import {CharacterThumbnail} from './listCharactersService';

export default async (url: string): Promise<Event[]> => {
  try {
    const seriesResult = await fetch(url);
    const json = await seriesResult.json();
    const series = json.data.results.map((item: any) => {
      if (!isApiEvent(item)) {
        throw new Error();
      }

      const imagePath = `${item.thumbnail.path}/portrait_xlarge.${item.thumbnail.extension}`;

      return {
        id: item.id,
        title: item.title,
        description: item.description,
        start: item.start,
        end: item.end,
        thumbUrl: imagePath,
      };
    });

    return series;
  } catch (e) {
    throw new Error();
  }
};

function isApiEvent(item: any): item is ApiEvent {
  return (
    (item as ApiEvent).id !== undefined &&
    (item as ApiEvent).title !== undefined &&
    (item as ApiEvent).thumbnail !== undefined
  );
}

export type ApiEvent = {
  id: number;
  title: string;
  description?: string;
  start: string;
  end: string;
  thumbnail: CharacterThumbnail;
};

export type Event = {
  id: number;
  title: string;
  description?: string;
  start: string;
  end: string;
  thumbUrl: string;
};
