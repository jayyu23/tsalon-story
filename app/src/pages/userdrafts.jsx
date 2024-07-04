import React, { useState, useEffect } from "react";
import NavBar from "../components/navbar";
import Sidebar from "../components/sidebar";
import TBookDraft from "../components/tbookdraft";
import MemberOnly from "../components/memberonly";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import auth from "../auth/authhandler";
import endpoints from "../auth/endpoints";

function UserDrafts() {
  const [stage1, setStage1] = useState([]);
  const [stage2, setStage2] = useState([]);
  const [username, setUsername] = useState(null);
  const [isSalonite, setIsSalonite] = useState(false);

  auth.protectRoute();

  useEffect(() => {
    let authData = auth.getPostAuthData();
    axios
      .post(endpoints.getUserHolderAPI(), authData.body, authData.config)
      .then(
        (acc) => {
          let data = acc.data;
          setIsSalonite(data.salonite);
          getDrafts();
        },
        (rej) => {
          console.log(rej);
        }
      );
  }, []);

  const getDrafts = () => {
    // First check if the user is a Salonite

    let authData = auth.getPostAuthData();
    setUsername(auth.getUsername());
    let usernameLink = auth.getUsernameLink();
    let route = endpoints.getUserDraftAPI(usernameLink);
    axios.post(route, authData.body, authData.config).then(
      (acc) => {
        let data = acc.data;
        console.log(data);
        setStage1(data.stage1);
        setStage2(data.stage2);
      },
      (rej) => {
        console.log(rej);
      }
    );
  };

  // Javascript to manage tabs
  const showTab1 = () => {
    document.getElementById("t2").className = "nav-link";
    document.getElementById("t1").className = "nav-link active";
    document.getElementById("tab2").style = "display: none";
    document.getElementById("tab1").style = "display: flex";
  };

  const showTab2 = () => {
    document.getElementById("t2").className = "nav-link active";
    document.getElementById("t1").className = "nav-link";
    document.getElementById("tab1").style = "display: none";
    document.getElementById("tab2").style = "display: flex";
  };

  const pageHTML = (
    <div className="h-100">
      <div className="container h-100 mx-0 px-0 mt-3 w-100">
        <NavBar />
        <div className="row h-100 w-100">
          <div className="col-md-3 col-xs-12">
            <Sidebar active={2} />
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
                  onClick={showTab1}
                >
                  {`Unpublished Drafts (${stage1.length})`}
                </a>
              </li>
              <li className="nav-item">
                <a id="t2" className="nav-link" href="#" onClick={showTab2}>
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
                    sessionStorage.setItem("draftTBSN", 0);
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
              {stage1.map((data) => (
                <TBookDraft
                  key={data.tbsn}
                  tbsn={data.tbsn}
                  title={data.title}
                  author={data.author}
                  imageCover={data.coverImage}
                  editable={true}
                />
              ))}
            </span>
            <span
              id="tab2"
              className="row mx-3 my-2 justify-content-center"
              style={{ display: "none" }}
            >
              {stage2.map((data) => (
                <TBookDraft
                  key={data.tbsn}
                  tbsn={data.tbsn}
                  title={data.title}
                  author={data.author}
                  imageCover={data.coverImage}
                  editable={false}
                />
              ))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
  return <div>{isSalonite ? pageHTML : <MemberOnly active={2} />}</div>; // <MemberOnly active={2} />
}

export default UserDrafts;
