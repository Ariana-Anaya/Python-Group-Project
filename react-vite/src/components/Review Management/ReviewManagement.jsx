import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserReviews, removeReview } from '../../redux/reviews';
import './ReviewManagement.css';

function ReviewManagement() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.session.user);
  const userReviews = useSelector(state => state.reviews.userReviews);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadReviews = async () => {
      try {
        await dispatch(fetchUserReviews(user.id));
      } catch (error) {
        console.error('Error loading reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [dispatch, user, navigate]);

  const handleDeleteReview = async (reviewId) => {
    try {
      await dispatch(removeReview(reviewId));
      setDeleteModal(null);
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const reviews = Object.values(userReviews || {});

  if (!user) return null;

  if (loading) {
    return (
      <div className="review-management-container">
        <p>Loading your reviews...</p>
      </div>
    );
  }

  return (
    <div className="review-management-container">
      <div className="management-header">
        <h1>My Reviews</h1>
        <p>Manage and edit your posted reviews</p>
      </div>

      {reviews.length === 0 ? (
        <div className="no-reviews">
          <h3>You haven't written any reviews yet</h3>
          <p>Find a business to review and share your experience.</p>
          <button className="btn-primary" onClick={() => navigate('/businesses')}>
            Explore Businesses
          </button>
        </div>
      ) : (
        <div className="reviews-grid">
          {reviews.map(review => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <h3>{review.businessName}</h3>
                <span className="review-date">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="review-rating">
                ⭐ {review.stars} / 5
              </div>

              <p className="review-body">
                {review.review}
              </p>

              <div className="review-actions">
                <button 
                  className="btn-edit"
                  onClick={() => navigate(`/reviews/${review.id}/edit`)}
                >
                  Edit
                </button>
                <button 
                  className="btn-delete"
                  onClick={() => setDeleteModal(review)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteModal && (
        <div className="modal-overlay" onClick={() => setDeleteModal(null)}>
          <div className="delete-modal" onClick={e => e.stopPropagation()}>
            <h3>Delete Review</h3>
            <p>
              Are you sure you want to delete your review for 
              "{deleteModal.businessName}"? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button 
                className="btn-secondary"
                onClick={() => setDeleteModal(null)}
              >
                Cancel
              </button>
              <button 
                className="btn-delete"
                onClick={() => handleDeleteReview(deleteModal.id)}
              >
                Delete Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewManagement;
