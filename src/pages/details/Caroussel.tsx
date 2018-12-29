import React, { Component }  from 'react';
import styled from 'styled-components';

import {
  Card,
  CardActionArea,
  CardMedia,
} from '@material-ui/core';

import {
  Theme,
  StyleRulesCallback,
  withStyles,
} from '@material-ui/core/styles';

const styles: StyleRulesCallback = (theme: Theme) => ({
  card: {
    width: 150,
    height: 150,
    transition: '.3s',
  },
  cardBig: {
    width: 300,
    height: 300,
    transition: '.3s',
  },
  media: {
    height: 150,
    transition: '.3s',
  },
  mediaBig: {
    height: 300,
    transition: '.3s',
  }
});

class Caroussel extends Component<{
  classes: any,
  pokemonName: string,
  sprites: Sprites},

  { imgBig: boolean}> {

  constructor(props: any) {
    super(props);

    this.state = { imgBig: false };
  }

  render() {
    const { classes } = this.props;
    const pokemonName: string = this.props.pokemonName;
    const sprites: Sprites = this.props.sprites;

    let firstSprite = sprites.front_default || sprites.front_female;

    if (!firstSprite) {
      Object
      .keys(sprites)
      .some((key: string) => {
        if (sprites[key]) {
          firstSprite = sprites[key];
          return true;
        }

        return false;
      });
    }

    if (!firstSprite) { return <span></span> }

    return (
      <CarousselContainer>
        <Card
          className={ this.state.imgBig ? classes.cardBig : classes.card }
          raised={true}
          square={true}
          onClick={() => { this.setState({ imgBig: !this.state.imgBig }) }}
        >
          <CardActionArea>
            <CardMedia
              className={ this.state.imgBig ? classes.mediaBig : classes.media }
              image={firstSprite}
              title={pokemonName}
            />
          </CardActionArea>
        </Card>
      </CarousselContainer>
    );
  }

  private nextImage(current: string) {
    const { sprites } = this.props;

    switch (current) {
      case sprites.back_default:
        return sprites.back_female;

      case sprites.back_female:
        return sprites.back_shiny;

      case sprites.back_shiny:
        return sprites.back_shiny_female;

      case sprites.back_shiny_female:
        return sprites.front_default;

      case sprites.front_default:
        return sprites.front_female;

      case sprites.front_female:
        return sprites.front_shiny;

      case sprites.front_shiny:
        return sprites.front_shiny_female;

      default:
        return sprites.back_default;
    }
  }

  private previousImage(current: string) {
    const { sprites } = this.props;

    switch (current) {
      case sprites.back_default:
        return sprites.front_shiny_female;

      case sprites.back_female:
        return sprites.back_default;

      case sprites.back_shiny:
        return sprites.back_female;

      case sprites.back_shiny_female:
        return sprites.back_shiny;

      case sprites.front_default:
        return sprites.back_shiny_female;

      case sprites.front_female:
        return sprites.front_default;

      case sprites.front_shiny:
        return sprites.front_female;

      default:
        return sprites.front_shiny;
    }
  }
}

export default withStyles(styles)(Caroussel);

const CarousselContainer = styled.div`
  display: flex;
  justify-content: center;

  margin-top: 30px;
  margin-bottom: 30px;

  white-space: nowrap;
`;
