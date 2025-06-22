import logo from "./logo.svg";
import "./App.css";
import HomePage from "./pages/HomePage";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import { Routes, Route } from "react-router-dom";
import CourseCreate from "./components/Creation/CourseCreate";

import CourseListInstructor from "./components/LIstcourseinstr/CourseListInstructor";

import CourseListStudent from "./components/Listcourse/CourseListStudent";
import Mycourses from "./components/Cart/Mycourses";
function App() {
  return (
    <div className="App">
      <Routes>
        {/* Default page */}
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<CourseCreate />} />
        {/* <Route
          path="/stucourse"
          element={<CourseListStudent></CourseListStudent>}
        /> */}
        <Route
          path="/inscourse"
          element={<CourseListInstructor></CourseListInstructor>}
        />
        <Route path="/list" element={<CourseListStudent></CourseListStudent>} />
        <Route path="/enrolled-courses" element={<Mycourses></Mycourses>} />
      </Routes>
    </div>
  );
}

export default App;
