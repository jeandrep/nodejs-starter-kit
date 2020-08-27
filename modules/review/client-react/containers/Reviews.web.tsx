import React, { useEffect } from 'react';

import { compose } from '@gqlapp/core-common';
import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';

import ReviewsView from '../components/ReviewsView';
import { withReviews, withReviewsDeleting, subscribeToReviews } from './ReviewOperations';

export interface Reviews {
  totalCount: number;
  edges: [ReviewEdges];
  pageInfo: ReviewPageInfo;
}
interface ReviewPageInfo {
  endCursor: number;
  hasNextPage: boolean;
}
interface ReviewEdges {
  node: Review;
  cursor: number;
}
export interface Review {
  id: number;
  user: {
    id: number;
    username: string;
  };
  rating: string;
  feedback: string;
  isActive: boolean;
  // reviewImages: [ReviewImage]
  createdAt: string;
  updatedAt: string;
}

export interface ReviewProps {
  subscribeToMore: () => object;
  updateQuery: () => object;
  t: TranslateFunction;
  filter: object;
}

const Review: React.FC<ReviewProps> = props => {
  const { subscribeToMore } = props;

  useEffect(() => {
    const subscribe = subscribeToReviews(subscribeToMore);
    return () => subscribe();
  });

  console.log('props', props);
  return <ReviewsView {...props} />;
};

export interface DeleteReview {
  modalId: number;
  reviewId: number;
  modal: string;
}

export default compose(withReviews, withReviewsDeleting, translate('Review'))(Review);
