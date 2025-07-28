// Action Types
const LOAD_BUSINESS_REVIEWS = 'reviews/LOAD_BUSINESS_REVIEWS';
const LOAD_USER_REVIEWS = 'reviews/LOAD_USER_REVIEWS';
const LOAD_REVIEW_DETAILS = 'reviews/LOAD_REVIEW_DETAILS';
const ADD_REVIEW = 'reviews/ADD_REVIEW';
const UPDATE_REVIEW = 'reviews/UPDATE_REVIEW';
const DELETE_REVIEW = 'reviews/DELETE_REVIEW';
const CLEAR_REVIEWS = 'reviews/CLEAR_REVIEWS';

// Action Creators
const loadBusinessReviews = (businessId, reviews) => ({
  type: LOAD_BUSINESS_REVIEWS,
  businessId,
  reviews
});

const loadUserReviews = (reviews) => ({
  type: LOAD_USER_REVIEWS,
  reviews
});

const loadReviewDetails = (review) => ({
  type: LOAD_REVIEW_DETAILS,
  review
});

const addReview = (review) => ({
  type: ADD_REVIEW,
  review
});

const updateReview = (review) => ({
  type: UPDATE_REVIEW,
  review
});

const deleteReview = (reviewId) => ({
  type: DELETE_REVIEW,
  reviewId
});

export const clearReviews = () => ({
  type: CLEAR_REVIEWS
});

// Thunks
export const fetchBusinessReviews = (businessId) => async (dispatch) => {
  const response = await fetch(`/api/businesses/${businessId}/reviews`);
  
  if (response.ok) {
    const data = await response.json();
    dispatch(loadBusinessReviews(businessId, data.Reviews));
    return data;
  }
};

export const fetchUserReviews = (userId) => async (dispatch) => {
  const response = await fetch(`/api/users/${userId}/reviews`);
  
  if (response.ok) {
    const data = await response.json();
    dispatch(loadUserReviews(data.Reviews));
    return data;
  }
};

export const fetchReviewDetails = (reviewId) => async (dispatch) => {
  const response = await fetch(`/api/reviews/${reviewId}`);
  
  if (response.ok) {
    const review = await response.json();
    dispatch(loadReviewDetails(review));
    return review;
  }
};

export const createReview = (businessId, reviewData) => async (dispatch) => {
  const response = await fetch(`/api/businesses/${businessId}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reviewData)
  });
  
  if (response.ok) {
    const review = await response.json();
    dispatch(addReview(review));
    return review;
  } else {
    const errors = await response.json();
    return { errors };
  }
};

export const editReview = (reviewId, reviewData) => async (dispatch) => {
  const response = await fetch(`/api/reviews/${reviewId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reviewData)
  });
  
  if (response.ok) {
    const review = await response.json();
    dispatch(updateReview(review));
    return review;
  } else {
    const errors = await response.json();
    return { errors };
  }
};

export const removeReview = (reviewId) => async (dispatch) => {
  const response = await fetch(`/api/reviews/${reviewId}`, {
    method: 'DELETE'
  });
  
  if (response.ok) {
    dispatch(deleteReview(reviewId));
    return { message: 'Successfully deleted' };
  }
};

export const addReviewImage = (reviewId, imageData) => async () => {
  const response = await fetch(`/api/reviews/${reviewId}/images`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(imageData)
  });
  
  if (response.ok) {
    const image = await response.json();
    return image;
  } else {
    const errors = await response.json();
    return { errors };
  }
};

// Initial State
const initialState = {
  businessReviews: {},
  userReviews: {},
  singleReview: {}
};

// Reducer
const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_BUSINESS_REVIEWS: {
      const businessReviews = {};
      action.reviews.forEach(review => {
        businessReviews[review.id] = review;
      });
      return {
        ...state,
        businessReviews: {
          ...state.businessReviews,
          [action.businessId]: businessReviews
        }
      };
    }
      
    case LOAD_USER_REVIEWS: {
      const userReviews = {};
      action.reviews.forEach(review => {
        userReviews[review.id] = review;
      });
      return {
        ...state,
        userReviews
      };
    }
      
    case LOAD_REVIEW_DETAILS:
      return {
        ...state,
        singleReview: { [action.review.id]: action.review }
      };
      
    case ADD_REVIEW: {
      const businessId = action.review.businessId;
      return {
        ...state,
        businessReviews: {
          ...state.businessReviews,
          [businessId]: {
            ...state.businessReviews[businessId],
            [action.review.id]: action.review
          }
        },
        userReviews: {
          ...state.userReviews,
          [action.review.id]: action.review
        }
      };
    }
      
    case UPDATE_REVIEW: {
      const updatedBusinessId = action.review.businessId;
      return {
        ...state,
        businessReviews: {
          ...state.businessReviews,
          [updatedBusinessId]: {
            ...state.businessReviews[updatedBusinessId],
            [action.review.id]: action.review
          }
        },
        userReviews: {
          ...state.userReviews,
          [action.review.id]: action.review
        },
        singleReview: {
          [action.review.id]: action.review
        }
      };
    }
      
    case DELETE_REVIEW: {
      const newBusinessReviews = { ...state.businessReviews };
      const newUserReviews = { ...state.userReviews };
      const newSingleReview = { ...state.singleReview };
      
      // Remove from all business review collections
      Object.keys(newBusinessReviews).forEach(businessId => {
        if (newBusinessReviews[businessId][action.reviewId]) {
          delete newBusinessReviews[businessId][action.reviewId];
        }
      });
      
      delete newUserReviews[action.reviewId];
      delete newSingleReview[action.reviewId];
      
      return {
        ...state,
        businessReviews: newBusinessReviews,
        userReviews: newUserReviews,
        singleReview: newSingleReview
      };
    }
      
    case CLEAR_REVIEWS:
      return initialState;
      
    default:
      return state;
  }
};

export default reviewsReducer;