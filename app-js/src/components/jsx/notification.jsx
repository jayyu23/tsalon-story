import React, { useState, useEffect } from "react";

function Notification(props) {
  return (
    <div>
      <div
        className="card m-auto w-75 p-3 justify-content-center"
        style={{ borderRadius: 25 }}
      >
        <h5 className="card-title mt-4 px-3 pb-0">
          {props.title || "Message Title"}
        </h5>
        <p className="card-body my-0 pb-0 text-muted">
          From: {props.sender || "TSalon"}
        </p>
        <p className="card-body my-0 py-0 text-muted">
          Date: {props.date || new Date().toLocaleString()}
        </p>
        <p className="card-body mt-3 px-3">{props.body || "Message Body"}</p>
      </div>
    </div>
  );
}

export default Notification;
