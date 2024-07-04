import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/"  element={<Home />}/>
        </Routes>
      </BrowserRouter>
    );
  }
}

export default App;