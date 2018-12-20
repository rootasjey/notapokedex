import { faArrowAltCircleLeft }       from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon }            from '@fortawesome/react-fontawesome';
import { library }                    from '@fortawesome/fontawesome-svg-core';

import { observer }                   from 'mobx-react';
import React, { Component }           from 'react';
import { store }                      from '../../store';

import styled                         from 'styled-components';

import { Layer }                      from 'office-ui-fabric-react/lib/Layer';

import PokeCard                       from './PokeCard';
import Tweets                         from './Tweets';

library.add(faArrowAltCircleLeft);

@observer
export default class Details extends Component {
  constructor(props: any) {
    super(props);

    // Auto-redirect if pokedex is empty
    if (store.list.length === 0) {
      this.goBack();
    }
  }

  private goBack() {
    const props: any = this.props;
    props.history.push('/');
  }

  private toggleBookmark(pokemon: Pokemon) {
    const pokeLineEntry: PokemonLineEntry = {
      id    : pokemon.id - 1,
      name  : pokemon.name,
      url   : `${store.baseURL}${pokemon.id}`,
    }

    store.isBookmarked(pokeLineEntry) ?
      store.removeBookmark(pokeLineEntry) :
      store.addBookmark(pokeLineEntry)
  }

  render() {
    const props: any  = this.props;
    const id          = props.match.params.id;
    const pokemon     = store.selectedPokemon;
    const poke        = {...pokemon, ...{id: pokemon.id - 1}};

    return (
      <StyledCenteredDiv>
        <StyledLayer>
          <div onClick={ () => this.goBack() }>
            <StyledFontAwesomeIconRotate icon="arrow-alt-circle-left" size="2x" />
          </div>

          <StyledTitle>{ store.selectedPokemon.name }</StyledTitle>

          <div onClick={() => { this.toggleBookmark(pokemon); }}>
            <StyledFontAwesomeIcon
              icon={poke.isBookmarked ? ['fas', 'bookmark'] : ['far', 'bookmark']}
              size="2x"
            />
          </div>
        </StyledLayer>

        <PokeCard id={id} />

        <Tweets />
      </StyledCenteredDiv>
    );
  }
}

const StyledCenteredDiv = styled.div`
  margin: auto;
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  padding: 10px;
  cursor: pointer;
  transition: .5s;

  &:hover {
    transform: scale(1.2);
    transition: .5s;
  }
`;

const StyledFontAwesomeIconRotate = styled(StyledFontAwesomeIcon)`
  padding: 10px;
  cursor: pointer;
  transition: .5s;

  &:hover {
    transform: rotate(360deg);
    transition: .5s;
  }
`;

const StyledLayer = styled(Layer)`
  & .ms-Layer-content {
    color: white;
    background: #1B9CFC;

    display: flex;
    justify-content: space-between;
  }
`;

const StyledTitle = styled.h2`
  font-weight: bold;
  font-size: 1.5em;
`;
