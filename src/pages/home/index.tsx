import { faBookmark }                   from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon }              from '@fortawesome/react-fontawesome';
import { library }                      from '@fortawesome/fontawesome-svg-core';

import { DefaultButton }                from 'office-ui-fabric-react/lib/Button';
// import { initializeIcons }           from 'office-ui-fabric-react/lib/Icons';
import { Panel }                        from 'office-ui-fabric-react/lib/Panel';
import { TextField }                    from 'office-ui-fabric-react/lib/TextField';

import styled                           from 'styled-components';

import React, { Component, FormEvent }  from 'react';

import { store }                        from '../../store';
import { observer }                     from 'mobx-react';

import { Bookmarks }                    from './Bookmarks';
import PokeList                         from './PokeList';

library.add(faBookmark);

// NOTE: issue with icon
// https://github.com/OfficeDev/office-ui-fabric-react/issues/7110
// initializeIcons();

@observer
export default class Home extends Component<{},{ showPanel: boolean; }> {

  componentDidMount() {
    store.loadBookmarks();
    store.fetchPokedex();
  }

  constructor(props: any) {
    super(props);
    this.state = { showPanel: false };
  }

  private clearBookmarks() {
    store.clearBookmarks();
    this.closeBookmarks();
  }

  private closeBookmarks() {
    this.setState({ showPanel: false });
  }

  private openBookmarks() {
    this.setState({ showPanel: true });
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

          <StyledField
            placeholder='Search a Pokémon'
            onChange={(e, newValue) => this.search(e, newValue) }
          />
        </StyledHeader>

        <PokeList />

        <Panel
          isFooterAtBottom={true}
          isOpen={this.state.showPanel}
          isLightDismiss={true}
          headerText={`Bookmarks - ${store.bookmarks.size}`}
          onDismiss={() => this.setState({ showPanel: false })}
          onRenderFooterContent={() => this.onRenderFooterContent()}>

          <Bookmarks />
        </Panel>
      </div>
    );
  }

  private onRenderFooterContent() {
    return (
      <div>
        <DefaultButton onClick={() => this.closeBookmarks()}>
          Close
        </DefaultButton>

        <StyledClearFavoritesButton onClick={() => this.clearBookmarks()}>
          Clear Bookmarks
        </StyledClearFavoritesButton>
      </div>
    );
  }
}

const StyledClearFavoritesButton = styled(DefaultButton)`
  color: white;
  background-color: #eb4d4b;
  margin-left: 20px;
  transition: .5s;
`;

const StyledField = styled(TextField)`
  margin: auto;
  width: 200px;
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

const StyledHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;
