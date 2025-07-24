// Action Types
const LOAD_BUSINESSES = 'businesses/LOAD';
const LOAD_ONE = 'businesses/LOAD_ONE';
const ADD_BUSINESS = 'businesses/ADD';
const UPDATE_BUSINESS = 'businesses/UPDATE';
const DELETE_BUSINESS = 'businesses/DELETE';

// Action Creators
const loadBusinesses = (businesses) => ({ type: LOAD_BUSINESSES, businesses });
const loadOne = (businessId) => ({ type: LOAD_ONE, businessId });
const addBusiness = (business) => ({ type: ADD_BUSINESS, business });
const updateBusiness = (businessId) => ({ type: UPDATE_BUSINESS, businessId });
const deleteBusiness = () => ({ type: DELETE_BUSINESS });

// Thunks
export const fetchBusinesses = () => async (dispatch) => {
  const res = await fetch('/api/businesses/');
  if (res.ok) {
    const data = await res.json();
    dispatch(loadBusinesses(data.businesses));
  }
  else if (res.status < 500) {
    const errorMessages = await res.json();
    return errorMessages;
  } 
};

export const fetchBusiness = (businessId) => async (dispatch) => {
  const res = await fetch(`/api/businesses/${businessId}`);
  if (res.ok) {
    const data = await res.json();
    dispatch(loadOne(data));
    return res;
  }
};

export const createBusiness = (business) => async (dispatch) => {
  const res = await fetch('/api/businesses/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(business),
  });
  if (res.ok) {
    const data = await res.json();
    dispatch(addBusiness(data));
    return data;
  }
};

export const editBusiness = (id, business) => async (dispatch) => {
  const res = await fetch(`/api/businesses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(business),
  });
  if (res.ok) {
    const data = await res.json();
    dispatch(updateBusiness(data));
    return data;
  }
};

export const removeBusiness = (id) => async (dispatch) => {
  const res = await fetch(`/api/businesses/${id}`, { method: 'DELETE' });
  if (res.ok) {
    dispatch(deleteBusiness(id));
  }
};

// Reducer
const initialState = {};

export default function businessesReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_BUSINESSES: {
      // const all = {};
      const newState = {...state, Businesses: action.businesses}
      // action.businesses.users?.forEach((biz) => { all[biz.id] = biz; });
      // return { ...state, all };
      return newState;
      }
    case LOAD_ONE:
      return { ...state, ...action.businessId };
    case ADD_BUSINESS:
      return { ...state, all: { ...state.all, [action.business.id]: action.business } };
    case UPDATE_BUSINESS:
      return { ...state, all: { ...state.all, [action.business.id]: action.business } };
    case DELETE_BUSINESS:
      const newAll = { ...state.all };
      delete newAll[action.id];
      return { ...state, all: newAll };
    default:
      return state;
  }
}