import { Link }                       from "react-router-dom";
import { observer }                   from 'mobx-react';
import { store }                      from '../../store';
import styled                         from 'styled-components';

import React,
  { Component, RefObject, ReactText } from "react";

import { IconButton, Typography }     from '@material-ui/core';

import FavoriteIcon                   from '@material-ui/icons/Favorite';

import ReactList                      from 'react-list';
import { autorun, IReactionDisposer } from "mobx";


import {
  Theme,
  StyleRulesCallback,
  withStyles,
} from '@material-ui/core/styles';

const styles: StyleRulesCallback = (theme: Theme) => ({
  iconList: {
    width: 71,
  },
});

@observer
class PokeList extends Component<{ classes: any }> {
  private bookmarksDisposer: IReactionDisposer;
  private items: MinimalPokemon[];
  private list: RefObject<ReactList>;
  private resizedHandler: EventListener;

  public state: {
    height: number;
    items: MinimalPokemon[];
    width: number;
    scrollTo: number,
  }

  constructor(props: any) {
    super(props);

    this.list = React.createRef();
    this.items = [];

    this.state = {
      height: window.innerHeight,
      items: [],
      width: window.innerWidth,
      scrollTo: store.selectedPokemon.id,
    };

    this.resizedHandler = this.onResize.bind(this);

    this.bookmarksDisposer = autorun(() => {
      if (store.bookmarksChanged && this.list.current) {
        this.list.current.forceUpdate();
        store.setOffBookmarksChanged();
      }
    });
  }

  componentDidMount() {
    window.addEventListener('resize', this.resizedHandler);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizedHandler);

    if (this.bookmarksDisposer) {
      this.bookmarksDisposer();
    }
  }

  onResize() {
    this.setState({
      height: window.innerHeight - 100,
      width: window.innerWidth,
    });
  }

  public render() {
    const items = store.filteredList.length > 0 ? store.filteredList : store.list;
    const noMatch = store.searchInput.length > 0 && store.filteredList.length === 0;

    this.items = items;

    const content = noMatch ?
      <EmptyView hidden={noMatch} /> :
      <ReactList
        ref={this.list}
        itemRenderer={(index, key) => this.rowRenderer(index, key)}
        length={items.length}
        type="uniform"
      />

    return (
      <StyledCenteredContent>
        { content }
      </StyledCenteredContent>
    )
  }

  private rowRenderer(index: number, key: ReactText) {
    const pokemonLineEntry = this.items[index];
    const { classes } = this.props;

    return (
      <StyledRow key={key} >
        <StyledLink
          to={ `/pokemon/${ pokemonLineEntry.id }` }
          onClick={ () => store.setPartialPokemon(pokemonLineEntry) }
        >

          <Typography component="p">
            #{ pokemonLineEntry.id }
          </Typography>

          <Typography variant="h5" component="h3">
            {pokemonLineEntry.name}
          </Typography>
        </StyledLink>

        <IconButton
          aria-label="Add to favorites"
          className={classes.iconList}
          onClick={() => { this.toggleBookmark(pokemonLineEntry) }}>

          <FavoriteIcon
            color={store.isBookmarked(pokemonLineEntry) ? "secondary" : "action"}
          />
        </IconButton>
      </StyledRow>
    )
  }

  private toggleBookmark(pokemonLineEntry: MinimalPokemon) {
    store.isBookmarked(pokemonLineEntry) ?
      store.removeBookmark(pokemonLineEntry) :
      store.addBookmark(pokemonLineEntry);
  }
}

export default withStyles(styles)(PokeList);

function EmptyView(props: any): JSX.Element {
  const hidden: boolean = props.hidden;

  if (hidden) {
    return (
      <StyledCenterDiv>
        <Typography>
          No match has been found :(
        </Typography>
      </StyledCenterDiv>);
  }

  return <span></span>;
}

const StyledCenterDiv = styled.div`
  margin: auto;
`;

const StyledCenteredContent = styled.div`
  display: flex;
  justify-content: center;

  margin-top: 30px;
`;

const StyledRow = styled.div`
  border-bottom-color: #95a5a6;
  border-bottom-style: solid;
  border-bottom-width: 1px;

  min-width: 256px;

  cursor: pointer;

  display: flex;
  justify-content: space-between;

  transition: .3s;

  &:hover {
    box-shadow: -1px 20px 26px -17px rgba(0,0,0,0.75);
    transition: .3s;
  }
`;

const StyledLink = styled(Link)`
  display: inline-block;
  width: 100%;
  padding: 10px;

  text-decoration: none;
`;
