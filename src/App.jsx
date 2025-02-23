import React from "react";
import "./App.css";
import UserMain from "./userlogin/userMain";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./homepage/home";
import Create from "./homepage/createpage/create";
import WindowSize from "./utils";

function App() {
  return (
    <WindowSize>
      <Router>
        <Routes>
          <Route path="/user/*" element={<UserMain />} />
          <Route path="/home/*" element={<Home />} />
        </Routes>
      </Router>
    </WindowSize>
  );
}

export default App;
