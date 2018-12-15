import React  from 'react';
import styled from 'styled-components';

export function Abilities(props: any) {
  const abilities: AbilityEntry[] = props.abilities;

  const items = abilities.map((entry, index) =>
    <div key={index}>
      {entry.ability.name}
    </div>
  );

  return (
    <StyledContainer>
      <h2>abilities</h2>
      {items}
    </StyledContainer>
  )
}

const StyledContainer = styled.div`
  margin: auto;
  text-align: center;
  padding-bottom: 20px;
`;
