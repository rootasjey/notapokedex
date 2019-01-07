import { Link }                       from 'react-router-dom';
import { observer }                   from 'mobx-react';
import { store, LayoutType }          from '../../store';
import styled                         from 'styled-components';

import React,
{ Component, RefObject, ReactText }   from 'react';

import FavoriteIcon                   from '@material-ui/icons/Favorite';

import ReactList                      from 'react-list';
import { autorun, IReactionDisposer } from 'mobx';

import Tilt                           from 'react-tilt';

import {
  Avatar,
  Card,
  CardActionArea,
  CardHeader,
  CardMedia,
  IconButton,
  LinearProgress,
  Paper,
  Typography,
  Grow,
} from '@material-ui/core';

import {
  Theme,
  StyleRulesCallback,
  withStyles,
} from '@material-ui/core/styles';

import blank from '../../assets/blank.png';

const styles: StyleRulesCallback = (theme: Theme) => ({
  animInflate: {
    animationName: 'inflate',
    animationDuration: '.6s',
  },
  bold: {
    fontWeight: 'bold',
  },
  card: {
    height: 190,
    width: 180,
    margin: 10,
  },
  cardsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 30,
  },
  centeredDiv: {
    margin: 'auto',
  },
  iconList: {
    width: 71,
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: 30,
  },
  media: {
    height: 100,
    margin: 'auto',
    width: 100,
  },
  root: {
    display: 'flex',
    minHeight: '100%',
    justifyContent: 'center',
  },
  row: {
    backgroundColor: 'transparent',
    borderBottomColor: '#95a5a6',
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,

    cursor: 'pointer',

    display: 'flex',
    justifyContent: 'center',

    transition: '.3s',

    '&:hover': {
      boxShadow: '-1px 20px 26px -17px rgba(0,0,0,0.75);',
      transition: '.3s',
    }
  },
});

@observer
class PokeList extends Component<{ classes: any }> {
  private bookmarksDisposer?: IReactionDisposer;
  private items: MinimalPokemon[];
  private list: RefObject<ReactList>;
  private resizedHandler: EventListener;

  public state: {
    height    : number;
    items     : MinimalPokemon[];
    scrollTo  : number;
    width     : number;
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
  }

  componentDidMount() {
    window.addEventListener('resize', this.resizedHandler);

    this.bookmarksDisposer = autorun(() => {
      if (store.bookmarksChanged && this.list.current) {
        this.list.current.forceUpdate();
        store.setOffBookmarksChanged();
      }
    });
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
    const { classes } = this.props;

    const items = store.filteredList.length > 0 ? store.filteredList : store.list;
    const noMatch = store.searchInput.length > 0 && store.filteredList.length === 0;

    this.items = items;

    const content = noMatch ?
      <EmptyView classes={classes} hidden={noMatch} /> :
      <ReactList
        itemRenderer={
          store.layout === LayoutType.Cards ?
          (index, key) => this.cardRenderer(index, key) :
          (index, key) => this.rowRenderer(index, key)
        }
        itemsRenderer={(items, ref) => this.itemsContainerRenderer(items, ref)}
        length={items.length}
        ref={this.list}
        type="uniform"
      />

    return (
      <Paper
        className={classes.root}
        square={true}
      >
        { content }
      </Paper>
    )
  }

  private itemsContainerRenderer(items: JSX.Element[], ref: string) {
    const { classes } = this.props;

    return (
      <div
        className={
          store.layout === LayoutType.Cards ?
            classes.cardsContainer :
            classes.listContainer
          }

        ref={ref}
      >
        {items}
      </div>
    );
  }

  private cardRenderer(index: number, key: ReactText) {
    const { classes } = this.props;
    const minimalPokemon = this.items[index];

    let mediaURL: string = '';
    let progress: JSX.Element = <span></span>;

    if (minimalPokemon.sprites) {
      mediaURL = minimalPokemon.sprites.defaultFront;

    } else {
      mediaURL = blank;
      store.fetchPokemonSprites(minimalPokemon.id);
      progress = <LinearProgress />;
    }

    return (
      <Tilt key={key} options={{ scale: 1.1 }} >
        <Card
          className={classes.card}
          key={key}
          square={true}
        >
          {progress}

          <CardActionArea>
            <Link
              to={`/pokemon/${minimalPokemon.id}`}
              onClick={() => store.setPartialPokemon(minimalPokemon)}
            >
              <Grow in={mediaURL !== blank}>
                <CardMedia
                  className={classes.media}
                  image={mediaURL}
                  title={minimalPokemon.name}
                />
              </Grow>

            </Link>
          </CardActionArea>

          <CardHeader
            avatar={
              <Avatar>
                <IconButton
                  aria-label="Add to favorites"
                  className={classes.iconList}
                  onClick={() => { this.toggleBookmark(minimalPokemon) }}>

                  <FavoriteIcon
                    className={store.isBookmarked(minimalPokemon) ? classes.animInflate : ''}
                    color={store.isBookmarked(minimalPokemon) ? 'secondary' : 'action'}
                  />
                </IconButton>
              </Avatar>
            }
            title={minimalPokemon.name}
            subheader={`n°${minimalPokemon.id}`}
          />
        </Card>
      </Tilt>
    )
  }

  private rowRenderer(index: number, key: ReactText) {
    const pokemonLineEntry = this.items[index];
    const { classes } = this.props;

    return (
      <Paper
        className={classes.row}
        elevation={0}
        key={key}
        square={true}
      >
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
      </Paper>
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
  const { classes } = props;

  if (hidden) {
    return (
      <div className={classes.centeredDiv}>
        <Typography>
          No match has been found :(
        </Typography>
      </div>
    );
  }

  return <span></span>;
}

const StyledLink = styled(Link)`
  display: inline-block;
  width: 100%;
  padding: 10px;

  text-decoration: none;
`;
