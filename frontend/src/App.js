import "./App.css";
import React from "react";
import ProfilePage from "./Pages/ProfilePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SpecializationPathsPage from "./Pages/Admin/SpecializationPathsPage";
import Header from "./Components/Header";
import Courses from "./Pages/Admin/Courses";
// import { useSelector } from "react-redux";
function App() {
  // const {details,loading,error} = useSelector((state)=>({
  //   details:state.studentDetails.details,
  //   laoding:state.studentDetails.loading,
  //   error:state.studentDetails.error
  // }))
  const studentPages = ["profile", "maps", "specialization paths", "logout"];
  const studentLinks = {
    "profile": "/student/profile",
    "specialization paths": "/student/spPaths",
    "maps": "/student/maps",
  };
  const adminPages = ["courses", "specialization paths", "logout"];
  const adminLinks = {
    "courses": "/admin/courses",
    "specialization paths": "/admin/spPaths",
  };
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/student"  element={<Header pages={studentPages} tos={studentLinks}/>}>
            <Route path="profile" element={<ProfilePage />} />
            <Route path="spPaths" element={<SpecializationPathsPage />} />
          </Route>
          <Route path="/admin" element={<Header pages={adminPages} tos={adminLinks}/>}>
            <Route path="courses" element={<Courses/>} />
            <Route path="spPaths" element={<SpecializationPathsPage/>} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
