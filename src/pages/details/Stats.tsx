import React, { Component }   from 'react';
import styled                 from 'styled-components';

import { TooltipHost } from 'office-ui-fabric-react/lib/Tooltip';

import {
  autorun,
  IReactionDisposer }         from 'mobx';
import { observer }           from 'mobx-react';
import { store }              from '../../store';

import { getBgColor }         from '../../utils/colors';
import { toPascalName }       from '../../utils/strings';

interface IProps {
  stats: StatEntry[];
}

@observer
export default class Stats extends Component<IProps, {}> {
  private disposer: IReactionDisposer;

  constructor(props: IProps) {
    super(props);

    this.disposer = autorun(() => {
      if (store.selectedPokemon.types.length > 0 &&
          store.selectedPokemon.types[0].type.name.length > 0) {

          store.fetchAverageStats(store.selectedPokemon.types);
      }
    });
  }

  componentWillUnmount() {
    this.disposer();
  }

  public render() {
    const stats: StatEntry[] = this.props.stats;

    const orderedStats = stats.map((statEntry) => {
      const name        = statEntry.stat.name.replace('-', ' ');
      const pascalName  = toPascalName(statEntry.stat.name);
      const value       = statEntry.base_stat;
      const avg         = store.avgStats[pascalName];

      return { avg, name, value };
    })
    .sort((stat1, stat2) => {
      if (stat1.name < stat2.name) {
        return -1;
      }

      if (stat1.name > stat2.name) {
        return 1;
      }

      return 0;
    });

    const items = orderedStats.map((stat, index) => {
      const percent = Math.floor(stat.value * 100 / stat.avg);
      const bgColor = getBgColor(percent);

      const ariaDescPercent = `tooltip-${stat.name}-${index}`;
      const ariaDescAvg = `tooltip-avg-${stat.name}`;

      const ForegroundRect = styled(StyledBackgroundRect)`
        margin-top: -5px;
        margin-left: -5px;
        width: ${percent}%;
        background-color: ${bgColor};
        transition: .3s;

        &:hover {
          transform: scale(1.1);
          transition: .3s;
        }
      `;

      return (
        <StyledStatLine key={index}>
          <StyledStatName>{stat.name}: </StyledStatName>

          <StyledBackgroundRect>
            <TooltipHost content={`${percent}% from average`} id={ariaDescPercent} >
              <ForegroundRect aria-describedby={ariaDescPercent}>
                <div>{stat.value}</div>
              </ForegroundRect>
            </TooltipHost>
          </StyledBackgroundRect>

          <TooltipHost content={`Average ${stat.name}`} id={ariaDescAvg} >
            <StyledStatAvg aria-describedby={ariaDescAvg}>
              { stat.avg }
            </StyledStatAvg>
          </TooltipHost>
        </StyledStatLine>
      );
    }
    );

    return <StyledStatsContainer>{items}</StyledStatsContainer>
  }
}

const StyledBackgroundRect = styled.div`
  cursor: pointer;
  background-color: rgba(0, 0, 0, .3);
  color: white;
  line-height: 20px;
  padding: 5px;
  width: 30%;
  height: 20px;

  transition: .3;
`;

const StyledStatsContainer = styled.div`
  max-width: 70%;
  margin: auto;
  margin-top: 50px;
  padding-bottom: 60px;
`;

const StyledStatName = styled.div`
  width: 130px;
`;

const StyledStatAvg = styled.div`
  padding-left: 40px;
`;

const StyledStatLine = styled.div`
  display: flex;
  padding: 5px;
  justify-content: space-between;
  transition: .3s;
`;
