import React, { Component } from 'react';

import { store }            from '../../store';
import { observer }         from 'mobx-react';

import Bookmarks            from './Bookmarks';
import PokeList             from './PokeList';

import Typography           from '@material-ui/core/Typography';
import IconButton           from '@material-ui/core/IconButton';
import FavoriteIcon         from '@material-ui/icons/Favorite';

import AppBar               from '@material-ui/core/AppBar';
import Toolbar              from '@material-ui/core/Toolbar';
import InputBase            from '@material-ui/core/InputBase';
import SearchIcon           from '@material-ui/icons/Search';

import { fade }             from '@material-ui/core/styles/colorManipulator';

import {
  withStyles,
  Theme,
  StyleRulesCallback,
} from '@material-ui/core/styles';
import { Tooltip } from '@material-ui/core';

const styles: StyleRulesCallback = (theme: Theme)  => ({
  favoriteIcon: {
    marginLeft: '10px',
  },
  grow: {
    flexGrow: 1,
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingEight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 150,
      '&:focus': {
        width: 210,
      },
    },
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  root: {
    width: '100%',
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit,
      width: 'auto'
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

@observer
class Home extends Component<{ classes: any, history: any}, { showPanel: boolean; }> {
  constructor(props: any) {
    super(props);
    this.state = { showPanel: false };
  }

  componentDidMount() {
    store.loadBookmarks();
    store.fetchPokedex();
  }

  search(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const newValue = event.target.value;
    store.setSearchInput(newValue ? newValue : '');
  }

  render() {
    const classes = this.props.classes;

    return (
      <div className={classes.root}>
        <AppBar position="sticky" >
          <Toolbar>
            <Tooltip title="Scroll to top">
              <Typography
                variant="h6"
                color="inherit"
                onClick={ () => {window.scrollTo(0, 0)}}
              >

                Pokedex
              </Typography>
            </Tooltip>

            <div className={classes.grow} />

            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>

              <InputBase
                color="inherit"
                placeholder="Search a pokemon..."
                onChange={(e) => this.search(e)}
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
              />
            </div>

            <Tooltip title="Open favorites">
              <IconButton
                onClick={ () => { store.setBookmarksPanelState(true) } }
                className={ classes.favoriteIcon }
                aria-label="All favorites">

                <FavoriteIcon color="secondary" />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>

        <PokeList />

        <Bookmarks history={this.props.history} />
      </div>
    );
  }
}

export default withStyles(styles)(Home);
