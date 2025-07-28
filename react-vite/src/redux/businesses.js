// Action Types
const LOAD_BUSINESSES = 'businesses/LOAD';
const LOAD_ONE = 'businesses/LOAD_ONE';
const LOAD_USER_BUSINESSES = 'businesses/LOAD_USER';
const ADD_BUSINESS = 'businesses/ADD';
const UPDATE_BUSINESS = 'businesses/UPDATE';
const DELETE_BUSINESS = 'businesses/DELETE';

// Action Creators
const loadBusinesses = (businesses) => ({ type: LOAD_BUSINESSES, businesses });
const loadOne = (business) => ({ type: LOAD_ONE, business });
const loadUserBusinesses = (businesses) => ({ type: LOAD_USER_BUSINESSES, businesses });
const addBusiness = (business) => ({ type: ADD_BUSINESS, business });
const updateBusiness = (business) => ({ type: UPDATE_BUSINESS, business });const deleteBusinessAction = (id) => ({ type: DELETE_BUSINESS, id });

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

export const fetchUserBusinesses = (ownerId) => async (dispatch) => {
  const res = await fetch(`/api/${ownerId}/businesses/`);
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
  const res = await fetch(`/api/businesses/${businessId}`, {
    credentials: 'include',
});
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

export const deleteBusiness = (id) => async (dispatch) => {
  const res = await fetch(`/api/businesses/${id}`, { method: 'DELETE' });
  if (res.ok) {
    dispatch(deleteBusinessAction(id));
  }
};

// Reducer
const initialState = { all: {} };

export default function businessesReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_BUSINESSES: {
      const all = {};
      action.businesses.forEach((biz) => { all[biz.id] = biz; });
      return { ...state, all };
    }
    case LOAD_ONE:
  return { ...state, single: action.business };
    case ADD_BUSINESS:
      return { ...state, all: { ...state.all, [action.business.id]: action.business } };
    case UPDATE_BUSINESS:
      return { ...state, all: { ...state.all, [action.business.id]: action.business } };
    case DELETE_BUSINESS: {
      const newAll = { ...state.all };
      delete newAll[action.id];
      return { ...state, all: newAll };
    }
    default:
      return state;
  }
}