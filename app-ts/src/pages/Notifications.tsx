import React, { useState, useEffect } from "react";

import NavBar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Notification from "../components/Notification";
import axios from "axios";
import endpoints from "../auth/endpoints";
import AuthWrapper from "../components/AuthWrapper";

interface Message {
  _id?: string;
  title?: string;
  fromName?: string;
  body?: string;
  date: Date | string;
}

const Notifications: React.FC = () => {

  const username = "Alice";
  const sampleMessages: Message[] = [
    {
      _id: "1",
      title: "Welcome to TSalon",
      fromName: "TSalon",
      body: "Welcome to TSalon! We hope you enjoy your stay.",
      date: new Date().toISOString(),
    },
];

  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  // const [username, setUsername] = useState<string>(auth.getUsername());

  useEffect(() => {
    // const authData = auth.getPostAuthData();
    // axios
    //   .post(
    //     endpoints.getMessagesAPI(auth.getUsername()),
    //     authData.body,
    //     authData.config
    //   )
    //   .then(
    //     (response) => {
    //       setMessages(response.data.messages);
    //     },
    //     (error) => {
    //       console.log(error);
    //     }
    //   );
  }, []);

  return (
    <AuthWrapper>
        <div className="h-100 mx-0 px-0 w-100">
        <NavBar />
        <div className="row h-100 w-100">
            <div className="col-md-3 col-xs-12">
            <Sidebar initialActiveItem="Dashboard" />
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
    </AuthWrapper>
  );
}

export default Notifications;