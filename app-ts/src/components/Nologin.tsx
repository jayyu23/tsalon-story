import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/Navbar";

const ErrorNoLogin: React.FC = () => {
  const navigate = useNavigate();
  const imgUrl = "/assets/cafedeflore.jpg";

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 10);

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, [navigate]);

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
              Error - Not Logged In
            </h1>
            <h5 className="mb-4">You must be logged in to view this data</h5>
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

export default ErrorNoLogin;