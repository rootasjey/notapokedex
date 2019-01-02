import React, { Component } from 'react';

import { observer }         from 'mobx-react';
import { store }            from '../../store';

import {
  IReactionDisposer,
  autorun,
} from 'mobx';

import {
  Card,
  CardActionArea,
  CardMedia,
  Grow,
  IconButton,
  Typography,
} from '@material-ui/core';

import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from '@material-ui/icons';

import {
  Theme,
  StyleRulesCallback,
  withStyles,
} from '@material-ui/core/styles';

const styles: StyleRulesCallback = (theme: Theme) => ({
  card: {
    height: 150,
    transition: '.3s',
    width: 150,
  },
  cardBig: {
    height: 300,
    transition: '.3s',
    width: 300,
  },
  cardSmall: {
    height: 100,
    width: 100,
    margin: 3,
    transition: '.3s',
  },
  cardSmallRaised: {
    boxShadow: '-1px 20px 26px -17px rgba(0,0,0,0.75)',
    height: 100,
    width: 100,
    margin: 3,
    transition: '.3s',
  },
  currentImgContainer: {
    display: 'flex',
    justifyContent: 'center',

    marginTop: 30,
    marginBottom: 30,

    whiteSpace: 'nowrap',
  },
  iconButton: {
    height: 64,
    width: 64,
  },
  iconButtonContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  media: {
    height: 150,
    transition: '.3s',
  },
  mediaBig: {
    height: 300,
    transition: '.3s',
  },
  mediaSmall: {
    height: 100,
    transition: '.3s',
  },
  spritesContainer: {
    display: 'flex',
    justifyContent: 'center'
  },
});

@observer
class Caroussel extends Component<
  { // Props
    classes: any,
  },

  { // State
    imgBig: boolean,
    currentImgKey: string,
    currentImgSrc: string,
  }> {

    private spritesDisposer?: IReactionDisposer;

  constructor(props: any) {
    super(props);

    this.state = {
      currentImgKey: 'front_default',
      currentImgSrc: '',
      imgBig: false,
    };
  }

  componentDidMount() {
    this.spritesDisposer = autorun(() => {
      const sprite: string = this
        .getFirstValidSprite(store.selectedPokemon.sprites);

      if (sprite.length === 0) {
        return;
      }

      this.setState({ currentImgSrc: sprite });

      if (this.spritesDisposer) {
        this.spritesDisposer();
      }
    });
  }

  componentWillUnmount() {
    if (this.spritesDisposer) {
      this.spritesDisposer();
    }
  }

  render() {
    const { classes } = this.props;
    const pokemonName: string = store.selectedPokemon.name;

    if (!this.state.currentImgSrc) {
      return <span></span>
    }

    return (
      <div>
        <div className={classes.currentImgContainer}>

          <div className={classes.iconButtonContainer}>
            <IconButton className={classes.iconButton}
              onClick={() => {this.previousSprite()}}
            >
              <KeyboardArrowLeft fontSize="large" />
            </IconButton>
          </div>

          <Card
            className={ this.state.imgBig ? classes.cardBig : classes.card }
            raised={true}
            square={true}
            onClick={() => { this.setState({ imgBig: !this.state.imgBig }) }}
          >
            <CardActionArea>
              <CardMedia
                className={ this.state.imgBig ? classes.mediaBig : classes.media }
                image={this.state.currentImgSrc}
                title={this.state.currentImgKey.replace('_', ' ')}
              />
            </CardActionArea>
          </Card>

          <div className={classes.iconButtonContainer}>
            <IconButton className={classes.iconButton}
              onClick={() => {this.nextSprite()}}
            >
              <KeyboardArrowRight fontSize="large" />
            </IconButton>
          </div>

        </div>

        <Grow
          in={this.state.imgBig}
        >
          <Typography gutterBottom={true} variant="caption">
            {this.state.currentImgKey.replace('_', ' ')}
          </Typography>
        </Grow>

        <div className={classes.spritesContainer}>
          {this.getSmallSprites()}
        </div>
      </div>
    );
  }

  /**
   * Return the first available (valid) sprites.
   * @param sprites List of sprites to choose from.
   */
  private getFirstValidSprite(sprites: Sprites): string {
    let firstMatch = sprites.defaultFront || sprites.femaleFront;

    if (!firstMatch) {
      Object
        .keys(sprites)
        .some((key: string) => {
          if (sprites[key]) {
            firstMatch = sprites[key];
            return true;
          }

          return false;
        });
    }

    return firstMatch;
  }

  /**
   * Return the N-th sprite from the current one.
   * If the distance is negative, it will calculate from backwards.
   * @param distance The N-th sprite to return.
   */
  private getSpriteFromCurrent(distance: number) {
    const { currentImgKey } = this.state;
    const { sprites } = store.selectedPokemon;

    let indexMatch = -1;

    const validSprites = Object
      .keys(sprites)
      .filter((key) => {
        return sprites[key];
      })
      .map((key, index) => {
        if (key === currentImgKey) {
          indexMatch = index;
        }

        return {
          key,
          val: sprites[key],
        };
      });

    indexMatch = indexMatch < 1 ? validSprites.length : indexMatch;

    return validSprites[(indexMatch + distance) % validSprites.length];
  }

  private getSmallSprites() {
    const { name, sprites } = store.selectedPokemon;
    const { classes } = this.props;

    return Object
      .keys(sprites)
      .filter((key) => { return sprites[key]; })
      .map((key) => (
        <Grow
          key={key}
          in={this.state.imgBig}
        >
          <Card
            className={this.state.currentImgKey === key ? classes.cardSmallRaised : classes.cardSmall}
            onClick={() => { this.selectSprite(key, sprites[key]) }}
            square={true}
          >
            <CardActionArea>
              <CardMedia
                className={classes.mediaSmall}
                image={sprites[key]}
                title={name}
              />
            </CardActionArea>
          </Card>
        </Grow>
      ));
  }

  /**
   * Set the next available sprite.
   */
  private nextSprite() {
    const nextSprite = this.getSpriteFromCurrent(1);

    this.setState({
      currentImgKey: nextSprite.key,
      currentImgSrc: nextSprite.val,
    });
  }

  /**
   * Set the previous available sprite.
   */
  private previousSprite() {
    const previousSprite = this.getSpriteFromCurrent(-1);

    this.setState({
      currentImgKey: previousSprite.key,
      currentImgSrc: previousSprite.val,
    });
  }

  /**
   * Select a specific sprite.
   */
  private selectSprite(key: string, val: string) {
    this.setState({
      currentImgKey: key,
      currentImgSrc: val,
    });
  }

}

export default withStyles(styles)(Caroussel);
