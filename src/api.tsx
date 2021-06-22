const listCharactersService = async (url: string): Promise<Character[]> => {
  try {
    const result = await fetch(url);
    const json = await result.json();
    return json.data.results.map((item: any) => {
      if (!isApiCharacter(item)) {
        throw new Error();
      }

      const imagePath = `${item.thumbnail.path}/portrait_small.${item.thumbnail.extension}`;
      return {id: item.id, name: item.name, thumbUrl: imagePath};
    });
  } catch (error) {
    throw new Error();
  }
};

function isApiCharacter(item: any): item is ApiCharacter {
  return (
    (item as ApiCharacter).id !== undefined &&
    (item as ApiCharacter).name !== undefined &&
    (item as ApiCharacter).thumbnail !== undefined
  );
}

export type CharacterThumbnail = {
  path: string;
  extension: string;
};

export type ApiCharacter = {
  id: number;
  name: string;
  thumbnail: CharacterThumbnail;
};

export type Character = {
  id: number;
  name: string;
  thumbUrl: string;
};

export default listCharactersService;
