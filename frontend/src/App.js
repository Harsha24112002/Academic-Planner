import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Components/Header';
import ProfilePage from './Pages/ProfilePage';
import CourseList from './Components/CourseList';
import { Provider } from 'react-redux';
import store from './store';


function App() {

  return (
    <Provider store={store}>
      <div className="App">
        <ProfilePage />
      </div>
    </Provider>
  );
}

export default App;
