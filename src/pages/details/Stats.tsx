import React  from 'react';
import styled from 'styled-components';

export function Stats(props: any) {
  const stats: StatEntry[] = props.stats;

  const items = stats.map((statEntry, index) =>
    <StatLine key={index}>
      <div>{statEntry.stat.name}: </div>

      <BackgroundRect>
        <ForegroundRect>
          <div>{statEntry.base_stat}</div>
        </ForegroundRect>
      </BackgroundRect>
    </StatLine>
  );

  return <StatsContainer>{items}</StatsContainer>
}

const BackgroundRect = styled.div`
  background-color: rgba(0, 0, 0, .3);
  color: white;
  line-height: 20px;
  padding: 5px;
  width: 40%;
  height: 20px;
`;

const ForegroundRect = styled(BackgroundRect)`
  margin-left: -5px;
  margin-top: -5px;
  width: 50%;
  background-color: #badc58;
`;

const StatsContainer = styled.div`
  max-width: 50%;
  margin: auto;
  margin-top: 50px;
  padding-bottom: 60px;
`;

const StatLine = styled.div`
  display: flex;
  padding: 5px;
  justify-content: space-between;
  cursor: pointer;
  transition: .3s;

  &:hover {
    transform: scale(1.1);
    transition: .3s;
  }
`;
