import React from "react";
import { useParams } from "react-router-dom";
import TBookView from "../components/TBookView";
import NavBar from "../components/Navbar";

interface RouteParams {
  tbsn: string;
  [key: string]: string | undefined;
}

const TBookPub: React.FC = () => {
  const { tbsn } = useParams<RouteParams>();

  return (
    <div>
      <NavBar />
      <div className="container justify-content-center mt-5 pt-3">
        <TBookView tbsn={tbsn} />

        <span className="row px-5 justify-content-center mb-5">
          <a
            href="/"
            className="btn btn-lg btn-secondary mx-5 col-4 py-4"
            style={{ borderRadius: 25 }}
          >
            <i
              className="fa-solid fa-backward mx-2"
              style={{ fontSize: 20 }}
            ></i>
            Back
          </a>
          <a
            href={`/collect/${tbsn}`}
            className="btn btn-lg btn-warning col-4 py-4"
            style={{ borderRadius: 25 }}
          >
            <i
              className="fa-solid fa-book-bookmark mx-2"
              style={{ fontSize: 25 }}
            ></i>
            Collect
          </a>
        </span>
      </div>
    </div>
  );
};

export default TBookPub;