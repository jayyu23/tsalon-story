import React, { useState, useEffect } from "react";
import auth from "../auth/authhandler.js";
import NavBar from "../components/navbar.jsx";
import Sidebar from "../components/sidebar.jsx";
import Notification from "../components/notification.jsx";
import axios from "axios";
import endpoints from "../auth/endpoints.js";

function Notifications() {
  auth.protectRoute();

  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState(auth.getUsername());

  useEffect(() => {
    let authData = auth.getPostAuthData();
    axios
      .post(
        endpoints.getMessagesAPI(auth.getUsername()),
        authData.body,
        authData.config
      )
      .then(
        (acc) => {
          setMessages(acc.data.messages);
        },
        (rej) => {
          console.log(rej);
        }
      );
  });

  return (
    <div className="container h-100 mx-0 px-0 mt-3 w-100">
      <NavBar />
      <div className="row h-100 w-100">
        <div className="col-md-3 col-xs-12">
          <Sidebar active={5} />
        </div>
        <div
          className="col-xs-12 col-md-9 justify-content-center"
          style={{ minHeight: window.innerHeight }}
        >
          <h1 className="my-5 pt-5 text-center">Welcome, {username}</h1>
          {messages.map((data) => (
            <Notification
              key={data._id}
              title={data.title}
              sender={data.fromName}
              body={data.body}
              date={new Date(data.date).toLocaleString()}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Notifications;
