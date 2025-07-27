
function StarAndRating({ rating, setRating, disabled = false }) {
  const handleClick = (val) => {
    if (!disabled && setRating) setRating(val);
  };

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map(num => (
        <span
          key={num}
          className={`star ${rating >= num ? 'filled' : ''}`}
          onClick={() => handleClick(num)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default StarAndRating;
