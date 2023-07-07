import React, { useState, useEffect } from 'react';
import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';

import Login from './components/Login';
import Page404 from './components/Page404';
import Dashboard from './components/Dashboard';
import Detail from './components/Detail';
import Service from './components/Service';
import Insert from './components/Insert';
import Manage from './components/Manage';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const setAuth = (boolean) => {
    setIsAuthenticated(boolean)
  }
  async function isAuth() {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/is-verify`, {
        method: "GET",
        headers: { token: localStorage.token }
      });

      const parseRes = await response.json();
      if (parseRes === true) {
        setAuth(true);
      } else {
        setAuth(false);
      }

    } catch (error) {
      console.error(error.message);
    }
  }

  useEffect(() => {
    isAuth();
  });




  return (
    <>
      <Routes>
        <Route path="/" Component={
          props => !isAuthenticated ?
            (<Navigate to="/dang-nhap" />) :
            (<Dashboard {...props} setAuth={setAuth} />)
        } />
        <Route path="/dang-nhap" Component={
          props => !isAuthenticated ?
            (<Login {...props} setAuth={setAuth} />) :
            (
              <Navigate to="/" />
            )
        } />
        <Route path="/chi-tiet/:id" Component={
          props => (<Detail {...props} setAuth={setAuth} />)
        } />

        <Route path="/services/:serviceID" Component={
          props => (<Service {...props} setAuth={setAuth} />)
        } />
        <Route path="/them-ke-hoach" Component={
          props => (<Insert {...props} setAuth={setAuth} />)
        } />
        <Route path="/quan-ly-nhan-vien" Component={
          props => (<Manage {...props} setAuth={setAuth} />)
        } />
        <Route path="*" element={<Page404 />} />
      </Routes>


    </>


  );
}

export default App;
