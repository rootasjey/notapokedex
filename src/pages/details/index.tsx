import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

import React, { Component } from "react";
import { store }            from '../../store';
import styled               from "styled-components";

import PokeCard             from './PokeCard';

library.add(faArrowAltCircleLeft);

export default class Details extends Component {
  constructor(props: any) {
    super(props);

    // Auto-redirect if pokedex is empty
    if (store.list.length === 0) {
      this.goBack();
    }
  }

  goBack() {
    const props: any = this.props;
    props.history.push('/');
  }

  render() {
    const props: any = this.props;
    const id = props.match.params.id;

    return (
      <CenteredDiv>
        <div onClick={() => this.goBack()}>
          <StyledFontAwesomeIcon icon="arrow-alt-circle-left" size="2x" />
        </div>

        <PokeCard id={id} />
      </CenteredDiv>
    );
  }
}

const CenteredDiv = styled.div`
  margin: auto;
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  padding: 10px;
  cursor: pointer;
  transition: .5s;

  &:hover {
    transform: rotate(360deg);
    transition: .5s;
  }
`;
