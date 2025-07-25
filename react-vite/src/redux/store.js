import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
  combineReducers,
} from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
<<<<<<< HEAD
import businessesReducer from "./businesses"; 


=======
import businessesReducer from "./businesses";
import reviewsReducer from "./reviews";
>>>>>>> a548618ee835d60267971d6f951d94ff6385005c

const rootReducer = combineReducers({
  session: sessionReducer,
  businesses: businessesReducer,
<<<<<<< HEAD
=======
  reviews: reviewsReducer,
>>>>>>> a548618ee835d60267971d6f951d94ff6385005c
});

let enhancer;
if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
