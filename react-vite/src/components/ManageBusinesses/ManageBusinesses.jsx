import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserBusinesses } from '../../redux/businesses';


const ManageBusinesses = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const businesses = useSelector(state => Object.values(state.businesses.all));
  const user = useSelector(state => state.session.user);
 
  useEffect(() => {
    if (user) {
      dispatch(fetchUserBusinesses(user.id));
    }
  }, [dispatch, user.id]);

  if (businesses && user) {
  return (
    <div className="business-list-container">
      <h1>{user.firstName} Businesses</h1>
      <ul className="business-cards">
        {businesses.map(biz => (
          <li className="business-card" key={biz.id} onClick={(e) => {
            e.stopPropagation();
            navigate(`/businesses/${biz.id}`)
          }}>
            <div className="business-info">
              <h3>{biz.name}</h3>
              <p>{biz.description}</p>
              <p className='business-location'>{biz.city}, {biz.state}</p>
              <p className='business-category'>Category: {biz.category}</p>
              <p className='business-price-range'>Price: {biz.price}</p>
              <p className='business-rating'>Rating: rating goes here</p>
              <p className='business-reviews'>Reviews: reviews go here</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
    );
  }
  return (
    <div className='loading-container'>
      <p>No Businesses Found...</p>
    </div>
  );  
}

export default ManageBusinesses;