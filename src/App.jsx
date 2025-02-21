import React from "react";
import "./App.css";
import UserMain from "./userlogin/userMain";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./homepage/home";
import Create from "./homepage/createpage/create";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/user/*" element={<UserMain />} />
        <Route path="/home/*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
