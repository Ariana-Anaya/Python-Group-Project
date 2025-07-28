import { createBrowserRouter, Outlet } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';
import BusinessList from '../components/Businesses/BusinessList';
import BusinessDetail from '../components/Businesses/BusinessDetail';
import ManageBusinesses from '../components/ManageBusinesses/ManageBusinesses';
import BusinessForm from '../components/Businesses/BusinessForm';


//import BusinessList from '../components/BusinessList/BusinessList';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <BusinessList />, 
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
        path: "businesses/:id",
        element: <Outlet />,
        children: [
          {
            index: true,
            element: <BusinessDetail />,
          },
        ]
      },
      {
        path: "manage-businesses/:id",
        element: <Outlet />,
        children: [
          {
            index: true,
            element: <ManageBusinesses />,
          },
        ]
      },
      {  
        path: "manage-businesses/new",
        element: <BusinessForm isEdit={false} />,
      },
      {
        path: "manage-businesses/:id/edit",
        element: <BusinessForm isEdit={true} />,
    },
    ],
  },
]);