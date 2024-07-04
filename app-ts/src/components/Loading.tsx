import React from "react";

const Loading: React.FC = () => {
  const imgUrl = "/assets/cafedeflore.jpg";
  const logoURL = "/assets/logo_circle.png";

  return (
    <div className="m-0 p-0">
      <div
        className="vh-100 mt-0 p-0 justify-content-center pb-3"
        style={{ backgroundImage: `url(${imgUrl})` }}
      >
        <div className="w-100 justify-content-center text-center mt-5 pt-5">
          <img src={logoURL} alt="Logo" />
        </div>
        <h1 className="text-white text-center mt-0" style={{ fontSize: 80 }}>
          TSalon
        </h1>
        <p
          className="subheading my-4 text-white text-center"
          style={{ fontSize: 36, fontFamily: "Avenir" }}
        >
          Loading data from the blockchain...
        </p>
      </div>
    </div>
  );
}

export default Loading;