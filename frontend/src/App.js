import "./App.css";
import React from "react";
import ProfilePage from "./Pages/ProfilePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SpecializationPathsPage from "./Pages/SpecializationPathsPage";
import Header from "./Components/Header";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/spPaths" element={<SpecializationPathsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
