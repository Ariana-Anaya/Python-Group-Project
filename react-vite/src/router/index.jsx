import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';
<<<<<<< HEAD
import BusinessList from '../components/Businesses/BusinessList';

=======
import BusinessList from '../components/BusinessList/BusinessList';
>>>>>>> a548618ee835d60267971d6f951d94ff6385005c

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
<<<<<<< HEAD
        element: <BusinessList />, 
=======
        element: <BusinessList />,
>>>>>>> a548618ee835d60267971d6f951d94ff6385005c
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path: "businesses",
        element: <BusinessList />,
      }
    ],
  },
]);