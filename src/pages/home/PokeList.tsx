import { faBookmark } from '@fortawesome/free-regular-svg-icons';
import { faBookmark as faBookmarked } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

import { FocusZone, FocusZoneDirection }  from 'office-ui-fabric-react/lib/FocusZone';
import { Link }                           from "react-router-dom";
import { List }                           from 'office-ui-fabric-react/lib/List';
import { observer }                       from 'mobx-react';
import React, { Component }               from "react";
import { store }                          from '../../store';
import styled                             from 'styled-components';

library.add(faBookmark, faBookmarked);

@observer
export default class PokeList extends Component {
  public render() {
    const items = store.filteredList.length > 0 ? store.filteredList : store.list;
    const noMatch = store.searchInput.length > 0 && store.filteredList.length === 0;

    return (
      <ListView items={items} onRenderCell={this._onRenderCell} noMatch={noMatch} />
    )
  }

  // NOTE: Mutating the pokemon's name on the row
  // is just a hack to force the row to re-render.
  private _onRenderCell(poke: PokemonLineEntry, index?: number, isScrolling?: boolean): JSX.Element {
    return (
      <Row>
        <StyledLink to={`/pokemon/${poke.id}`} data-is-focusable={true}>
            #{poke.id} - {poke.name}
        </StyledLink>

        <div onClick={() => {
            poke.name += ' ';
            store.isBookmarked(poke) ?
            store.removeBookmark(poke) :
            store.addBookmark(poke)}
          }>

          <StyledFontAwesomeIcon icon={store.isBookmarked(poke) ? ['fas', 'bookmark'] : ['far', 'bookmark']} />
        </div>
      </Row>
    )
  }
}

function EmptyView() {
  return <CenteredDiv>No match has been found :(</CenteredDiv>;
}

function ListView(props: any) {
  const items: PokemonLineEntry[] = props.items;
  const { noMatch, onRenderCell } = props;

  if (noMatch) {
    return EmptyView();
  }

  return (
    <FocusZone direction={FocusZoneDirection.vertical} >
      <ListDivContainer data-is-scrollable={true} >
        <List items={items} onRenderCell={onRenderCell} />
      </ListDivContainer>
    </FocusZone>
  )
}

const CenteredDiv = styled.div`
  margin: auto;
`;

const ListDivContainer = styled.div`
  overflow: auto;
  margin: auto;
  max-height: 500px;
  width: 60%;
`;

const Row = styled.div`
  border-bottom-color: #95a5a6;
  border-bottom-style: solid;
  border-bottom-width: 1px;

  cursor: pointer;

  display: flex;
  justify-content: space-between;

  transition: .5s;

  &:hover {
    color: white;
    background-color: #95a5a6;
    transition: .5s;
  }
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  cursor: pointer;
  padding: 10px;
  padding-right: 20px;
  transition: .5s;

  &:hover {
    transform: scale(1.1);
    transition: .5s;
  }
`;

const StyledLink = styled(Link)`
  display: inline-block;
  width: 100%;
  padding: 10px;
`;
