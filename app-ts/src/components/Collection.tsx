import React, { useState, useEffect } from "react";
import TBook from "./TBook";
import axios from "axios";
import endpoints from "../auth/endpoints";
import Loading from "./Loading";

interface UserCollectionProps {
  username: string;
  disableLoad?: boolean;
}

interface TBookData {
  tbsn: string;
  title: string;
  blurb: string;
  author: string;
  coverImage: string;
}

interface UserCollectionData {
  tbooks: TBookData[];
  username: string;
}

const UserCollection: React.FC<UserCollectionProps> = (props) => {
  const { username, disableLoad } = props;
  const [collected, setCollected] = useState<TBookData[]>([]);
  const [usernameDisplay, setUsernameDisplay] = useState<string>("");
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    axios.get<UserCollectionData>(endpoints.getUserCollectionAPI(username)).then(
      (response) => {
        setCollected(response.data.tbooks);
        setUsernameDisplay(response.data.username + "'s Bookshelf");
        setLoaded(true);
      },
      (error) => {
        console.log(error);
      }
    );
  }, [username]);

  const loadedContent = (
    <div className="container w-100 pt-5">
      <h1 className="text-center pt-5">{usernameDisplay || "Loading..."}</h1>
      {/* 
      <ul className="nav nav-pills nav-fill my-5">
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
      </ul> 
      */}
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

  return <div>{!loaded && !disableLoad ? <Loading /> : loadedContent}</div>;
};

export default UserCollection;