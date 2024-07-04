import React, { Component } from "react";
import NavBar from "../components/navbar";

function Error404() {
  const imgUrl = "/assets/cafedeflore.jpg";
  return (
    <div className="my-0 py-0">
      <NavBar />
      <div
        className="bg img-fluid"
        style={{
          backgroundImage: `url(${imgUrl})`,
          height: "100vh",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container d-flex align-items-center justify-content-center text-center h-100">
          <div className="text-white">
            <h1 className="h1 mb-3" style={{ fontSize: 80 }}>
              Error 404
            </h1>
            <h5 className="mb-4">Page Not Found</h5>
            <a
              className="btn btn-primary my-3"
              href="/"
              style={{ borderRadius: 25 }}
            >
              Return Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Error404;
