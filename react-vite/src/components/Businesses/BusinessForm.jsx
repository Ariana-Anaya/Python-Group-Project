import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBusiness, editBusiness, fetchBusiness } from '../../redux/businesses';
import { useNavigate, useParams } from 'react-router-dom';

const BusinessForm = ({ isEdit = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const business = useSelector(state => state.businesses.single);

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    address: '',
    city: '',
    state: '',
    price: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit && id) {
      dispatch(fetchBusiness(id));
    }
  }, [dispatch, isEdit, id]);

  useEffect(() => {
    if (isEdit && business) {
      setForm({
        name: business.name || '',
        description: business.description || '',
        category: business.category || '',
        address: business.address || '',
        city: business.city || '',
        state: business.state || '',
        price: business.price || ''
      });
    }
  }, [business, isEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    let result;
    if (isEdit) {
      result = await dispatch(editBusiness(id, form));
    } else {
      result = await dispatch(createBusiness(form));
    }
    if (result && !result.error) {
      navigate(`/businesses/${result.id}`);
    } else if (result && result.error) {
      setErrors(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{isEdit ? 'Edit Business' : 'Add Business'}</h2>
      {Object.values(errors).map((err, i) => (
        <div key={i} style={{ color: 'red' }}>{err}</div>
      ))}
      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        required
      />
      <input
        name="category"
        placeholder="Category"
        value={form.category}
        onChange={handleChange}
        required
      />
      <input
        name="address"
        placeholder="Address"
        value={form.address}
        onChange={handleChange}
        required
      />
      <input
        name="city"
        placeholder="City"
        value={form.city}
        onChange={handleChange}
        required
      />
      <input
        name="state"
        placeholder="State"
        value={form.state}
        onChange={handleChange}
        required
        maxLength={2}
      />
      <input
        name="price"
        type="number"
        placeholder="Price"
        value={form.price}
        onChange={handleChange}
        required
      />
      <button type="submit">{isEdit ? 'Update' : 'Create'}</button>
    </form>
  );
};

export default BusinessForm;