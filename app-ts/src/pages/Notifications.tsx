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
        <div className='vw-100 vh-100 d-flex flex-column'>
        <NavBar />
        <div className="d-flex flex-grow-1">
          <div className="d-flex flex-column">
            <Sidebar initialActiveItem="Dashboard" />
            </div>
            <div className="flex-grow-1 d-flex flex-column my-0 h-100">
            <h1 className="my-5 text-center">Welcome, {username}</h1>
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