import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBusiness } from '../../redux/businesses';
import { useParams } from 'react-router-dom';

const BusinessDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const business = useSelector(state => state.businesses.single);

  useEffect(() => {
    dispatch(fetchBusiness(id));
  }, [dispatch, id]);

  if (!business) return <div>Loading...</div>;

  return (
    <div>
      <h2>{business.name}</h2>
      <p>{business.description}</p>
      <p>
        {business.address}, {business.city}, {business.state}
      </p>
      <p>Category: {business.category}</p>
      <p>Price: {business.price}</p>
      <p>Owner ID: {business.owner_id}</p>
    </div>
  );
};

export default BusinessDetail;