import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

import PokeList                         from './PokeList';
import React, { Component, FormEvent }  from 'react';
import { store }                        from '../../store';
import styled                           from 'styled-components';
import { TextField }                    from 'office-ui-fabric-react/lib/TextField';

library.add(faBookmark);

export default class Home extends Component {
  componentDidMount() {
    store.fetchPokedex();
  }

  private closeBookmarks() {
    console.log('close bookmarks');
  }

  private openBookmarks() {
    console.log('open bookmarks');
  }

  search(e: FormEvent, newValue?: string) {
    store.setSearchInput(newValue ? newValue : '');
  }

  render() {
    return (
      <div>
        <StyledHeader>
          <div onClick={() => this.openBookmarks()}>
            <StyledFontAwesomeIcon icon="bookmark" size="2x" />
          </div>

          <h1>Pokedex</h1>

          <StyledField placeholder='Search a Pokémon' onChange={(e, newValue) => this.search(e, newValue) } />
        </StyledHeader>

        <PokeList />
      </div>
    );
  }
}

const StyledField = styled(TextField)`
  margin: auto;
  width: 200px;
`;

const StyledHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  padding: 10px;
  cursor: pointer;
  position: absolute;
  right: 10px;
  transition: .5s;

  &:hover {
    transform: scale(1.1);
    transition: .5s;
  }
`;
