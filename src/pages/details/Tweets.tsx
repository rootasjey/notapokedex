import React, { Component } from "react";
import { observer }         from "mobx-react";
import { store }            from "../../store";

import styled               from "styled-components";
import TwitterSVGColor      from '../../assets/TwitterLogoColor.svg';


import {
  DocumentCard,
  DocumentCardTitle,
  DocumentCardActivity,
  IDocumentCardPreviewProps,
  DocumentCardPreview,

} from 'office-ui-fabric-react/lib/DocumentCard';

import { ImageFit } from "office-ui-fabric-react/lib/Image";

const previewPropsUsingIcon: IDocumentCardPreviewProps = {
  previewImages: [
    {
      previewImageSrc: TwitterSVGColor,
      imageFit: ImageFit.center,
      width: 288,
      height: 196
    }
  ]
}

@observer
export default class Tweets extends Component {
  constructor(props: any) {
    super(props);
  }

  public componentDidMount() {
    if (store.selectedPokemon.name.length > 0) {
      store.fetchTweets(store.selectedPokemon.name);
    }
  }

  render() {
    const tweetsArray = store.tweets.map((tweet, index) =>
      <StyledDcoumentCard onClickHref={`https://twitter.com/statuses/${tweet.id_str}`} key={index} >
        <DocumentCardPreview {...previewPropsUsingIcon} />

        <div>
          <DocumentCardTitle
            title={tweet.text}
            shouldTruncate={false}
          />

          <DocumentCardTitle
            title={ new Date(tweet.created_at).toLocaleString() }
            shouldTruncate={ false }
            showAsSecondaryTitle={ true } />
        </div>

        <DocumentCardActivity
          activity={ `@${tweet.user.screen_name}` }
          people={[
            {
              name: `${ tweet.user.name }`,
              profileImageSrc: `${ tweet.user.profile_image_url }`
            }
          ]}
        />
      </StyledDcoumentCard>
    );

    return (
      <StyledContainer>
        { tweetsArray }
      </StyledContainer>
    )
  }
}

const StyledContainer = styled.div`
  display: flex;
  overflow-x: scroll;

  padding-bottom: 50px;
`;

const StyledDcoumentCard = styled(DocumentCard)`
  margin-right: 10px;
  padding: 15px;

  min-width: initial !important;
`;
