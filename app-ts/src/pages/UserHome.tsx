import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import AuthWrapper from "../components/ProtectedRoute";

const UserHome: React.FC = () => {
  const [stage1, setStage1] = useState([]);
  const [stage2, setStage2] = useState([]);

  const pageHTML = (
    <div className="h-100 w-100">
      <Navbar />
      <div className="container-fluid h-100 mx-0 px-0 w-100">
        <div className="row h-100 w-100 mx-0 px-0">
          <div className="col-md-3 col-xs-12 px-0 mx-0">
            <Sidebar initialActiveItem="Dashboard"/>
          </div>

          <div
            className="col-xs-12 col-md-9 my-0 "
            style={{ minHeight: window.innerHeight }}
          >
            <h1 className="my-5 pt-5 text-center">My Drafts</h1>

            <ul className="nav nav-pills nav-fill mb-5">
              <li className="nav-item">
                <a
                  id="t1"
                  className="nav-link active"
                  href="#"
                  // onClick={showTab1}
                >
                  {`Unpublished Drafts (${stage1.length})`}
                </a>
              </li>
              <li className="nav-item">
                <a id="t2" className="nav-link" href="#"
                  // onClick={showTab2}
                  >
                  {`Under Peer Review (${stage2.length})`}
                </a>
              </li>
            </ul>

            <span
              id="tab1"
              className="row mx-3 my-2 justify-content-center"
              style={{ display: "flex" }}
            >
              <div className="card mx-3" style={{ width: "25rem" }}>
                <h2 className="card-title text-center my-5"> New Draft </h2>
                <a
                  href="/editor"
                  onClick={() => {
                    sessionStorage.setItem("draftTBSN", "0");
                  }}
                >
                  <i
                    className="card-img-top fa fa-light fa-pen-to-square text-center pt-4"
                    style={{ fontSize: 200, color: "grey" }}
                  ></i>
                </a>
                <h5 className="my-5 px-3 text-center">
                  Start your next masterpiece here...
                </h5>
              </div>
              {/* {stage1.map((data) => (
                <TBookDraft
                  key={data.tbsn}
                  tbsn={data.tbsn}
                  title={data.title}
                  author={data.author}
                  imageCover={data.coverImage}
                  editable={true}
                />
              ))} */}
            </span>
            <span
              id="tab2"
              className="row mx-3 my-2 justify-content-center"
              style={{ display: "none" }}
            >
              {/* {stage2.map((data) => (
                <TBookDraft
                  key={data.tbsn}
                  tbsn={data.tbsn}
                  title={data.title}
                  author={data.author}
                  imageCover={data.coverImage}
                  editable={false}
                />
              ))} */}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AuthWrapper>
      {pageHTML}
    </AuthWrapper>
  );
};

export default UserHome;