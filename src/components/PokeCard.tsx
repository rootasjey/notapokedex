import React, { Component } from "react";

import {
  DocumentCard,
  DocumentCardActivity,
  DocumentCardPreview,
  DocumentCardTitle,
  IDocumentCardPreviewProps
 } from 'office-ui-fabric-react/lib/DocumentCard';

 import { ImageFit } from 'office-ui-fabric-react/lib/Image';

export default class PokeCard extends Component {
  render() {
    const previewProps: IDocumentCardPreviewProps = {
      previewImages: [
        {
          previewIconProps: {
            iconName: 'OpenFile',
            styles: {
              root: {
                fontSize: 42,
                color: '#ffffff',
              }
            }
          },
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
            <DocumentCardTitle title="Pokemon's name" />
            <DocumentCardActivity
              activity="Created a few minutes agoo"
              people={[{ name: 'Sasha', profileImageSrc: '' }]} />
          </div>
        </DocumentCard>
      </div>
    )
  }
}