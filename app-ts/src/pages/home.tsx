import React, { Component } from "react";
import NavBar from "../components/navbar";

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
      </div>
    );
  }
}

export default HomePage;