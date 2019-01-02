interface Ability {
  name: string;
  url: string;
}
interface AbilityEntry {
  ability: Ability;
  is_hidden: boolean;
  slot: number;
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

interface AvgStatsMeta {
  lastUpdated: string;
}

interface Controversy {
  dislikes: number;
  id: number;
  likes: number;
  name: string;
}

interface ControversyResponse {
  controversy: Controversy;
}

interface DislikeResponse {
  dislike: Controversy;
}

interface LikeResponse {
  like: Controversy;
}

interface ListResponse {
  list: PokestatsList;
}

interface MinimalPokemon {
  id: number;
  isBookmarked: boolean;
  name: string;
  sprites: PokestatsSprites;
  url: string;
}

interface Pokemon {
  abilities: AbilityEntry[];
  id: number;
  isBookmarked: boolean;
  name: string;
  sprites: Sprites;
  stats: StatEntry[];
  types: TypeEntry[];
}

interface PokemonByIdResponse {
  pokemonById: Pokemon[];
}

interface PokestatsList {
  results: MinimalPokemon[];
}

interface PokestatsSprites {
  defaultFront: string;
}

interface PokestatsResponse {
  averageStats: PokestatsResponseData;
}

interface PokestatsResponseData {
  avg: AvgStats;
  meta: AvgStatsMeta;

  pokemonCount: number;

  types: string[];
}

interface Sprites {
  [key: string]: string;
  femaleBack: string;
  femaleFront: string;
  femaleShinyBack: string;
  femaleShinyFront: string;
  defaultBack: string;
  defaultFront: string;
  defaultShinyBack: string;
  defaultShinyFront: string;
}

interface Stat {
  name: string;
  url: string;
}

interface StatEntry {
  baseStat: number;
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

interface TweetSubscriptionData {
  tweetAdded: Tweet;
}

interface TweetSubscriptionResponse {
  data: TweetSubscriptionData;
}

interface TweetUser {
  name: string;
  profile_image_url: string;
  screen_name: string;
}
