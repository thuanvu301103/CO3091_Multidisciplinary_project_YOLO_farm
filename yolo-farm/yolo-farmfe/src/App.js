import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from './logo.svg';
import './App.css';
import { DetailPage } from './pages/detailPage/DetailPage'
import { DashboardPage } from './pages/dashboardPage/DashboardPage';
import { LoginPage } from './pages/loginPage/LoginPage';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
  Routes
} from "react-router-dom";

function App() {
  /*
  const [message, setMessage] = useState("");
  useEffect(() => {
    axios
      .get("http://127.0.0.1:3000/envsense/user/65f0529c5933e074166715a5/plantarea/65f0529c5933e074166715a8")
      .then((response) => {
        setMessage(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  */
  return (
    <Router>
      <Routes>
        <Route path='/user/:userid/area/list' element={<DashboardPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/user/:userid/area/:areaid' element={<DetailPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
