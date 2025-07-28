import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Provider as ReduxProvider, useDispatch } from "react-redux";
import { RouterProvider } from "react-router-dom";
import configureStore from "./redux/store";
import { router } from "./router";
import * as sessionActions from "./redux/session";
import "./index.css";

const store = configureStore();

if (import.meta.env.MODE !== "production") {
  window.store = store;
  window.sessionActions = sessionActions;
}

// SessionRestore component to dispatch thunkAuthenticate on app load
function SessionRestore({ children }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(sessionActions.thunkAuthenticate());
  }, [dispatch]);
  return children;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <SessionRestore>
        <RouterProvider router={router} />
      </SessionRestore>
    </ReduxProvider>
  </React.StrictMode>
);