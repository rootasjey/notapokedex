interface AbilityEntry {
  ability: Ability;
  is_hidden: boolean;
  slot: number;
}

interface Ability {
  name: string;
  url: string;
}

interface LikeResponse {
  like: Controversy;
}

interface DislikeResponse {
  dislike: Controversy;
}

interface ControversyResponse {
  controversy: Controversy;
}

interface Controversy {
  dislikes: number;
  id: number;
  likes: number;
  name: string;
}

interface Pokemon {
  abilities: AbilityEntry[];
  id: number;
  isBookmarked: boolean;
  name: string;
  sprites: Sprites;
  stats: StatEntry[];
  types: TypeEntry[];
  weight: number;
}

interface PokemonLineEntry {
  id: number;
  isBookmarked: boolean;
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

interface PokeStatsResponse {
  averageStats: PokeStatsResponseData;
}

interface PokeStatsResponseData {
  avg: AvgStats;
  meta: AvgStatsMeta;

  pokemonCount: number;

  types: string[];
}

interface AvgStatsMeta {
  lastUpdated: string;
}

interface AvgStats {
  [key: string]: number;

  attack: number;
  defense: number;
  hp: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
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

interface Tweet {
  created_at: string;
  id_str: string;
  text: string;
  user: TweetUser;
}

interface TweetServiceResponseData {
  tweets: TweetServiceResponseStatuses;
}

interface TweetServiceResponseStatuses {
  statuses: Tweet[];
}

interface TweetUser {
  name: string;
  profile_image_url: string;
  screen_name: string;
}

interface Type {
  name: string;
  url: string;
}

interface TypeEntry {
  slot: number;
  type: Type;
}
