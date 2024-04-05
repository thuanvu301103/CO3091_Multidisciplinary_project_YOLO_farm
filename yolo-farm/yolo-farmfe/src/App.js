import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from './logo.svg';
import './App.css';
import { DetailPage } from './pages/detailPage/DetailPage'
import { HistoryPage } from "./pages/chartPage/HistoryPage";
import { DashboardPage } from './pages/dashboardPage/DashboardPage';
import { LoginPage } from './pages/loginPage/LoginPage';
import {TempSchedulePage} from './pages/schedulePage/tempSchedulePage/TempSchedulePage';
import { MidSchedulePage } from "./pages/schedulePage/midSchedulePage/MidSchedulePage";
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
        <Route path='/user/:userid/arealist' element={<DashboardPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/user/:userid/area/:areaid' element={<DetailPage/>}/>
        <Route path='/user/:userid/area/:areaid/history' element={<HistoryPage/>}/>
        <Route path='/tempschedule' element={<TempSchedulePage/>}/>
        <Route path='/midschedule' element={<MidSchedulePage/>}/>
      </Routes>
      {/* <DetailPage></DetailPage> */}
      {/* <HistoryPage></HistoryPage> */}
    </Router>
  );
}

export default App;