import { observer }                     from "mobx-react";
import React, { Component }             from 'react';
import { store }                        from '../../store';
import styled                           from "styled-components";

import { Abilities }                    from './Abilities';
import { Caroussel }                    from './Caroussel';
import { Stats }                        from './Stats';
import { Types }                        from './Types';

@observer
export default class PokeCard extends Component<ICardProps, {}> {
  constructor(props: ICardProps) {
    super(props);
  }

  public componentDidMount() {
    store.fetchPokemon(this.props.id);
  }

  render() {
    const pokemon = store.selectedItem;

    return(
      <StyledContainer>
        <StyledPageSubTitle>#{ pokemon.id }</StyledPageSubTitle>

        <Caroussel
          pokemonName={pokemon.name}
          sprites={pokemon.sprites}
        />

        <Types types={pokemon.types} />

        <Stats stats={pokemon.stats} />

        <Abilities abilities={pokemon.abilities} />
      </StyledContainer>
    )
  }
}

const StyledContainer = styled.div`
  padding-top: 60px;
`;

const StyledPageTitle = styled.h1`
  text-align: center;
`;

const StyledPageSubTitle = styled.h1`
  text-align: center;
  font-size: 2em;
`;

export interface ICardProps {
  id: number;
}

