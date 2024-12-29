// import logo from './logo.svg';
import React, { useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { AuthContext } from "./authContext";
import Course from "./components/course/Course";
import Courses from "./components/courses/Courses";
import NavBar from "./components/navbar/Navbar";
import Problem from "./components/problem/Problem";
import ProblemSet from "./components/problemset/Problemset";
import SignIn from "./components/signin/SignIn";
import SignUp from "./components/signup/SignUp";
import UserSubmissions from "./components/userSubmissions/UserSubmissions";

function App() {
  const [login, setLogin] = useState(false);

  return (
    <AuthContext.Provider value={{ login, setLogin }}>
      <div style={{ backgroundColor: "#E9E9E9", height: "100%" }}>
        <Router>
          <NavBar />
          <Routes basename="/">
            <Route path="/" element={<Courses />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="course/:id" element={<Course />} />
            <Route path="/problemset" element={<ProblemSet />} />
            <Route path="/problemset/:id" element={<ProblemSet />} />
            <Route path="/problem/:id" element={<Problem />} />
            <Route path="/submissions" element={<UserSubmissions />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </Router>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
