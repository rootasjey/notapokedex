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

  &.electric {
    background-color: #f1c40f;
  }

  &.grass {
    background-color: #1abc9c;
  }

  &.ground {
    background-color: #795548;
  }

  &.fire {
    background-color: #e74c3c;
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

  &.rock {
    background-color: #9E9E9E;
  }
`;

const PokeTypeContainer = styled.div`
  display: flex;
  justify-content: center;
`;
