import { action, computed, observable } from 'mobx';

import { request } from 'graphql-request';

class Store {
  @action
  /**
   * Add a pokemon to bookmarks.
   * NOTE: Careful to pass a pokemon with its id minus 1.
   * This means that for bulbazaur, its id should be 1 - 1 = 0
   * (should be 0 instead of 1).
   * This because the PokeAPI mismatches true pokemons' ids.
   */
  public addBookmark(pokemon: PokemonLineEntry) {
    this.bookmarks.set(pokemon.id, pokemon);
    this.bookmarksChanged = true;

    this.selectedPokemon = {
      ...this.selectedPokemon,
      ...{ isBookmarked: this.isBookmarked(pokemon) }
    };

    localStorage.setItem(`${pokemon.id}`, JSON.stringify(pokemon));
  }

  @action
  public clearBookmarks() {
    this.bookmarks.clear();
    this.bookmarksChanged = true;

    localStorage.clear();
  }

  /**
 * Mutate Pokemon's dislikes' count.
 * @param pokemonId Pokemon's id from 1 to 949.
 */
  @action
  public async dislike(pokemonId: number) {
    const queryParams = `pokemonId: ${pokemonId}`;

    const mutation = `mutation {
      dislike( ${queryParams} ) {
        id
        name
        likes
        dislikes
      }
    }`;

    try {
      const data: DislikeResponse = await request(this.pokeStatssURL, mutation);
      this.controversy = data.dislike;

    } catch (error) {
      console.error(error);
    }
  }


  @action
  public async fetchAverageStats(typesEntries: TypeEntry[]) {
    const typesNames = typesEntries
      .map((entry) => {
        return entry.type.name.toUpperCase();
      });

    const queryParams = typesNames.length > 1 ?
      `type1: ${ typesNames[0] } type2: ${ typesNames[1] }` :
      `type1: ${ typesNames[0] }`;

    const query = `{
      averageStats(${ queryParams }) {
        avg {
          attack
          defense
          hp
          specialAttack
          specialDefense
          speed
        }
      }
    }`;

    try {
      const data: PokeStatsResponse = await request(this.pokeStatssURL, query);
      this.avgStats = data.averageStats.avg;

    } catch (error) {}
  }

  /**
   * This API uses Pokemons' id from 1 to 949.
   * @param pokemonId Pokemon's id from 1 to 949.
   */
  @action
  public async fetchControversy(pokemonId: number) {
    const queryParams = `pokemonId: ${pokemonId}`;

    const query = `query {
      controversy( ${queryParams} ) {
        id
        name
        likes
        dislikes
      }
    }`;

    try {
      const data: ControversyResponse = await request(this.pokeStatssURL, query);
      this.controversy = data.controversy;

    } catch (error) {
      console.error(error);
    }
  }

  @action
  public async fetchPokedex() {
    try {
      const rawData = await fetch(this.baseURL, { mode: 'cors' });
      const data: PokeAPIListData = await rawData.json();

      this.list = data.results
        .map((entry: any, index: number) => {
          return {
            id: index,
            isBookmarked: this.isBookmarked(index),
            name: entry.name,
            url: entry.url,
          }
        });

    } catch (error) {
      this.list = [];
      console.error(error);
    }
  }

  @action
  public async fetchPokemon(id: number) {
    const url = this.list.length > 0 ?
      this.list[id].url :
      `${this.baseURL}${id}`;

    try {
      const data = await fetch(url, { mode: 'cors' });
      const pokemon: Pokemon = await data.json();

      this.selectedPokemon = {
        ...pokemon,
        ...{ isBookmarked: this.isBookmarked(pokemon.id - 1) }
      };

    } catch (error) {
      console.error(error);
     }
  }

  @action
  public async fetchTweets(pokemonName: string) {
    const url = 'https://whale-irloxrdtbf.now.sh/';

    const query = `{
        tweets(pokemon: "${pokemonName}", count: 3) {
          statuses {
            created_at
            id_str
            text
            user {
              name
              profile_image_url
              screen_name
            }
          }
        }
      }`;

    try {
      const data: TweetServiceResponseData = await request(url, query);

      this.tweets = data.tweets.statuses;

    } catch (error) {
      console.error(error);
    }
  }

  @action
  public isBookmarked(pokemon: PokemonLineEntry | Pokemon | number): boolean {
    if (typeof pokemon === 'number') {
      return this.bookmarks.has(pokemon);
    }

    return this.bookmarks.has(pokemon.id);
  }

  /**
   * Mutate Pokemon's likes' count.
   * @param pokemonId Pokemon's id from 1 to 949.
   */
  @action
  public async like(pokemonId: number) {
    const queryParams = `pokemonId: ${pokemonId}`;

    const mutation = `mutation {
      like( ${queryParams} ) {
        id
        name
        likes
        dislikes
      }
    }`;

    try {
      const data: LikeResponse = await request(this.pokeStatssURL, mutation);
      this.controversy = data.like;

    } catch (error) {
      console.error(error);
    }
  }

  @action
  public loadBookmarks() {
    if (this.bookmarksLoaded) { return; }

    for (let i = 0, len = localStorage.length; i < len; i++) {
      const key = localStorage.key(i);
      if (!key) { continue; }

      const data = localStorage.getItem(key);
      if (!data) { return; }

      const pokemonLineEntry: PokemonLineEntry = JSON.parse(data);

      this.bookmarks.set(parseInt(key, 10), pokemonLineEntry);
    }

    this.bookmarksLoaded = true;
  }

  @action
  public removeBookmark(pokemon: PokemonLineEntry) {
    if (!this.bookmarks.has(pokemon.id)) {
      return;
    }

    this.bookmarks.delete(pokemon.id);
    this.bookmarksChanged = true;

    this.selectedPokemon = {
      ...this.selectedPokemon,
      ...{ isBookmarked: this.isBookmarked(pokemon) }
    };

    localStorage.removeItem(`${pokemon.id}`);
  }

  @action
  public setBookmarksPanelState(open: boolean) {
    this.isBookmarsPanelOpen = open;
  }

  @action
  /**
   * UI notifies back that it has been updated.
   */
  public setOffBookmarksChanged() {
    this.bookmarksChanged = false;
  }

  /**
   * Set partial pokemon data from clicked link.
   */
  public setPartialPokemon(pokemonLineEntry: PokemonLineEntry) {
    const { id, name } = pokemonLineEntry;
    this.selectedPokemon = { ...this.selectedPokemon, ...{ id, name }}
  }

  @action
  setSearchInput(newValue: string) {
    this.searchInput = newValue;
  }

  @computed public get filteredList(): PokemonLineEntry[] {
    const list = this.list.filter((pokemonLineEntry) => {
      return pokemonLineEntry.name.indexOf(this.searchInput) > -1;
    });

    const id = parseInt(this.searchInput, 10) - 1;

    if (isFinite(id) && id > -1 && id < this.list.length) {
      const idMatch = this.list[id];
      if (idMatch) { list.push(idMatch); }
    }

    return list;
  };

  @observable public avgStats: AvgStats = {
    attack        : 0,
    defense       : 0,
    hp            : 0,
    specialAttack : 0,
    specialDefense: 0,
    speed         : 0,
  };

  /**
   * 'https://pokeapi.co/api/v2/pokemon/'
   */
  public baseURL: string = 'https://pokeapi.co/api/v2/pokemon/';

  private pokeStatssURL: string = 'https://pokestats-bceyweotwd.now.sh/';

  @observable public bookmarks = new Map<number, PokemonLineEntry>([]);

  /**
   * Need this to notify List row component
   * because it can't observe & doesn't trigger on non-visual prop changed.
   */
  @observable public bookmarksChanged: boolean = false;

  private bookmarksLoaded: boolean = false;

  @observable controversy: Controversy = {
    id        : -1,
    likes     : 0,
    name      : '',
    dislikes  : 0,
  };

  @observable public focusedPokemon?: PokemonLineEntry;

  @observable public isBookmarsPanelOpen: boolean = false;

  @observable public list: PokemonLineEntry[] = [];

  @observable public searchInput: string = '';

  @observable public selectedPokemon: Pokemon = {
    abilities: [],
    id          : -1,
    isBookmarked: false,
    name        : '',
    sprites: {
      back_default      : '',
      back_female       : '',
      back_shiny        : '',
      back_shiny_female : '',
      front_default     : '',
      front_female      : '',
      front_shiny       : '',
      front_shiny_female: '',
    },
    stats: [],
    types: [
      {
        slot: 0,
        type: { name: '', url: '' }
      }
    ],
    weight: 0,
  };

  @observable public tweets: Tweet[] = [];
}

export const store = new Store();
