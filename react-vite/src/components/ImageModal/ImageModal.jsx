import { useState } from 'react';
import './ImageModal.css';

function ImageModal({ images, isOpen, onClose, initialIndex = 0 }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  if (!isOpen || !images || images.length === 0) {
    return null;
  }

  const currentImage = images[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
  };

  const goToNext = () => {
    setCurrentIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="image-modal-overlay" onClick={handleBackdropClick}>
      <div className="image-modal-content">
        <button className="close-modal-btn" onClick={onClose}>
          ✕
        </button>
        
        <div className="image-container">
          <img 
            src={currentImage.url} 
            alt="Business" 
            className="modal-image"
          />
          
          {images.length > 1 && (
            <>
              <button className="nav-btn prev-btn" onClick={goToPrevious}>
                ‹
              </button>
              <button className="nav-btn next-btn" onClick={goToNext}>
                ›
              </button>
            </>
          )}
        </div>
        
        {images.length > 1 && (
          <div className="image-indicators">
            {images.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        )}
        
        <div className="image-info">
          <p>{currentIndex + 1} of {images.length}</p>
          {currentImage.preview && (
            <span className="preview-badge">Preview Image</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageModal;