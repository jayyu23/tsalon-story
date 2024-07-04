import React, { Component } from "react";
import auth from "../auth/authhandler";
import NavBar from "../components/navbar";
import Sidebar from "../components/sidebar";
import TBookStore from "../components/tbookstore";
import Poster from "../components/poster";
import TBook from "../components/tbook";

class HomePage extends Component {
  constructor(props) {
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
