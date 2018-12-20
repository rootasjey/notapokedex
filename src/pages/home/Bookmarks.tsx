import { faTimes }          from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon }  from '@fortawesome/react-fontawesome';
import { library }          from '@fortawesome/fontawesome-svg-core';

import styled               from 'styled-components';

import { store }            from '../../store';

import { Link }             from 'react-router-dom';
import React                from 'react';

library.add(faTimes);

export function Bookmarks(props: any): JSX.Element {
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
      <StyledBookmark key={ key }>
        <StyledLink
          to={ `/pokemon/${poke.id}` }
          onClick={ () => store.setPartialPokemon(poke) } >

          #{ poke.id + 1 } - { poke.name }

        </StyledLink>

        <StyledBookmarkIconContainer onClick={ () => store.removeBookmark(poke) }>
          <StyledBookmarkIcon icon="times" />
        </StyledBookmarkIconContainer>
      </StyledBookmark>
    )
  });

  return (
    <div>
      {items}
    </div>
  );
}

const StyledBookmark = styled.div`
  display: flex;
  justify-content: space-between;
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
