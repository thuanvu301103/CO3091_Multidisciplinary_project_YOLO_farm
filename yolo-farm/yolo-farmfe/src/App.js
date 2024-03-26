import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from './logo.svg';
import './App.css';
import {DetailPage} from './pages/detailPage/DetailPage'
import { HistoryPage } from "./pages/chartPage/HistoryPage";


function App() {
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
  return (
    <div>
      {/* <DetailPage></DetailPage> */}
      <HistoryPage></HistoryPage>
    </div>
  );
}

export default App;
