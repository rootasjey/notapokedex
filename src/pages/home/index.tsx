import { faBookmark, faTimes }          from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon }              from '@fortawesome/react-fontawesome';
import { library }                      from '@fortawesome/fontawesome-svg-core';

import { DefaultButton }                from 'office-ui-fabric-react/lib/Button';
// import { initializeIcons }           from 'office-ui-fabric-react/lib/Icons';
import { Link }                         from 'react-router-dom';
import { Panel }                        from 'office-ui-fabric-react/lib/Panel';
import PokeList                         from './PokeList';
import React, { Component, FormEvent }  from 'react';
import { store }                        from '../../store';
import styled                           from 'styled-components';
import { TextField }                    from 'office-ui-fabric-react/lib/TextField';

library.add(faBookmark, faTimes);

// NOTE: issue with icon
// https://github.com/OfficeDev/office-ui-fabric-react/issues/7110
// initializeIcons();

export default class Home extends Component<{},{ showPanel: boolean; }> {
  componentDidMount() {
    store.fetchPokedex();
  }

  constructor(props: any) {
    super(props);
    this.state = { showPanel: false };
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

          <StyledField placeholder='Search a Pokémon' onChange={(e, newValue) => this.search(e, newValue) } />
        </StyledHeader>

        <PokeList />

        <Panel
          isFooterAtBottom={true}
          isOpen={this.state.showPanel}
          isLightDismiss={true}
          headerText="Bookmarks"
          onDismiss={() => this.setState({ showPanel: false })}
          onRenderFooterContent={() => this.onRenderFooterContent()}>

          <Bookmarks />
        </Panel>
      </div>
    );
  }

  private onRenderFooterContent() {
    return (
      <DefaultButton onClick={() => this.setState({ showPanel: false })}>
        Close
      </DefaultButton>
    );
  }
}

function Bookmarks(props: any): JSX.Element {
  const bookmarks = store.bookmarks;

  if (bookmarks.size === 0) {
    return (
      <div>
        Nothing bookmarked yet.
      </div>
    );
  }

  const items = [...bookmarks].map(([key, poke]) => {
    return (
      <StyledBookmark key={key}>
        <StyledLink to={`/pokemon/${poke.id}`}>
          #{poke.id} - {poke.name}
        </StyledLink>

        <BookmarkIconContainer onClick={() => store.removeBookmark(poke)}>
          <BookmarkIcon icon="times" />
        </BookmarkIconContainer>
      </StyledBookmark>
    )
  });

  return (
    <div>
      {items}
    </div>
  );
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

const BookmarkIcon = styled(FontAwesomeIcon)`
  display: inline-block;
  cursor: pointer;
  transition: .5s;

  &:hover {
    transform: scale(1.2);
    transition: .5s;
  }
`;

const BookmarkIconContainer = styled.div`
  display: inline-block;
`;

const StyledBookmark = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledLink = styled(Link)`
  color: black;
  text-decoration: none;
  transition: .5s;

  @:visited {
    color: black;
  }

  &:hover {
    transform: scale(1.1);
    transition: .5s;
  }
`;
