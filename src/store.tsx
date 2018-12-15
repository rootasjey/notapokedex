import { observable, computed, action, runInAction } from 'mobx';

class Store {
  @observable public list: PokemonLineEntry[] = [];

  @observable public focusedItem?: PokemonLineEntry;
  @observable public searchInput: string = '';
  @observable public selectedItem: Pokemon = {
    abilities: [],
    id: -1,
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

  @action
  public async fetchPokedex() {
    try {
      const rawData = await fetch('https://pokeapi.co/api/v2/pokemon/', { mode: 'cors' });
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
      `https://pokeapi.co/api/v2/pokemon/${id}`;

    try {
      const rawData = await fetch(url, { mode: 'cors' });
      const data = await rawData.json();

      this.selectedItem = data;
      console.log(data);

    } catch (error) { }
  }

  @computed public get filteredList(): PokemonLineEntry[] {
    return this.list.filter((pokemonLineEntry) => {
      return pokemonLineEntry.name.indexOf(this.searchInput) > -1;
    });
  };

  @action
  setSearchInput(newValue: string) {
    this.searchInput = newValue;
  }
}

export const store = new Store();
