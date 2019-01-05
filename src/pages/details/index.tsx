import { observer }             from 'mobx-react';
import React, { Component }     from 'react';

import { store, ThemeType }     from '../../store';

import PokeCard                 from './PokeCard';
import Tweets                   from './Tweets';
import Controversy              from './Controversy';

import { ArrowBack, Favorite }  from '@material-ui/icons';

import {
  autorun,
  IReactionDisposer,
} from 'mobx';

import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  Tooltip,
  Paper,
} from '@material-ui/core';

import {
  Theme,
  StyleRulesCallback,
  withStyles,
  createMuiTheme,
  MuiThemeProvider,
 } from '@material-ui/core/styles';


const styles: StyleRulesCallback = (theme: Theme) => ({
  root: {
    flexGrow: 1,
    margin: 'auto',
  },
  grow: {
    flexGrow: 1,
  },
});

@observer
class Details extends Component<{ classes: any }, {}> {

  private bookmarksDisposer?: IReactionDisposer;

  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    this.bookmarksDisposer = autorun(() => {
      if (store.isBookmarksLoaded) {
        store.selectedPokemon.isBookmarked =
          store.isBookmarked(store.selectedPokemon);

        if (this.bookmarksDisposer) {
          this.bookmarksDisposer();
        }

        return;
      }

      store.loadBookmarks();
    });
  }

  componentWillUnmount() {
    if (this.bookmarksDisposer) {
      this.bookmarksDisposer();
    }
  }

  render() {
    const props: any  = this.props;
    const classes     = props.classes;
    const id          = props.match.params.id;
    const pokemon     = store.selectedPokemon;

    let theme = createMuiTheme({
      palette: {
        type: 'light',
      },
      typography: { useNextVariants: true, }
    });

    if (store.theme === ThemeType.Dark) {
      theme = createMuiTheme({
        palette: {
          type: 'dark',
        },
        typography: { useNextVariants: true },
      });
    }

    return (
      <MuiThemeProvider theme={theme}>
        <Paper className={classes.root} square={true}>
          <AppBar position="sticky" >
            <Toolbar>
              <Tooltip title="Go back">
                <IconButton onClick={ () => { this.goBack() }} color="inherit" >
                  <ArrowBack color="inherit" />
                </IconButton>
              </Tooltip>

              <div className={classes.grow} />

              <Typography variant="h6" color="inherit">
                { store.selectedPokemon.name }
              </Typography>

              <div className={classes.grow} />

              <Tooltip title={pokemon.isBookmarked ? "Remove from favorites" : "Add to favorites"} >
                <div>
                  <IconButton
                    onClick={() => { this.toggleBookmark(pokemon) }}
                    disabled={!store.isBookmarksLoaded} >

                    <Favorite color={ pokemon.isBookmarked ? "secondary" : "inherit" } />
                  </IconButton>
                </div>
              </Tooltip>

            </Toolbar>
          </AppBar>

          <PokeCard id={id} />

          <Controversy />

          <Tweets />
        </Paper>
      </MuiThemeProvider>
    );
  }

  private goBack() {
    const props: any = this.props;
    props.history.goBack();
  }

  private toggleBookmark(pokemon: Pokemon) {
    const { id, name, sprites } = pokemon;
    const isBookmarked = store.isBookmarked(id);

    const minimalPokemon: MinimalPokemon = {
      id,
      isBookmarked,
      name,
      sprites,
      url: `${store.baseURL}${id}`,
    };

    store.isBookmarked(minimalPokemon) ?
      store.removeBookmark(minimalPokemon) :
      store.addBookmark(minimalPokemon);
  }

}

export default withStyles(styles)(Details);
