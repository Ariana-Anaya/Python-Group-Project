import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createReview, addReviewImage } from '../../redux/reviews';
import './ReviewForm.css';

function ReviewForm({ businessId, onClose, review = null, onSubmit = null }) {
  const dispatch = useDispatch();
  const [reviewText, setReviewText] = useState(review ? review.review : '');
  const [stars, setStars] = useState(review ? review.stars : 0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [imageInput, setImageInput] = useState('');

  const isEdit = !!review;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    if (!reviewText.trim()) {
      setErrors({ review: 'Review text is required' });
      setIsSubmitting(false);
      return;
    }

    if (stars < 1 || stars > 5) {
      setErrors({ stars: 'Please select a star rating' });
      setIsSubmitting(false);
      return;
    }

    const reviewData = {
      review: reviewText,
      stars: stars
    };

    try {
      let result;
      if (isEdit && onSubmit) {
        result = await onSubmit(reviewData);
      } else {
        result = await dispatch(createReview(businessId, reviewData));
      }

      if (result.errors) {
        setErrors(result.errors);
      } else {
        // Add images if this is a new review and images were provided
        if (!isEdit && imageUrls.length > 0) {
          for (const imageUrl of imageUrls) {
            await dispatch(addReviewImage(result.id, { url: imageUrl }));
          }
        }
        onClose();
      }
    } catch (error) {
      setErrors({ general: 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarClick = (rating) => {
    setStars(rating);
  };

  const handleStarHover = (rating) => {
    setHoveredStar(rating);
  };

  const handleStarLeave = () => {
    setHoveredStar(0);
  };

  const addImageUrl = () => {
    if (imageInput.trim() && imageUrls.length < 10) {
      const url = imageInput.trim();
      
      // Basic URL validation
      try {
        const urlObj = new URL(url);
        
        // Check if it's a valid HTTP/HTTPS URL
        if (!['http:', 'https:'].includes(urlObj.protocol)) {
          setErrors(prev => ({ ...prev, images: 'Please enter a valid HTTP or HTTPS URL' }));
          return;
        }
        
        // Very permissive validation - just check it's a URL and has some indication it might be an image
        const isLikelyImageUrl = 
          // Direct image file extensions
          url.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg|tiff|ico)(\?.*)?$/i) ||
          // Common image hosting domains
          url.match(/\b(imgur|cloudinary|unsplash|pexels|pixabay|freepik|shutterstock|getty|flickr|pinterest|instagram|facebook|twitter|googleapis|amazonaws|azure|github|discord|dropbox|box\.com|onedrive|google|apple|microsoft)\b/i) ||
          // URLs with image-related keywords
          url.match(/\b(image|img|photo|pic|picture|avatar|thumb|thumbnail|gallery|media)\b/i) ||
          // Query parameters that suggest images
          url.match(/[?&](w=|h=|width=|height=|size=|format=|quality=)/i) ||
          // Path segments that suggest images
          url.match(/\/(image|img|photo|pic|picture|avatar|thumb|thumbnail|gallery|media|upload|file|asset)\//i);
          
        if (isLikelyImageUrl) {
          setImageUrls([...imageUrls, url]);
          setImageInput('');
          setErrors(prev => ({ ...prev, images: '' }));
        } else {
          // More permissive - just warn but still allow
          setImageUrls([...imageUrls, url]);
          setImageInput('');
          setErrors(prev => ({ ...prev, images: '' }));
        }
      } catch (error) {
        setErrors(prev => ({ ...prev, images: 'Please enter a valid URL starting with http:// or https://' }));
      }
    } else if (imageUrls.length >= 10) {
      setErrors(prev => ({ ...prev, images: 'Maximum 10 images allowed' }));
    }
  };

  const removeImageUrl = (index) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  return (
    <div className="review-form-overlay">
      <div className="review-form-container">
        <div className="review-form-header">
          <h2>{isEdit ? 'Edit Review' : 'Write a Review'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="review-form">
          <div className="form-group">
            <label>Rating</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((rating) => (
                <span
                  key={rating}
                  className={`star ${rating <= (hoveredStar || stars) ? 'active' : ''}`}
                  onClick={() => handleStarClick(rating)}
                  onMouseEnter={() => handleStarHover(rating)}
                  onMouseLeave={handleStarLeave}
                >
                  ★
                </span>
              ))}
            </div>
            {errors.stars && <p className="error">{errors.stars}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="review-text">Review</label>
            <textarea
              id="review-text"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Tell others about your experience..."
              rows="6"
              maxLength="2000"
            />
            <div className="character-count">
              {reviewText.length}/2000 characters
            </div>
            {errors.review && <p className="error">{errors.review}</p>}
          </div>

          {!isEdit && (
            <div className="form-group">
              <label>Add Images (Optional)</label>
              <div className="image-input-section">
                <input
                  type="url"
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                  placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImageUrl())}
                />
                <button 
                  type="button" 
                  onClick={addImageUrl}
                  className="add-image-btn"
                  disabled={imageUrls.length >= 10}
                >
                  Add Image
                </button>
              </div>
              {errors.images && <p className="error">{errors.images}</p>}
              
              {imageUrls.length > 0 && (
                <div className="image-preview-section">
                  <p>{imageUrls.length}/10 images</p>
                  <div className="image-preview-grid">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="image-preview-item">
                        <img src={url} alt={`Preview ${index + 1}`} />
                        <button 
                          type="button"
                          className="remove-image-btn"
                          onClick={() => removeImageUrl(index)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {errors.general && <p className="error">{errors.general}</p>}

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="submit-btn">
              {isSubmitting ? 'Submitting...' : (isEdit ? 'Update Review' : 'Post Review')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReviewForm;