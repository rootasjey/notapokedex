import React, { Component, FormEvent }  from "react";
import { TextField }                    from 'office-ui-fabric-react/lib/TextField';
import PokeList                         from './PokeList';
import { store }                        from '../store';
import styled                           from 'styled-components';

const StyledField = styled(TextField)`
  margin: auto;
  width: 200px;
`;

const StyledHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

export default class Home extends Component {
  componentDidMount() {
    store.fetchPokedex();
  }

  search(e: FormEvent, newValue?: string) {
    store.setSearchInput(newValue ? newValue : '');
  }

  render() {
    return (
      <div>
        <StyledHeader>
          <h1>Catch Them All !</h1>
          <StyledField placeholder='Search a Pokémon' onChange={(e, newValue) => this.search(e, newValue) } />
        </StyledHeader>

        <PokeList />
      </div>
    );
  }
}
