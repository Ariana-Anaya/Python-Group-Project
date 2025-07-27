import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBusinessReviews } from '../../redux/review';

function ReviewList({ businessId }) {
    const dispatch = useDispatch();

    const reviewsObj = useSelector(state => state.reviews.businessReviews[businessId] || {});
    const reviews = Object.values(reviewsObj);
    const isLoading = reviews.length === 0;
    useEffect(() => {
        dispatch(fetchBusinessReviews(businessId));
      }, [dispatch, businessId]);
      return (
        <div>
          <h2>All Reviews</h2>
    
          {isLoading ? (
            <p>Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p>No reviews found for this business.</p>
          ) : (
            <ul>
              {reviews.map(review => (
                <li key={review.id}>
                  <p><strong>{review.User.username}</strong> says:</p>

                  <p>{review.content}</p>
                  <p>Rating: {review.rating} / 5</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    }
    
    export default ReviewList;