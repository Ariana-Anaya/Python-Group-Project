import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBusinessReviews, createReview, removeReview, editReview } from '../../redux/review';
import StarAndRating from './StarAndRating';

function Reviews({ businessId }) {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const reviewsObj = useSelector(state => state.reviews);
  const reviews = Object.values(reviewsObj).filter(r => r.businessId === businessId);

  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [errors, setErrors] = useState({});
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editText, setEditText] = useState('');  
  const [editRating, setEditRating] = useState(0); 

  useEffect(() => {
    dispatch(fetchBusinessReviews(businessId));
  }, [dispatch, businessId]);

  const hasUserReviewed = reviews.some(r => r.userId === sessionUser?.id);
  const canPostReview = sessionUser && !hasUserReviewed;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const newReview = {
      content: reviewText,
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
  const handleEditClick = (review) => {
    setEditingReviewId(review.id);
    setEditText(review.content);
    setEditRating(review.rating);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const updatedReview = {
        content: editText,
      rating: editRating
    };
    const res = await dispatch(editReview(editingReviewId, updatedReview));
    if (!res.errors) {
      setEditingReviewId(null);
    } else {
      setErrors(res.errors);
    }
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
          {errors.content && <p className="error">{errors.content}</p>}
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
                {editingReviewId === review.id ? (
              <form onSubmit={handleEditSubmit} className="edit-review-form">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  required
                />
                <StarAndRating rating={editRating} setRating={setEditRating} />
                {errors.content && <p className="error">{errors.content}</p>}
                {errors.rating && <p className="error">{errors.rating}</p>}
                <button type="submit">Save</button>
                <button type="button" onClick={() => setEditingReviewId(null)}>Cancel</button>
              </form>
            ) : (
              <>
            <StarAndRating rating={review.rating} disabled />
                <p>{review.content}</p>
              </>
            )}

            {sessionUser?.id === review.userId && editingReviewId !== review.id && (
              <>
                <button onClick={() => handleEditClick(review)}>Edit</button>
                <button onClick={() => handleDelete(review.id)}>Delete</button>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Reviews;
