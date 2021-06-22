const listCharactersService = async (url: string): Promise<Character[]> => {
  try {
    const result = await fetch(url);
    const json = await result.json();
    return json.data.results.map((item: any) => {
      if (!isCharacter(item)) {
        throw new Error();
      }

      return {id: item.id, name: item.name};
    });
  } catch (error) {
    throw new Error();
  }
};

function isCharacter(item: any): item is Character {
  return (
    (item as Character).id !== undefined &&
    (item as Character).name !== undefined
  );
}

export type Character = {
  id: number;
  name: string;
};

export default listCharactersService;
