import React, { Component } from "react";

import { observer }         from "mobx-react";
import { store }            from "../../store";

import {
  IReactionDisposer,
  autorun,
} from "mobx";

import {
  Typography,
  IconButton,
  withStyles,
  Tooltip,
  createStyles,
} from "@material-ui/core";

import {
  Favorite,
  FavoriteBorderTwoTone,
} from '@material-ui/icons';

const styles = () => createStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    margin: 30,
  },
  rootContent: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
});

@observer
class Controversy extends Component<{ classes: any }, {}> {
  private pokemonIdDisposer?: IReactionDisposer;

  componentDidMount() {
    this.pokemonIdDisposer = autorun(() => {
      const { id } = store.selectedPokemon;

      if (id > 0) {
        store.fetchControversy(store.selectedPokemon.id);

        if (this.pokemonIdDisposer) {
          this.pokemonIdDisposer();
        }
      }
    });
  }

  compononentWillUnmount() {
    if (this.pokemonIdDisposer) {
      this.pokemonIdDisposer();
    }
  }

  render() {
    const { classes } = this.props;

    if (store.controversy.id < 0) {
      return (
        <span></span>
      );
    }

    return (
      <div className={classes.root}>
        <Typography variant="h3">Controversy</Typography>

        <div className={classes.rootContent}>
          <div className={classes.column}>

            <Tooltip title="Like" placement="top">
              <IconButton onClick={ () => { this.like() }}>
                <Favorite color="secondary"/>
              </IconButton>
            </Tooltip>

            <Typography variant="h5">
              {store.controversy.likes}
            </Typography>

          </div>

          <div className={classes.column}>
            <Tooltip title="Dislike" placement="top">
              <IconButton onClick={ () => { this.dislike() }}>
                <FavoriteBorderTwoTone />
              </IconButton>
            </Tooltip>

            <Typography variant="h5">
              {store.controversy.dislikes}
            </Typography>

          </div>

        </div>
      </div>
    );
  }

  private like() {
    if (store.controversy.id < 0) { return; }
    store.like(store.controversy.id);
  }

  private dislike() {
    if (store.controversy.id < 0) { return; }
    store.dislike(store.controversy.id);
  }
}

export default withStyles(styles)(Controversy);
