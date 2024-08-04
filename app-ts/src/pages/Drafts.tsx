import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import AuthWrapper from "../components/AuthWrapper";
import TBookDraft from "../components/TBookDraft";
import { useAuth } from "../auth/useSessionStorage";
import endpoints from "../auth/endpoints";
import axios from "axios";

const UserHome: React.FC = () => {
  const [stage1, setStage1] = useState([]);
  const [stage2, setStage2] = useState([]);
  const { getAuthData, session } = useAuth();
  const username = session?.address || "";

  useEffect(() => {
    const authData = getAuthData();
    const endpoint = endpoints.getUserDraftAPI(username);
    axios.get(endpoint, authData.config).then(
      (acc) => {
        const drafts = acc.data;
        console.log(drafts);
        const stage1: any = drafts.stage1;
        const stage2 = drafts.stage2;
        setStage1(stage1);
        setStage2(stage2);
      },
      (rej) => {
        console.log(rej);
      }
    );
  }, []);

  const pageHTML = (
    <div className='vw-100 vh-100 d-flex flex-column'>
      <Navbar />
      <div className="d-flex flex-grow-1">
        <div className="d-flex flex-column">
            <Sidebar initialActiveItem="Drafts"/>
          </div>

          <div className="flex-grow-1 d-flex flex-column my-0 h-100">
            <h1 className="my-5 text-center">My Drafts</h1>

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
              {stage1.map((data: any) => (
                <TBookDraft
                  key={data?.tbsn}
                  tbsn={data?.tbsn}
                  title={data.title}
                  author={data?.author}
                  imageCover={data?.coverImage}
                  editable={true}
                />
              ))}
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
  );

  return (
    <AuthWrapper>
      {pageHTML}
    </AuthWrapper>
  );
};

export default UserHome;