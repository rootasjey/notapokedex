import React, { Component } from "react";

import { observer }         from "mobx-react";
import { store }            from "../../store";

import {
  Typography,
  IconButton,
  StyleRulesCallback,
  Theme,
  withStyles,
  Tooltip,
} from "@material-ui/core";

import {
  Favorite,
  FavoriteBorderTwoTone,
} from '@material-ui/icons';

const styles: StyleRulesCallback = (theme: Theme) => ({
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
})

@observer
class Controversy extends Component<{ classes: any }, {}> {
  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    if (store.selectedPokemon.id > -1) {
      store.fetchControversy(store.selectedPokemon.id + 1);
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
