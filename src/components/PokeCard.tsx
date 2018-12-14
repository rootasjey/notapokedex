import React, { Component }             from "react";
import { store }                        from '../store';
import { observer }                     from "mobx-react";
import { IImageProps, Image, ImageFit } from 'office-ui-fabric-react/lib/Image';
import styled                           from "styled-components";

const CarousselContainer = styled.div`
  overflow-x: scroll;
  white-space: nowrap;
  background-color: #95a5a6;
`;

const PageTitle = styled.h1`
  text-align: center;
`;

const PageSubTitle = styled.h1`
  text-align: center;
  font-size: 2em;
`;

const StyledImage = styled(Image)`
  background-color: #95a5a6;
  display: inline-block;
  margin: 5px 5px;
  cursor: pointer;
  transition: .5s;

  &:hover {
    background-color: #7f8c8d;
    transition: .5s;
  }
`;

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

 export interface ICardProps {
   id: number;
 }

@observer
export default class PokeCard extends Component<ICardProps, {}> {
  constructor(props: ICardProps) {
    super(props);
  }

  public componentDidMount() {
    store.fetchPokemon(this.props.id);
  }

  render() {
    const pokemon = store.selectedItem;

    return(
      <div>
        <PageTitle>{ pokemon.name }</PageTitle>
        <PageSubTitle>#{ pokemon.id }</PageSubTitle>

        <Caroussel
          pokemonName={pokemon.name}
          sprites={pokemon.sprites}
        />

        <PokeTypeList types={pokemon.types} />

        <ListStats stats={pokemon.stats} />
      </div>
    )
  }
}

function Caroussel(props?: any): JSX.Element {
  const pokemonName: string = props.pokemonName;
  const sprites: Sprites = props.sprites;
  const items: any[] = [];

  const imageProps: Partial<IImageProps> = {
    imageFit: ImageFit.centerCover,
    width: 200,
    height: 200,
  };

  for (const [key, val] of Object.entries(sprites)) {
    if (!val) { continue; }

    items.push(
      <StyledImage
        key={key}
        {...imageProps}
        src={val}
        alt={pokemonName}
      />
    );
  }

  return (
    <CarousselContainer>
      {items}
    </CarousselContainer>
  );
}

function PokeTypeList(props: any): JSX.Element {
  const types: TypeEntry[] = props.types;

  const items = types.map((entry, index) =>
    <PokeType key={index} className={entry.type.name}>
      { entry.type.name }
    </PokeType>
  );

  return <PokeTypeContainer>
    { items }
  </PokeTypeContainer>;
}

function ListStats(props: any) {
  const stats: StatEntry[] = props.stats;

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

  const items = stats.map((statEntry, index) =>
    <StatLine key={index}>
      <div>{ statEntry.stat.name }: </div>

      <BackgroundRect>
        <ForegroundRect>
          <div>{ statEntry.base_stat }</div>
        </ForegroundRect>
      </BackgroundRect>
    </StatLine>
  );

  return <StatsContainer>{ items }</StatsContainer>
}
