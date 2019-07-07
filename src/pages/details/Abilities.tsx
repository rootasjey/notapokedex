import React  from 'react';
import styled from 'styled-components';

import { Chip, Typography } from '@material-ui/core';

import {
  withStyles, createStyles,
} from '@material-ui/core/styles';

const styles = () => createStyles({
  chip: {
    margin: '10px',
  },
});

function Abilities(props: any) {
  const classes = props.classes;
  const abilities: AbilityEntry[] = props.abilities;

  const items = abilities.map((entry, index) =>
    <Chip
      className={classes.chip}
      key={index}
      label={ entry.ability.name }
    />
  );

  return (
    <StyledContainer>
      <Typography variant="h3">
        Abilities
      </Typography>

      {items}
    </StyledContainer>
  )
}

export default withStyles(styles)(Abilities);

const StyledContainer = styled.div`
  margin: auto;
  text-align: center;
  padding-bottom: 20px;
`;
