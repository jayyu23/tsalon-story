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
  tbooks: { collection: TBookData[]; authored: TBookData[] };
  username: string;
}

const UserCollection: React.FC<UserCollectionProps> = ({ username, disableLoad }) => {
  const [collectedBooks, setCollectedBooks] = useState<TBookData[]>([]);
  const [authoredBooks, setAuthoredBooks] = useState<TBookData[]>([]);
  const [activeTab, setActiveTab] = useState<string>("collected");
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    axios.get<UserCollectionData>(endpoints.getUserCollectionAPI(username)).then(
      (response) => {
        setCollectedBooks(response.data.tbooks.collection);
        setAuthoredBooks(response.data.tbooks.authored);
        setLoaded(true);
      },
      (error) => {
        console.error(error);
      }
    );
  }, [username]);

  const tabItems = [
    { id: "collected", label: `Collected (${collectedBooks.length})` },
    { id: "published", label: `Published (${authoredBooks.length})` },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  const renderBooks = (books: TBookData[]) => (
    <div className="row justify-content-center px-0 w-100 py-3">
      {books.map((book) => (
        <TBook
          key={book.tbsn}
          tbsn={book.tbsn}
          title={book.title}
          blurb={book.blurb}
          author={book.author}
          coverImage={book.coverImage}
        />
      ))}
    </div>
  );

  const loadedContent = (
    <div className="container w-100 pt-5">
      <h1 className="text-center pt-5">Collection</h1>
      <p>User: {username}</p>

      <ul className="nav nav-pills nav-fill my-5">
        {tabItems.map((tab) => (
          <li key={tab.id} className="nav-item">
            <a
              id={tab.id}
              className={`nav-link ${activeTab === tab.id ? "active" : ""}`}
              href="#"
              onClick={() => handleTabClick(tab.id)}
            >
              {tab.label}
            </a>
          </li>
        ))}
      </ul>

      {activeTab === "collected" ? renderBooks(collectedBooks) : renderBooks(authoredBooks)}
    </div>
  );

  return <div>{!loaded && !disableLoad ? <Loading /> : loadedContent}</div>;
};

export default UserCollection;