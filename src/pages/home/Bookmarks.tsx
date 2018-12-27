import { faTimes }          from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon }  from '@fortawesome/react-fontawesome';
import { library }          from '@fortawesome/fontawesome-svg-core';

import styled               from 'styled-components';

import { observer }         from 'mobx-react';
import { store }            from '../../store';

import { Link }             from 'react-router-dom';
import React, { Component } from 'react';


import {
  Drawer,
  IconButton,
  Typography,
} from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';

library.add(faTimes);

@observer
export default class Bookmarks extends Component<{}, {}> {

  constructor(props: any) {
    super(props);
  }

  render() {
    const bookmarks = store.bookmarks;
    const content = getContent(bookmarks);

    return (
      <Drawer
        anchor="right"
        open={store.isBookmarsPanelOpen}
        onClose={() => { store.setBookmarksPanelState(false) }}>

        <StyledContainer>
          <StyledHeader>
            <Typography variant="h4" color="inherit">
              { `Favorites - ${ store.bookmarks.size }` }
            </Typography>
          </StyledHeader>

          <StyledSubHeader>
            <IconButton aria-label="delete"
              onClick={ () => { store.clearBookmarks() } }
            >
              <DeleteIcon />
            </IconButton>

            <IconButton aria-label="close"
              onClick={ () => { store.setBookmarksPanelState(false) } }
            >
              <CloseIcon />
            </IconButton>
          </StyledSubHeader>

          <StyledBookmarksContent>
            { content }
          </StyledBookmarksContent>
        </StyledContainer>
      </Drawer>
    );
  }
}

function getContent(bookmarks: Map<number, PokemonLineEntry>) {
  if (bookmarks.size === 0) {
    return (
      <div>
        Nothing bookmarked yet.
      </div>
    );
  }

  return [...bookmarks].map(([key, poke]) => {
    return (
      <StyledBookmark key={key} >
        <StyledLink
          to={`/pokemon/${poke.id}`}
          onClick={() => store.setPartialPokemon(poke)} >

          #{poke.id + 1} - {poke.name}

        </StyledLink>

        <StyledBookmarkIconContainer onClick={() => store.removeBookmark(poke)}>
          <StyledBookmarkIcon icon="times" />
        </StyledBookmarkIconContainer>
      </StyledBookmark>
    )
  });
}

const StyledContainer = styled.div`
  min-width: 100px;
`;

const StyledBookmark = styled.div`
  display: flex;
  justify-content: space-between;

  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: #eee;

  padding: 10px;
  transition: .3s;

  &:hover {
    color: white;
    background-color: #ff7979;
    transition: .3s;
  }
`;

const StyledBookmarksContent = styled.div`
  padding: 20px;
`;

const StyledHeader = styled.div`
  background-color: #eb4d4b;
  color: white;
  padding: 20px;
`;

const StyledSubHeader = styled.div`
  display: flex;
  justify-content: center;

  padding-top: 10px;
  padding-bottom: 10px;
`;

const StyledBookmarkIcon = styled(FontAwesomeIcon)`
  display: inline-block;
  cursor: pointer;
  transition: .5s;

  &:hover {
    transform: scale(1.2);
    transition: .5s;
  }
`;

const StyledBookmarkIconContainer = styled.div`
  display: inline-block;
`;

const StyledLink = styled(Link)`
  color: inherit;
  text-decoration: none;
  transition: .5s;

  @:visited {
    color: inherit;
  }

  &:hover {
    transform: scale(1.1);
    transition: .5s;
  }
`;
