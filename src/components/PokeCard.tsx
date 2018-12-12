import React, { Component } from "react";
import { store } from '../store';
import { observer } from "mobx-react";
import { ImageFit } from 'office-ui-fabric-react/lib/Image';

import {
  DocumentCard,
  DocumentCardActivity,
  DocumentCardPreview,
  DocumentCardTitle,
  IDocumentCardPreviewProps
 } from 'office-ui-fabric-react/lib/DocumentCard';

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

    const previewProps: IDocumentCardPreviewProps = {
      previewImages: [
        {
          previewImageSrc: pokemon.sprites.front_default,
          imageFit: ImageFit.cover,
          width: 318,
          height: 196
        }
      ]
    }

    return(
      <div>
        <DocumentCard>
          <DocumentCardPreview {...previewProps} />
          <div>
            <DocumentCardTitle title={pokemon.name} />
            <DocumentCardActivity
              activity={pokemon.types[0].type.name}
              people={[{ name: 'Loading...', profileImageSrc: '' }]} />
          </div>
        </DocumentCard>
      </div>
    )
  }
}
