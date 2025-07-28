// Action Types
const LOAD_BUSINESSES = 'businesses/LOAD_BUSINESSES';
const LOAD_BUSINESS_DETAILS = 'businesses/LOAD_BUSINESS_DETAILS';
const LOAD_CURRENT_USER_BUSINESSES = 'businesses/LOAD_CURRENT_USER_BUSINESSES';
const LOAD_USER_BUSINESSES = 'businesses/LOAD_USER';
const ADD_BUSINESS = 'businesses/ADD_BUSINESS';
const UPDATE_BUSINESS = 'businesses/UPDATE_BUSINESS';
const DELETE_BUSINESS = 'businesses/DELETE_BUSINESS';
const CLEAR_BUSINESSES = 'businesses/CLEAR_BUSINESSES';

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

export const createBusiness = (businessData) => async (dispatch) => {
  const response = await fetch('/api/businesses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(businessData)
  });
  
  if (response.ok) {
    const business = await response.json();
    dispatch(addBusiness(business));
    return business;
  } else {
    const errors = await response.json();
    return { errors };
  }
};

export const editBusiness = (businessId, businessData) => async (dispatch) => {
  const response = await fetch(`/api/businesses/${businessId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(businessData)
  });
  
  if (response.ok) {
    const business = await response.json();
    dispatch(updateBusiness(business));
    return business;
  } else {
    const errors = await response.json();
    return { errors };
  }
};

export const deleteBusiness = (id) => async (dispatch) => {
  const res = await fetch(`/api/businesses/${id}`, { method: 'DELETE' });
  if (res.ok) {
    dispatch(deleteBusinessAction(id));
  }
};

// Reducer
const businessesReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_BUSINESSES: {
      const allBusinesses = {};
      action.businesses.forEach(business => {
        allBusinesses[business.id] = business;
      });
      return {
        ...state,
        allBusinesses,
        page: action.page,
        size: action.size
      };
    }
    case LOAD_ONE:
  return { ...state, single: action.business };
    case ADD_BUSINESS:
      return {
        ...state,
        allBusinesses: {
          ...state.allBusinesses,
          [action.business.id]: action.business
        },
        userBusinesses: {
          ...state.userBusinesses,
          [action.business.id]: action.business
        }
      };
      
    case UPDATE_BUSINESS:
      return {
        ...state,
        allBusinesses: {
          ...state.allBusinesses,
          [action.business.id]: action.business
        },
        userBusinesses: {
          ...state.userBusinesses,
          [action.business.id]: action.business
        },
        singleBusiness: {
          [action.business.id]: action.business
        }
      };
      
    case DELETE_BUSINESS: {
      const newAllBusinesses = { ...state.allBusinesses };
      const newUserBusinesses = { ...state.userBusinesses };
      const newSingleBusiness = { ...state.singleBusiness };
      
      delete newAllBusinesses[action.businessId];
      delete newUserBusinesses[action.businessId];
      delete newSingleBusiness[action.businessId];
      
      return {
        ...state,
        allBusinesses: newAllBusinesses,
        userBusinesses: newUserBusinesses,
        singleBusiness: newSingleBusiness
      };
    }
      
    case CLEAR_BUSINESSES:
      return initialState;
      
    default:
      return state;
  }
};

export default businessesReducer;