import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import BusinessList from '../components/BusinessList';
import BusinessDetails from '../components/BusinessDetails';
import BusinessForm from '../components/BusinessForm';
import BusinessManagement from '../components/BusinessManagement';
import ReviewForm from '../components/ReviewForm';
import ReviewManagement from '../components/Review Management';
import Layout from './Layout';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <BusinessList />,
      },
      {
        path: "/businesses/:businessId",
        element: <BusinessDetails />,
      },
      {
        path: "/businesses/new",
        element: <BusinessForm />,
      },
      {
        path: "/review/new",
        element: <ReviewForm />,
      },
      {
        path: "/businesses/manage",
        element: <BusinessManagement />,
      },
      {
        path: "/reviews/manage",
        element: <ReviewManagement />,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
    ],
  },
]);