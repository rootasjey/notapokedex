import React, { Component } from "react";

import { store } from '../store';
import PokeCard from './PokeCard';
import styled from "styled-components";

const CenteredDiv = styled.div`
  margin: auto;
  width: 60%;
`;

export default class Details extends Component {
  constructor(props: any) {
    super(props);

    // Auto-redirect if pokedex is empty
    if (store.list.length === 0) {
      const props: any = this.props;
      props.history.push('/');
    }
  }

  render() {
    const props: any = this.props;
    const id = props.match.params.id;

    return (
      <CenteredDiv>
        <PokeCard id={id} />
      </CenteredDiv>
    );
  }
}