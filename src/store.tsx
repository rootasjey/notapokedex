
import { ApolloClient }   from 'apollo-client';
import gql                from 'graphql-tag';
import { InMemoryCache }  from 'apollo-cache-inmemory';
import { request }        from 'graphql-request';
import { WebSocketLink }  from 'apollo-link-ws';

import {
  action,
  computed,
  observable,
} from 'mobx';

class Store {
  // ........
  // ACTIONS
  // ........

  @action
  public addBookmark(pokemon: MinimalPokemon) {
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
      const data: DislikeResponse = await request(this.pokestatsURL, mutation);
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
      const data: PokestatsResponse = await request(this.pokestatsURL, query);
      this.avgStats = data.averageStats.avg;

    } catch (error) {
      console.error(error);
    }
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
      const data: ControversyResponse = await request(this.pokestatsURL, query);
      this.controversy = data.controversy;

    } catch (error) {
      console.error(error);
    }
  }

  @action
  public async fetchPokedex() {
    const query = `query {
      list {
        results {
          id
          name
          url
          sprites {
            defaultFront
          }
        }
      }
    }`;

    try {

      const response: ListResponse = await request(this.pokestatsURL, query);

      this.list = response.list.results
        .map((pokemon, index) => {
          return { ...pokemon, ...{
            isBookmarked: this.isBookmarked(index)
          }};
        });

    } catch (error) {
      this.list = [];
      console.error(error);
    }
  }

  @action
  public async fetchPokemon(id: number) {

    const query = `query {
      pokemonById(id: ${id}) {
        abilities {
          ability {
            name
          }
        }
        id
        name
        sprites {
          femaleBack
          femaleFront
          femaleShinyBack
          femaleShinyFront
          defaultBack
          defaultFront
          defaultShinyBack
          defaultShinyFront
        }
        stats {
          baseStat
          stat {
            name
          }
        }
        types {
          type {
            name
          }
        }
      }
    }`;

    try {
      const data: PokemonByIdResponse = await request(this.pokestatsURL, query);

      const pokemon = data.pokemonById[0];

      this.selectedPokemon = {
        ...pokemon,
        ...{ isBookmarked: this.isBookmarked(pokemon.id) }
      };

    } catch (error) {
      console.error(error);
     }
  }

  @action
  public async fetchTweets(pokemonName: string) {
    const url = 'https://whale-mkndctduwg.now.sh/';

    const query = `{
        tweets(word: "${pokemonName}", count: 3) {
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
  public isBookmarked(pokemon: MinimalPokemon | Pokemon | number): boolean {
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
      const data: LikeResponse = await request(this.pokestatsURL, mutation);
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

      const pokemonLineEntry: MinimalPokemon = JSON.parse(data);

      this.bookmarks.set(parseInt(key, 10), pokemonLineEntry);
    }

    this.bookmarksLoaded = true;
  }

  @action
  public removeBookmark(pokemon: MinimalPokemon) {
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
  public setPartialPokemon(pokemonLineEntry: MinimalPokemon) {
    const { id, name } = pokemonLineEntry;
    this.selectedPokemon = { ...this.selectedPokemon, ...{ id, name }}
  }

  @action
  public setSearchInput(newValue: string) {
    this.searchInput = newValue;
  }

  @action
  public startTweetStream(word: string) {
    const GRAPHQL_ENDPOINT = 'wss://whale-mkndctduwg.now.sh/graphql';
    // const GRAPHQL_ENDPOINT = 'ws://localhost:4000/graphql';

    const wsLink = new WebSocketLink({
      uri: GRAPHQL_ENDPOINT,
      options: {
        connectionParams: { "word": word },
        inactivityTimeout: 5000,
        reconnect: true,
        reconnectionAttempts: 3,
      }
    });

    const client = new ApolloClient({
      cache: new InMemoryCache(),
      link: wsLink,
    });

    this.tweetsObserver = client
      .subscribe({
        query: gql`
          subscription {
            tweetAdded(word: "${word}") {
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
        `,
      })
      .subscribe(
        (response: TweetSubscriptionResponse) => {
          const { tweetAdded } = response.data;
          this.tweets = [tweetAdded].concat(this.tweets).slice(0, 3);
        },
        (error) => { console.error(error); },
      )
  }

  @action
  public stopTweetStream() {
    if (!this.tweetsObserver) { return; }

    this.tweetsObserver.unsubscribe();
  }


  // ........
  // COMPUTED
  // ........

  @computed public get filteredList(): MinimalPokemon[] {
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

  // ........
  // OBSERVABLE
  // ........

  @observable public avgStats: AvgStats = {
    attack        : 0,
    defense       : 0,
    hp            : 0,
    specialAttack : 0,
    specialDefense: 0,
    speed         : 0,
  };

  @observable public bookmarks = new Map<number, MinimalPokemon>([]);

  /**
   * Need this to notify List row component
   * because it can't observe & doesn't trigger on non-visual prop changed.
   */
  @observable public bookmarksChanged: boolean = false;

  @observable public controversy: Controversy = {
    id        : -1,
    likes     : 0,
    name      : '',
    dislikes  : 0,
  };

  @observable public focusedPokemon?: MinimalPokemon;

  @observable public isBookmarsPanelOpen: boolean = false;

  @observable public list: MinimalPokemon[] = [];

  @observable public searchInput: string = '';

  @observable public selectedPokemon: Pokemon = {
    abilities: [],
    id          : -1,
    isBookmarked: false,
    name        : '',
    sprites: {
      defaultBack      : '',
      femaleBack       : '',
      defaultShinyBack        : '',
      femaleShinyBack : '',
      defaultFront     : '',
      femaleFront      : '',
      defaultShinyFront       : '',
      femaleShinyFront: '',
    },
    stats: [],
    types: [
      {
        slot: 0,
        type: { name: '', url: '' }
      }
    ],
  };

  @observable public tweets: Tweet[] = [];

  // ........
  // PROPERTIES
  // ........

  /**
   * 'https://pokeapi.co/api/v2/pokemon/'
   */
  public baseURL: string = 'https://pokeapi.co/api/v2/pokemon/';

  public bookmarksLoaded: boolean = false;

  private pokestatsURL: string = 'https://pokestats-gmtiqydwwa.now.sh/';

  private tweetsObserver?: ZenObservable.Subscription;

}

export const store = new Store();
