import { observer }             from 'mobx-react';
import React, { Component }     from 'react';
import { store }                from '../../store';

import styled                   from 'styled-components';

import PokeCard                 from './PokeCard';
import Tweets                   from './Tweets';

import { ArrowBack, Favorite }  from '@material-ui/icons';

import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
} from '@material-ui/core';

import {
  Theme,
  StyleRulesCallback,
  withStyles,
 } from '@material-ui/core/styles';

const styles: StyleRulesCallback = (theme: Theme) => ({
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
});

@observer
class Details extends Component<{ classes: any }, {}> {
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
      id            : pokemon.id - 1,
      isBookmarked  : store.isBookmarked(pokemon.id - 1),
      name          : pokemon.name,
      url           : `${store.baseURL}${pokemon.id}`,
    }

    store.isBookmarked(pokeLineEntry) ?
      store.removeBookmark(pokeLineEntry) :
      store.addBookmark(pokeLineEntry)
  }

  render() {
    const props: any  = this.props;
    const classes     = props.classes;
    const id          = props.match.params.id;
    const pokemon     = store.selectedPokemon;
    const poke        = {...pokemon, ...{id: pokemon.id - 1}};

    return (
      <StyledCenteredDiv className={classes.root}>
        <AppBar position="sticky" >
          <Toolbar>
            <IconButton onClick={ () => { this.goBack() }} color="inherit" >
              <ArrowBack color="inherit" />
            </IconButton>

            <div className={classes.grow} />

            <Typography variant="h6" color="inherit">
              { store.selectedPokemon.name }
            </Typography>

            <div className={classes.grow} />

            <IconButton onClick={() => { this.toggleBookmark(pokemon) }} >
              <Favorite color={ poke.isBookmarked ? "secondary" : "inherit" } />
            </IconButton>

          </Toolbar>
        </AppBar>

        <PokeCard id={id} />

        <Tweets />
      </StyledCenteredDiv>
    );
  }
}

const StyledCenteredDiv = styled.div`
  margin: auto;
`;

export default withStyles(styles)(Details);
