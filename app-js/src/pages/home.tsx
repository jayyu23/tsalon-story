import React, { Component } from "react";
import NavBar from "../components/navbar";
import Poster from "../components/poster";
import TBookStore from "../components/tbookstore";

// Define Props and State types if needed
type HomePageProps = {};
type HomePageState = {};

class HomePage extends Component<HomePageProps, HomePageState> {
  constructor(props: HomePageProps) {
    super(props);
  }

  render() {
    return (
      <div className="App container-flex d-col">
        <NavBar className="my-0" showImage="true" />
        <Poster />
        <div id="store" className="my-5 pt-5">
          <TBookStore />
        </div>
      </div>
    );
  }
}

export default HomePage;