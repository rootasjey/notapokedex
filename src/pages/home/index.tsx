import React, { Component } from 'react';

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
  store,
  LayoutType,
  ThemeType,
} from '../../store';

import {
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Grid,
} from '@material-ui/core';

import {
  withStyles,
  Theme,
  StyleRulesCallback,
  createMuiTheme,
  MuiThemeProvider,
} from '@material-ui/core/styles';

import {
  CropSquare,
  Dashboard,
  List,
  BrightnessHigh,
  BrightnessLow,
} from '@material-ui/icons';


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
class Home extends Component<
{
  classes: any, history: any
},
{
  anchorEl?: HTMLElement
  showPanel: boolean,
  isMenuOpen: boolean
}> {

  constructor(props: any) {
    super(props);
    this.state = {
      anchorEl: undefined,
      isMenuOpen: false,
      showPanel: false
    };
  }

  componentDidMount() {
    store.loadLayoutPreference();
    store.loadThemePreference();
    store.loadBookmarks();
    store.fetchPokedex();
  }

  search(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const newValue = event.target.value;

    if (newValue === store.searchInput) {
      return;
    }

    store.setSearchInput(newValue ? newValue : '');
  }

  render() {
    let theme = createMuiTheme({
      palette: {
        type: 'light',
      },
      typography: { useNextVariants: true, },
    });

    const classes = this.props.classes;

    let themeIcon = <BrightnessLow />;

    let tooltipTheme: string = 'Dark Theme';

    if (store.theme === ThemeType.Dark) {
      themeIcon = <BrightnessHigh />;
      tooltipTheme = 'Light Theme';

      theme = createMuiTheme({
        palette: {
          type: 'dark',
        },
        typography: { useNextVariants: true },
      });
    }

    return (
      <MuiThemeProvider theme={theme}>
        <Grid className={classes.root}>
          <AppBar position="sticky" >
            <Toolbar>
              <Tooltip title="Scroll to top">
                <Typography
                  variant="h6"
                  color="inherit"
                  onClick={ () => {window.scrollTo(0, 0)}}
                >

                  notaPokedex
                </Typography>
              </Tooltip>

              <Tooltip title="Layout">
                <div>
                  <IconButton
                    aria-owns={this.state.anchorEl ? 'simple-menu' : undefined}
                    aria-haspopup={true}
                    color="inherit"
                    onClick={(event) => { this.openLayoutMenu(event) }}>

                    <Dashboard />
                  </IconButton>

                  <Menu
                    anchorEl={this.state.anchorEl}
                    id="simple-menu"
                    onClose={() => { this.onCloseLayoutMenu() }}
                    open={this.state.isMenuOpen}
                  >

                    <MenuItem onClick={() => this.setCardsLayout()}>
                      <ListItemIcon>
                        <CropSquare />
                      </ListItemIcon>
                      <ListItemText>Cards</ListItemText>
                    </MenuItem>

                    <MenuItem onClick={() => {this.setListLyout()}}>
                      <ListItemIcon>
                        <List />
                      </ListItemIcon>
                      <ListItemText>List</ListItemText>
                    </MenuItem>
                  </Menu>
                </div>
              </Tooltip>

              <Tooltip title={tooltipTheme}>
                <div>
                  <IconButton
                    color="inherit"
                    disabled={!store.isThemeLoaded}
                    onClick={() => {this.toggleTheme()}}
                  >
                    {themeIcon}
                  </IconButton>
                </div>
              </Tooltip>

              <div className={classes.grow} />

              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>

                <InputBase
                  color="inherit"
                  placeholder="Search a pokemon..."
                  defaultValue={store.searchInput}
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
        </Grid>
      </MuiThemeProvider>
    );
  }

  private openLayoutMenu(event: React.MouseEvent<HTMLElement>) {
    this.setState({ anchorEl: event.currentTarget, isMenuOpen: true });
  }

  private onCloseLayoutMenu() {
    this.setState({ anchorEl: undefined, isMenuOpen: false });
  }

  private setCardsLayout() {
    store.changeLayout(LayoutType.Cards);
    this.onCloseLayoutMenu();
  }

  private setListLyout() {
    store.changeLayout(LayoutType.List);
    this.onCloseLayoutMenu();
  }

  private toggleTheme() {
    const newTheme = store.theme === ThemeType.Dark ?
      ThemeType.Light :
      ThemeType.Dark;

    store.changeTheme(newTheme);
  }
}

export default withStyles(styles)(Home);
