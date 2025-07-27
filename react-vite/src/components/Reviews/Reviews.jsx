import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBusinessReviews, createReview, removeReview } from '../../redux/review';
import StarAndRating from './StarAndRating';

function Reviews({ businessId }) {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const reviewsObj = useSelector(state => state.reviews);
  const reviews = Object.values(reviewsObj).filter(r => r.businessId === businessId);

  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchBusinessReviews(businessId));
  }, [dispatch, businessId]);

  const hasUserReviewed = reviews.some(r => r.userId === sessionUser?.id);
  const canPostReview = sessionUser && !hasUserReviewed;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const newReview = {
      comment: reviewText,
      rating: rating
    };

    try {
      await dispatch(createReview(businessId, newReview));
      setReviewText('');
      setRating(0);
    } catch (res) {
      const data = await res.json();
      if (data?.errors) setErrors(data.errors);
    }
  };

  const handleDelete = async (reviewId) => {
    await dispatch(removeReview(reviewId));
  };

  return (
    <div className="reviews-container">
      <h2>Customer Reviews</h2>

      {canPostReview && (
        <form onSubmit={handleSubmit} className="review-form">
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Leave your review..."
            required
          />
          <StarAndRating rating={rating} setRating={setRating} />
          {errors.comment && <p className="error">{errors.comment}</p>}
          {errors.rating && <p className="error">{errors.rating}</p>}
          <button type="submit">Post Review</button>
        </form>
      )}

      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map((review) => (
          <div key={review.id} className="review-tile">
            <h4>{review.User?.username}</h4>
            <StarAndRating rating={review.rating} disabled />
            <p>{review.comment}</p>
            {sessionUser?.id === review.userId && (
              <button onClick={() => handleDelete(review.id)}>Delete</button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Reviews;
