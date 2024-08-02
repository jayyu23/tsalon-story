import React from "react";
import NavBar from "../components/Navbar";

const Error404: React.FC = () => {
  const imgUrl = "/assets/cafedeflore.jpg";
  return (
    <div className="vw-100 vh-100 d-flex flex-column">
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
};

export default Error404;