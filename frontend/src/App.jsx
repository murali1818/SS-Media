import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/layouts/Header';
import Login from './components/layouts/Login';
import Admin from './components/Admin/Admin';
import React, {  } from 'react';
import Profile from './components/users/Profile';
import Home from './components/layouts/Home';
import './App.css'
import ForgotPassword from './components/layouts/ForgotPassword';
import ResetPassword from './components/layouts/ResetPassword';
import Mycourses from "./components/courses/Mycourses";
import MyCourse from './components/courses/Mycourse';
function App() {

  return (
    <> 
      <div className="App">
        <Router>
        <Header/>
          <Routes>
          <Route path='/' element={<Home/>}/>
            <Route path='/admin' element={<Admin></Admin>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/myprofile' element={<Profile/>} />
            <Route path="/forgotPassword" element={<ForgotPassword />} />
            <Route path="/password/reset/:token" element={<ResetPassword />} />
            <Route path='/course/:title/:id' element={<MyCourse></MyCourse>}/>
            <Route path='/mycourses' element={<Mycourses></Mycourses>}/>
            <Route path='/mycourse/:id' element={<MyCourse></MyCourse>}/>
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
