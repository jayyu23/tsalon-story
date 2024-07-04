import React, { Component } from "react";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import HomePage from "./pages/home";
import TSalonEditor from "./pages/editor";
import Error404 from "./pages/error404";
import TBookPub from "./pages/tbookpub";
import TBookStore from "./components/tbookstore";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import CollectPage from "./pages/collect";
import UserDrafts from "./pages/userdrafts";
import ReviewPage from "./pages/review";
import PublicShelf from "./pages/publicshelf";
import PrivateShelf from "./pages/privateshelf";
import Notifications from "./pages/notifications";
import MemberOnly from "./components/memberonly";

class App extends Component {
  constructor(props) {
    super(props);
  }
  // state = {  }
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/collect/:tbsn" element={<CollectPage />} />
          <Route path="/editor" element={<TSalonEditor />} />
          <Route path="/view/:tbsn" element={<TBookPub />} />
          <Route path="/error" element={<Error404 />} />
          <Route path="/bookstore" element={<TBookStore />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/drafts" element={<UserDrafts />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/profile/:username" element={<PublicShelf />} />
          <Route path="/collections" element={<PrivateShelf />} />
          <Route path="/dashboard" element={<Notifications />} />
          <Route path="*" element={<Navigate to="/error" />} />
        </Routes>
      </BrowserRouter>
    );
  }
}

export default App;
