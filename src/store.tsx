import { observable, computed, action } from 'mobx';

class Store {
  @observable public list: PokemonLineEntry[] = [];

  @observable public focusedItem?: PokemonLineEntry;
  @observable public searchInput: string = '';
  @observable public selectedItem?: PokemonLineEntry;

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
