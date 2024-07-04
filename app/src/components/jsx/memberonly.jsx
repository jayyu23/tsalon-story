import React, { useState, useEffect } from "react";
import axios from "axios";
import auth from "../../auth/authhandler";
import NavBar from "../components/navbar";
import Sidebar from "../components/sidebar";
import TBookView from "../components/tbookview";
import endpoints from "../../auth/endpoints";
import { extend } from "lodash";

function MemberOnly(props) {
  const logoURL = "/assets/logo_circle.png";
  return (
    <div
      className="container h-100 mx-0 px-0 mt-3 w-100"
      style={{ minHeight: 800 }}
    >
      <NavBar />
      <div className="row h-100 w-100">
        <div className="col-md-3 col-xs-12">
          <Sidebar active={props.active || -1} />
        </div>
        <div
          className="col-xs-12 col-md-9 my-0 justify-content-center "
          style={{ minHeight: window.innerHeight }}
        >
          <div className="justify-content-center text-center m-5">
            <img src={logoURL} alt="" />
          </div>
          <h1 className="my-3 pt-5 text-center">Salonite Only Access</h1>
          <p
            className="subheading mt-5 pt-3 text-center"
            style={{ fontSize: 36, fontFamily: "Avenir" }}
          >
            Collect a TBook to become a Salonite
          </p>

          <div className="justify-content-center text-center pb-5">
            <a
              href="/#store"
              className="btn btn-success ml-5 px-5"
              style={{
                fontSize: 28,
                fontFamily: "Avenir",
                borderRadius: 100,
              }}
            >
              Explore
              <i
                className="fa fa-arrow-right px-2"
                style={{ fontSize: 25 }}
              ></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemberOnly;
