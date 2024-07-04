import React, { Component } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/home";

type AppProps = {}; // Define if there are any props expected
type AppState = {}; // Define if the component has any state

class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
  }

  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<HomePage />} />  // Redirect all other routes to HomePage for now
        </Routes>
      </BrowserRouter>
    );
  }
}

export default App;