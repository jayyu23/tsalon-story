import React from "react";
import NavBar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import UserCollection from "../components/Collection";
import AuthWrapper from "../components/AuthWrapper";

const PrivateShelf: React.FC = () => {
  const username = JSON.parse(window.sessionStorage.session).address; // Read this from sessionStorage

  return (
    <AuthWrapper>
      <div className="vw-100 vh-100 d-flex flex-column">
        <NavBar />
        <div className="d-flex flex-grow-1">
          <div className="d-flex flex-column">
            <Sidebar initialActiveItem="Collections" />
          </div>
          <div className="flex-grow-1 d-flex flex-column my-0 h-100">
            <UserCollection username={username != null ? username : ""} disableLoad={true} />
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
};

export default PrivateShelf;