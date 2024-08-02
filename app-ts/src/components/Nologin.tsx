import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/Navbar";

const ErrorNoLogin: React.FC = () => {
  const navigate = useNavigate();
  const imgUrl = "/assets/cafedeflore.jpg";

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 1);

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, [navigate]);

  return (
    <div/>
  );
};

export default ErrorNoLogin;