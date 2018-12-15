import React  from 'react';
import styled from 'styled-components';

export function Types(props: any): JSX.Element {
  const types: TypeEntry[] = props.types;

  const items = types.map((entry, index) =>
    <PokeType key={index} className={entry.type.name}>
      {entry.type.name}
    </PokeType>
  );

  return <PokeTypeContainer>
    {items}
  </PokeTypeContainer>;
}

const PokeType = styled.div`
  background-color: white;
  color: white;
  display: inline-block;
  font-weight: bold;
  margin: 15px;
  padding: 10px;
  transition: .5s;

  &:hover {
    transform: scale(1.1);
    transition: .5s;
  }

  &.bug {
    background-color: #badc58;
  }

  &.dark {
    background-color: #2C3A47;
  }

  &.dragon {
    background-color: #3B3B98;
  }

  &.electric {
    background-color: #f1c40f;
  }

  &.fairy {
    background-color: #ff7979;
  }

  &.flying {
    background-color: #c7ecee;
  }

  &.fighting {
    background-color: #c0392b;
  }

  &.fire {
    background-color: #e74c3c;
  }

  &.ghost {
    background-color: #182C61;
  }

  &.grass {
    background-color: #1abc9c;
  }

  &.ground {
    background-color: #795548;
  }

  &.ice {
    background-color: #7ed6df;
  }

  &.insect {
    background-color: #e67e22;
  }

  &.normal {
    background-color: #bdc3c7;
  }

  &.poison {
    background-color: #9b59b6;
  }

  &.psychic {
    background-color: #FC427B;
  }

  &.rock {
    background-color: #9E9E9E;
  }

  &.water {
    background-color: #686de0;
  }
`;

const PokeTypeContainer = styled.div`
  display: flex;
  justify-content: center;
`;
