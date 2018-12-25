import { IImageProps, Image, ImageFit } from 'office-ui-fabric-react/lib/Image';
import React                            from 'react';
import styled                           from 'styled-components';

export function Caroussel(props?: any): JSX.Element {
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

const CarousselContainer = styled.div`
  background-color: #95a5a6;
  display: flex;
  justify-content: center;

  overflow-x: scroll;
  white-space: nowrap;
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
