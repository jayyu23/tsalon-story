import { Collection } from "mongoose";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import UserCollection from "../components/collection";
import NavBar from "../components/navbar";

function PublicShelf() {
  let { username } = useParams();
  return (
    <div>
      <NavBar />
      <div>
        <UserCollection username={username} />
      </div>
    </div>
  );
}

export default PublicShelf;
