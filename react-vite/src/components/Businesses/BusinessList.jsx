import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBusinesses } from '../../redux/businesses';

const BusinessList = () => {
  const dispatch = useDispatch();
  // const businesses = useSelector(state => state.businesses.Businesses);
  const businesses = useSelector(state => Object.values(state.businesses.all));

  useEffect(() => {
    dispatch(fetchBusinesses());
  }, [dispatch]);

  if (businesses) {
  return (
    <div>
      <h2>All Businesses</h2>
      <ul>
        {businesses.map(biz => (
          <li key={biz.id}>
            <h3>{biz.name}</h3>
            <p>{biz.description}</p>
            <p>{biz.city}, {biz.state}</p>
            <p>Category: {biz.category}</p>
            <p>Price: {biz.price}</p>
          </li>
        ))}
      </ul>
    </div>
    );
  };
  return (
    <div>
      <h2>No Businesses Found...</h2>
    </div>
  );  
}

export default BusinessList;