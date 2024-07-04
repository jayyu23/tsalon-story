import React, { useState, useEffect } from "react";
import TBook from "./tbook";
import axios from "axios";
import endpoints from "../../auth/endpoints";
import Loading from "./loading";

function UserCollection(props) {
  const username = props.username;
  const [collected, setCollected] = useState([]);
  const [usernameDisplay, setUsernameDisplay] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Check if the user exists
    axios.get(endpoints.getUserCollectionAPI(username)).then(
      (acc) => {
        setCollected(acc.data.tbooks);
        setUsernameDisplay(acc.data.username + "'s Bookshelf");
        setLoaded(true);
      },
      (rej) => {
        console.log(rej);
      }
    );
  }, []);

  const loadedContent = (
    <div className="container w-100 mt-5 pt-5">
      <h1 className="text-center pt-5">{usernameDisplay || "Loading..."}</h1>
      {
        // Tab Headers
      }
      {/* <ul className="nav nav-pills nav-fill my-5">
        <li className="nav-item">
          <a id="t1" className="nav-link active" href="#">
            {`Collected (${collected.length})`}
          </a>
        </li>
        <li className="nav-item">
          <a id="t2" className="nav-link" href="#">
            {`Published (${0})`}
          </a>
        </li>
      </ul> */}

      <div className="row justify-content-center px-0 w-100 py-3">
        {collected.map((data) => (
          <TBook
            tbsn={data.tbsn}
            key={data.tbsn}
            title={data.title}
            blurb={data.blurb}
            author={data.author}
            coverImage={data.coverImage}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div>{!loaded && !props.disableLoad ? <Loading /> : loadedContent}</div>
  );
}

export default UserCollection;
