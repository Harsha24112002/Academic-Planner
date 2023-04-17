import "./App.css";
import React from "react";
import StudentRoutes from "./Routes/StudentRoutes";
import AdminRoutes from "./Routes/AdminRoutes";
import AuthRoutes from "./Routes/AuthRoutes";
import { useSelector } from 'react-redux';
import { selectIsSignedIn, selectUserRole } from './features/auth/authSlice';

function App() {
  // const {details,loading,error} = useSelector((state)=>({
  //   details:state.studentDetails.details,
  //   laoding:state.studentDetails.loading,
  //   error:state.studentDetails.error
  // }))

  const isSignedIn = useSelector(selectIsSignedIn);
  const userRole = useSelector(selectUserRole);

  if (isSignedIn) {
    if (userRole == "student") {
      return <StudentRoutes />;
    } else if (userRole == "admin") {
      return <AdminRoutes />;
    } else {
      return <React.Fragment>Some error occured while accesing role of user!</React.Fragment>
    }
  }

  return <AuthRoutes/>;
}

export default App;
