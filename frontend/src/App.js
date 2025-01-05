// import logo from './logo.svg';
import React, { useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { AuthContext } from "./authContext";
import AddCourse from "./components/add/addCourse/AddCourse";
import AddExam from "./components/add/addExam/AddExam";
import AddHw from "./components/add/addHw/AddHw";
import AddProblem from "./components/add/addProblem/AddProblem";
import AddStudent from "./components/add/addStudent/AddStudent";
import Course from "./components/course/Course";
import Courses from "./components/courses/Courses";
import EditCourse from "./components/editAndDelete/EditCourse";
import EditExam from "./components/editAndDelete/EditExam";
import EditHw from "./components/editAndDelete/EditHw";
import EditProblem from "./components/editAndDelete/editProblem/EditProblem";
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
            <Route path="/" element={<SignIn />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/course/:id" element={<Course />} />
            <Route path="/problemset" element={<ProblemSet />} />
            <Route path="/problemset/:id" element={<ProblemSet />} />
            <Route path="/problem/:id" element={<Problem />} />
            <Route path="/submissions" element={<UserSubmissions />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/addCourse" element={<AddCourse />} />
            <Route path="/addHw" element={<AddHw />} />
            <Route path="/addExam" element={<AddExam />} />
            <Route path="/addProblem" element={<AddProblem />} />
            <Route path="/addStudent" element={<AddStudent />} />
            <Route path="/editCourse" element={<EditCourse />} />
            <Route path="/editHw" element={<EditHw />} />
            <Route path="/editExam" element={<EditExam />} />
            <Route path="/editProblem" element={<EditProblem />} />
          </Routes>
        </Router>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
