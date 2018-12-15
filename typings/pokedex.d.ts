interface AbilityEntry {
  ability: Ability;
  is_hidden: boolean;
  slot: number;
}

interface Ability {
  name: string;
  url: string;
}

interface Pokemon {
  abilities: AbilityEntry[];
  id: number;
  name: string;
  sprites: Sprites;
  stats: StatEntry[];
  types: TypeEntry[];
  weight: number;
}


interface PokemonLineEntry {
  id: number;
  name: string;
  url: string;
}

interface PokeAPIListData {
  count: number;
  next?: number;
  previous?: number;
  results: PokeAPISimplePoke[];
}

interface PokeAPISimplePoke {
  name: string;
  url: string;
}

interface Sprites {
  back_default: string;
  back_female: string;
  back_shiny: string;
  back_shiny_female: string;
  front_default: string;
  front_female: string;
  front_shiny: string;
  front_shiny_female: string;
}

interface Stat {
  name: string;
  url: string;
}

interface StatEntry {
  base_stat: number;
  effort: number;
  stat: Stat;
}

interface Type {
  name: string;
  url: string;
}

interface TypeEntry {
  slot: number;
  type: Type;
}
