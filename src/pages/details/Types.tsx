import React    from 'react';
import styled   from 'styled-components';

import { Chip } from '@material-ui/core';

import {
  withStyles,
  createStyles,
} from '@material-ui/core/styles';

const styles = () => createStyles({
  chip: {
    margin: '5px',
  },

  bug: {
    backgroundColor: '#badc58',
  },

  dark: {
    backgroundColor: '#2C3A47',
  },

  dragon: {
    backgroundColor: '#3B3B98',
  },

  electric: {
    backgroundColor: '#f1c40f',
  },

  fairy: {
    backgroundColor: '#ff7979',
  },

  flying: {
    backgroundColor: '#00cec9',
  },

  fighting: {
    backgroundColor: '#c0392b',
  },

  fire: {
    backgroundColor: '#e74c3c',
  },

  ghost: {
    backgroundColor: '#182C61',
  },

  grass: {
    backgroundColor: '#1abc9c',
  },

  ground: {
    backgroundColor: '#795548',
  },

  ice: {
    backgroundColor: '#7ed6df',
  },

  insect: {
    backgroundColor: '#e67e22',
  },

  normal: {
    backgroundColor: '#bdc3c7',
  },

  poison: {
    backgroundColor: '#9b59b6',
  },

  psychic: {
    backgroundColor: '#FC427B',
  },

  rock: {
    backgroundColor: '#9E9E9E',
  },

  steel: {
    backgroundColor: '#7f8fa6',
  },

  water: {
    backgroundColor: '#686de0',
  },
});

function Types(props: any): JSX.Element {
  const types: TypeEntry[] = props.types;
  const classes = props.classes;

  const items = types.map((entry, index) =>
    <Chip
      className={`${classes.chip} ${classes[entry.type.name]}`}
      color="secondary"
      key={index}
      label={entry.type.name}
    />
  );

  return (
    <PokeTypeContainer>
      {items}
    </PokeTypeContainer>
  );
}

export default withStyles(styles)(Types);

const PokeTypeContainer = styled.div`
  display: flex;
  justify-content: center;

  margin-top: 20px;
`;
