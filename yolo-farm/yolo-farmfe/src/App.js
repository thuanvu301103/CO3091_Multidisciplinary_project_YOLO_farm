import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from './logo.svg';
import './App.css';

function App1() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}


function App() {
  const [message, setMessage] = useState("");
  useEffect(() => {
    axios
      .get("https://localhost:3000/temperature")
      .then((response) => {
        setMessage(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  return (
    <div>
      <h1>{message}</h1>
    </div>
  );
}

export default App;
