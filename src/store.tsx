import { action, computed, observable } from 'mobx';

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

    this.selectedItem = {
      ...this.selectedItem,
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

  @action
  public async fetchPokedex() {
    try {
      const rawData = await fetch(this.baseURL, { mode: 'cors' });
      const data: PokeAPIListData = await rawData.json();

      this.list = data.results
        .map((entry: any, index: number) => {
          return {
            id: index,
            name: entry.name,
            url: entry.url,
          }
        });

    } catch (error) {
      this.list = [];
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

      this.selectedItem = {
        ...pokemon,
        ...{ isBookmarked: this.isBookmarked(pokemon.id - 1) }
      };

      // console.log(pokemon);

    } catch (error) { }
  }

  @action
  public isBookmarked(pokemon: PokemonLineEntry | Pokemon | number): boolean {
    if (typeof pokemon === 'number') {
      return this.bookmarks.has(pokemon);
    }

    return this.bookmarks.has(pokemon.id);
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

    this.selectedItem = {
      ...this.selectedItem,
      ...{ isBookmarked: this.isBookmarked(pokemon) }
    };

    localStorage.removeItem(`${pokemon.id}`);
  }

  @action
  /**
   * UI notifies back that it has been updated.
   */
  public setOffBookmarksChanged() {
    this.bookmarksChanged = false;
  }

  @action
  setSearchInput(newValue: string) {
    this.searchInput = newValue;
  }

  @computed public get filteredList(): PokemonLineEntry[] {
    return this.list.filter((pokemonLineEntry) => {
      return pokemonLineEntry.name.indexOf(this.searchInput) > -1;
    });
  };

  /**
   * 'https://pokeapi.co/api/v2/pokemon/'
   */
  public baseURL: string = 'https://pokeapi.co/api/v2/pokemon/';

  @observable public bookmarks = new Map<number, PokemonLineEntry>([]);

  /**
   * Need this to notify Fabric row component
   * because it can't observe & doesn't trigger on non-visual prop changed.
   */
  @observable public bookmarksChanged: boolean = false;

  private bookmarksLoaded: boolean = false;

  @observable public focusedItem?: PokemonLineEntry;
  @observable public list: PokemonLineEntry[] = [];
  @observable public searchInput: string = '';
  @observable public selectedItem: Pokemon = {
    abilities: [],
    id: -1,
    isBookmarked: false,
    name: '',
    sprites: {
      back_default: '',
      back_female: '',
      back_shiny: '',
      back_shiny_female: '',
      front_default: '',
      front_female: '',
      front_shiny: '',
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
}

export const store = new Store();
