import React from 'react';

interface PosterProps {}

const Poster: React.FC<PosterProps> = (props) => {
  const imgUrl = "/assets/cafedeflore_dark.jpg";
  const logoURL = "/assets/logo_circle.png";

  return (
    <div>
      <div
        className="mt-0 p-0 justify-content-center pb-3"
        style={{
          backgroundImage: `url(${imgUrl})`,
          backgroundSize: "cover",
          height: window.innerHeight,
        }}
      >
        <div className="w-100 justify-content-center text-center">
          <img src={logoURL} alt="Logo" />
        </div>
        <h1 className="text-white text-center mt-0" style={{ fontSize: 65 }}>
          TSalon
        </h1>
        <div className="justify-content-center text-center mt-2 mb-3">
          <a
            href="https://trapezoidal-nephew-39b.notion.site/TSalon-Whitepaper-9d27f5c901bc4dcaa53bace710421fce"
            target="_blank"
            className="btn btn-outline-light mx-2 px-0 text-center"
            style={{ borderRadius: 100, width: 60 }}
            rel="noopener noreferrer"
          >
            <i
              className="fa-solid fa-file-lines"
              style={{ fontSize: 18, width: 25 }}
            ></i>
          </a>
          <a
            href="https://discord.gg/jABTq5RPNC"
            className="btn btn-outline-light mx-2 px-0 justify-content-center text-center"
            style={{ borderRadius: 100, width: 60 }}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i
              className="fa-brands fa-discord text-center mx-0 justify-content-center"
              style={{ fontSize: 18, width: 35 }}
            ></i>
          </a>
        </div>

        <p
          className="subheading mt-3 pt-3 text-white text-center"
          style={{ fontSize: 24, fontFamily: "Avenir" }}
        >
          A Web 3.0 Publishing House
        </p>

        <div className="justify-content-center text-center pb-5">
          <a
            href="#store"
            className="btn btn-success ml-5 px-5"
            style={{
              fontSize: 28,
              fontFamily: "Avenir",
              borderRadius: 100,
            }}
          >
            Explore
            <i
              className="fa fa-arrow-right px-2 mb-auto"
              style={{ fontSize: 18 }}
            ></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Poster;