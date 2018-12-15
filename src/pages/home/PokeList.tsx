import { FocusZone, FocusZoneDirection }  from 'office-ui-fabric-react/lib/FocusZone';
import { Link }                           from "react-router-dom";
import { List }                           from 'office-ui-fabric-react/lib/List';
import { observer }                       from 'mobx-react';
import React, { Component }               from "react";
import { store }                          from '../../store';
import styled                             from 'styled-components';

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
  padding: 10px;
  transition: .5s;

  &:hover {
    color: white;
    background-color: #95a5a6;
    transition: .5s;
  }
`;

@observer
export default class PokeList extends Component {
  public render() {
    const items = store.filteredList.length > 0 ? store.filteredList : store.list;
    const noMatch = store.searchInput.length > 0 && store.filteredList.length === 0;

    return (
      <ListView items={items} onRenderCell={this._onRenderCell} noMatch={noMatch} />
    )
  }

  private _onRenderCell(item: PokemonLineEntry, index?: number, isScrolling?: boolean): JSX.Element {
    return (
      <Link to={`/pokemon/${item.id}`} data-is-focusable={true}>
        <Row>
            {item.id}   {item.name}
        </Row>
      </Link>
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
      <ListDivContainer data-is-scrollable={true} className="ms-ListScrollingExample-container">
        <List items={items} onRenderCell={onRenderCell} />
      </ListDivContainer>
    </FocusZone>
  )
}
