import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import { Web3ContextProvider } from './hooks/Web3ContextProvider';

class App extends Component {
  render() {
    return (
      <Web3ContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"  element={<Home />}/>
        </Routes>
      </BrowserRouter>
      </Web3ContextProvider>
    );
  }
}

export default App;