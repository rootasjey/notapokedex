import { observer }           from "mobx-react";
import React, { Component }   from 'react';
import { store }              from '../../store';
import styled                 from "styled-components";

import Abilities              from './Abilities';
import Caroussel              from './Caroussel';
import Stats                  from './Stats';
import Types                  from './Types';
import { Typography }         from "@material-ui/core";

@observer
export default class PokeCard extends Component<ICardProps, {}> {
  public componentDidMount() {
    store.fetchPokemon(this.props.id);
  }

  render() {
    const pokemon = store.selectedPokemon;

    return(
      <StyledContainer>
        <Typography variant="h3" >
          #{pokemon.id}
        </Typography>

        <Caroussel />

        <Types types={pokemon.types} />

        <Stats stats={pokemon.stats} />

        <Abilities abilities={pokemon.abilities} />
      </StyledContainer>
    )
  }
}

const StyledContainer = styled.div`
  padding-top: 60px;
  text-align: center;
`;

export interface ICardProps {
  id: number;
}
