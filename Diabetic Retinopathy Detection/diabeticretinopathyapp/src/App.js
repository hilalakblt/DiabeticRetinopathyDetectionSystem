import React, {Component} from 'react';
import Particles from "react-tsparticles";
import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import NavBar from './components/Navigation/NavBar';
import Login from './components/Login/Login';
import Patients from './components/Pages/Patients';
import Detection from './components/Pages/Detection';
import Statistics from './components/Pages/Statistics';
import AddUser from './components/Pages/AddUser';
import Help from './components/Pages/Help';
import httpClient from './components/Login/httpClient';


const particleOptions = {
  fpsLimit: 150,
  particles: {
    color: {
      value: "#ffffff",
    },
    links: {
      color: "#ffffff",
      distance: 150,
      enable: true,
      opacity: 0.5,
    },
    move: {
      enable: true,
      speed: 2,
    },
    size: {
      value: 2,
    },
  },
}



function App() {


  const { token, removeToken, setToken } = httpClient();

    return (
      <div className="App"> 
        <Navigation />
        <Particles
          className = 'particles'
          options={particleOptions}
        />
          <div>
            <Router>
            <div>
              {!token && token!=="" &&token!== undefined
              ? <Login setToken={setToken} />
              : <div>
                  <NavBar token={removeToken} />
                  <Routes token={token} setToken={setToken}>
                    <Route index element={<Detection />} />
                    <Route path="/detection" element={<Detection />} />
                    <Route path="/patients" element={<Patients />}/>
                    <Route path="/statistics" element={<Statistics />}/>
                    <Route path="/addUser" element={<AddUser />}/>
                    <Route path="/help" element={<Help />}/>
                  </Routes>
                </div>
              }
              </div>
            </Router>
          </div>
      </div>

    );
}


export default App;
