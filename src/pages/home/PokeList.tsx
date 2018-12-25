import { faBookmark } from '@fortawesome/free-regular-svg-icons';
import { faBookmark as faBookmarked } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

import { FocusZone, FocusZoneDirection }  from 'office-ui-fabric-react/lib/FocusZone';
import { Link }                           from "react-router-dom";
import { List, IPage }                           from 'office-ui-fabric-react/lib/List';
import { observer }                       from 'mobx-react';
import React, { Component, RefObject }    from "react";
import { store }                          from '../../store';
import styled                             from 'styled-components';

import { Collection } from 'react-virtualized';
import 'react-virtualized/styles.css';

library.add(faBookmark, faBookmarked);

@observer
export default class PokeList extends Component {
  private list: RefObject<List>;

  private lastIndex: number = 0;

  private resizedHandler: EventListener;

  public state: {
    height: number;
    scrollTo: number,
  }

  constructor(props: any) {
    super(props);

    this.list = React.createRef();

    this.state = {
      height: window.innerHeight,
      scrollTo: store.selectedPokemon.id,
    };

    this.resizedHandler = this.onResize.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.resizedHandler);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizedHandler);
  }

  onResize() {
    this.setState({ height: window.innerHeight - 100 });
  }

  public render() {
    // NOTE: By-pass to force rows to update when necessary.
    if (this.list.current) {
      if (store.bookmarksChanged) {
        // this.list.current.forceUpdate();
        store.setOffBookmarksChanged();
      }

      if (this.list.current.getStartItemIndexInView() > 0) {
        this.lastIndex = this.list.current.getStartItemIndexInView();
      }

      // Restore scroll
      // NOTE: Hack to restore scroll properly
      // Issue with List here:
      // https://github.com/OfficeDev/office-ui-fabric-react/issues/5551
      setTimeout(() => {
        // console.log(store.selectedPokemon.id);
        if (this.list.current) {
          // this.list.current.scrollToIndex(store.selectedPokemon.id);
          console.log(`scrolled to ${this.lastIndex}`);
          this.list.current.scrollToIndex(this.lastIndex);
        }
      }, 100);
    }

    const ListDivContainer = styled.div`
      overflow: auto;
      margin: auto;
      max-height: ${ this.state.height }px;
    `;

    const items = store.filteredList.length > 0 ? store.filteredList : store.list;
    const noMatch = store.searchInput.length > 0 && store.filteredList.length === 0;

    return (
      <StyledCenteredContent>
        <EmptyView hidden={noMatch} />

        <FocusZone direction={FocusZoneDirection.vertical} hidden={noMatch} >
          <ListDivContainer data-is-scrollable={true} >
            <List ref={this.list} items={items} onRenderCell={this._onRenderCell}
             />
            {/* onPagesUpdated={(pages: IPage[]) => this.onPagesUpdated(pages)} */}
          </ListDivContainer>
        </FocusZone>
      </StyledCenteredContent>
    )
  }

  private _onRenderCell(poke: PokemonLineEntry): JSX.Element {
    return (
      <Row>
        <StyledLink
          to={ `/pokemon/${poke.id}` }
          data-is-focusable={ true }
          onClick={ () => store.setPartialPokemon(poke) } >

            #{poke.id + 1} - {poke.name}

        </StyledLink>

        <div onClick={() => { toggleBookmark(poke) }}>
          <StyledFontAwesomeIcon icon={store.isBookmarked(poke) ? ['fas', 'bookmark'] : ['far', 'bookmark']} />
        </div>
      </Row>
    )
  }
}

function toggleBookmark(pokemon: PokemonLineEntry) {
  store.isBookmarked(pokemon) ?
    store.removeBookmark(pokemon) :
    store.addBookmark(pokemon);
}

function EmptyView(props: any) {
  const hidden: boolean = props.hidden;

  if (hidden) {
    return <CenteredDiv>No match has been found :(</CenteredDiv>;
  }

  return <span></span>;
}

const CenteredDiv = styled.div`
  margin: auto;
`;

const StyledCenteredContent = styled.div`
  display: flex;
  justify-content: center;
`;

const Row = styled.div`
  border-bottom-color: #95a5a6;
  border-bottom-style: solid;
  border-bottom-width: 1px;

  min-width: 256px;

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
