import React from "react";
import auth from "../auth/authhandler";
import NavBar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import UserCollection from "../components/Collection";
import AuthWrapper from "../components/AuthWrapper";

const PrivateShelf: React.FC = () => {
  const username = auth.getUsername();

  return (
    <AuthWrapper>
      <div className="container h-100 mx-0 px-0 mt-3 w-100">
        <NavBar />
        <div className="row h-100 w-100">
          <div className="col-md-3 col-xs-12">
            <Sidebar active={1} />
          </div>
          <div
            className="col-xs-12 col-md-9 m-0 p-0"
            style={{ minHeight: window.innerHeight }}
          >
            <UserCollection username={username} disableLoad={true} />
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
};

export default PrivateShelf;