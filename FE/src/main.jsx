import React from 'react'
import reactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorPage from './components/ErrorPage.jsx'
import CategoryPage from './page/category/CategoryPage.jsx'
import Search from './page/Search.jsx'
import{
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './page/home/Home.jsx';
import SingleProduct from './page/products/SingleProduct.jsx'
import Recipes from './page/products/Recipes.jsx'
import About from './page/about/About.jsx'
import Contact from './page/contact/Contact.jsx'
import Login from './page/client/Login.jsx'
import SignUp from './page/client/SignUp.jsx'
import Profile from './page/client/Profile.jsx'
import CreateProduct from './page/products/CreateProduct.jsx'
import SearchByCreated from './page/SearchByCreated.jsx';
import ForgotPassword from './page/client/ForgotPassword.jsx'
import ResetPassword from './page/client/ResetPassword.jsx'
import Admin from './page/admin/Admin.jsx'
import UsersManager from './page/admin/UserManager.jsx'
import EditApprovedItem from './page/products/EditApprovedItem.jsx'



const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/signup',
    element: <SignUp />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/forgotpassword',
    element: <ForgotPassword />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/reset-password/:token',
    element: <ResetPassword />,
    errorElement: <ErrorPage />,
  },
  {
    path : "/",
    element: <App/>,
    errorElement: <ErrorPage/>,
    children: [
      {
        path: "/",
        element: <Home/>,
      },
      {
        path: "/home",
        element: <Home/>,
      },
      {
        path: "/categories/:category",
        element: <CategoryPage/>,
      },
      {
        path: "/search",
        element: <Search/>,
      },
      {
        path: "/item/:id",
        element: <SingleProduct/>,
        loader: ({params}) => fetch(`http://localhost:5000/api/items/${params.id}`)
      },
      {
        path:"/recipes",
        element:<Recipes/>,
      },
      {
        path:"/about",
        element:<About/>,
      },
      {
        path:"/contact",
        element:<Contact/>,
      },
      {
        path:"/profile",
        element:<Profile/>,
      },
      {
        path:"/create",
        element:<CreateProduct/>,
      },
      {
        path:"/adminprod",
        element:<Admin/>,
      },
      {
        path:"/usermanager",
        element:<UsersManager/>,
      },
      {
        path:"/admin/edit/:id",
        element:<EditApprovedItem/>,
      }
    ]
  },
]);

reactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router={router}/>
) 
