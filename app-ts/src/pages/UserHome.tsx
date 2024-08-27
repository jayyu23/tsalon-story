import React, { useState, useEffect } from "react";

import NavBar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Notification from "../components/Notification";
import axios from "axios";
import endpoints from "../auth/endpoints";
import AuthWrapper from "../components/AuthWrapper";
import { useAuth } from "../auth/useAuth";

interface Message {
  _id?: string;
  title?: string;
  fromName?: string;
  body?: string;
  date: Date | string;
}

const Notifications: React.FC = () => {

  const sampleMessages: Message[] = [
    {
      _id: "1",
      title: "Welcome to TSalon",
      fromName: "TSalon",
      body: "Welcome to TSalon! We hope you enjoy your stay.",
      date: new Date().toISOString(),
    },
];

  const [messages, setMessages] = useState<Message[]>([]);
  const { session, getAuthData } = useAuth();

  useEffect(() => {

    const authData = getAuthData();
    const address: string = session?.address || "";
    axios
      .post(
        endpoints.getMessagesAPI(address),
        authData.body,
        authData.config
      )
      .then(
        (response) => {
          console.log(response.data);
          if (response.data.messages.length !== 0) {
            setMessages(response.data.messages);
          } else {
            setMessages(sampleMessages);
          }
        
        },
        (error) => {
          console.log(error);
        }
      );

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
            <h1 className="my-5 text-center">Dashboard</h1>
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