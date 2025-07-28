import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBusiness, deleteBusiness } from '../../redux/businesses';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const BusinessDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const business = useSelector(state => state.businesses.single);

  useEffect(() => {
    dispatch(fetchBusiness(id));
  }, [dispatch, id]);

  if (!business) return <div>Loading...</div>;

  const handleDelete = () => {
    dispatch(deleteBusiness(business.id));
    navigate('/'); 
  };

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
      <button onClick={() => navigate(`/manage-businesses/${business.id}/edit`)}>Edit</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default BusinessDetail;