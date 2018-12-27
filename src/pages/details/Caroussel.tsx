import React  from 'react';
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
    maxWidth: 345,
    minWidth: 150,
    padding: '10px',
  },
  media: {
    height: 140,
  },
});

function Caroussel(props?: any): JSX.Element {
  const { classes } = props;
  const pokemonName: string = props.pokemonName;
  const sprites: Sprites = props.sprites;
  const items: JSX.Element[] = [];

  for (const [key, val] of Object.entries(sprites)) {
    if (!val) { continue; }

    items.push(
      <Card className={classes.card} key={key} square={true} >
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image={val}
            title={pokemonName}
          />
        </CardActionArea>
      </Card>
    );
  }

  return (
    <CarousselContainer>
      {items}
    </CarousselContainer>
  );
}

export default withStyles(styles)(Caroussel);

const CarousselContainer = styled.div`
  background-color: rgba(0,0,0,0.3);
  display: flex;
  justify-content: center;

  margin-top: 30px;
  margin-bottom: 30px;

  overflow-x: scroll;
  white-space: nowrap;
`;
