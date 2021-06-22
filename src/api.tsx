const listHeroesService = async (url: string): Promise<Hero[]> => {
  try {
    const result = await fetch(url);
    const json = await result.json();
    return json.data.results.map((item: any) => {
      if (!isHero(item)) {
        throw new Error();
      }

      return {id: item.id, name: item.name};
    });
  } catch (error) {
    throw new Error();
  }
};

function isHero(item: any): item is Hero {
  return (item as Hero).id !== undefined;
}

export type Hero = {
  id: number;
  name: string;
};

export default listHeroesService;
