import React from "react";

interface NotificationProps {
  title?: string;
  sender?: string;
  date?: string;
  body?: string;
}

const Notification: React.FC<NotificationProps> = ({
  title,
  sender,
  date,
  body,
}) => {
  return (
    <div className="my-4">
      <div
        className="card m-auto w-75 p-3 justify-content-center"
        style={{ borderRadius: 25 }}
      >
        <h5 className="card-title mt-4 px-3 pb-0">
          {title || "Message Title"}
        </h5>
        <p className="card-body my-0 pb-0 text-muted">
          From: {sender || "TSalon"}
        </p>
        <p className="card-body my-0 py-0 text-muted">
          Date: {date || new Date().toLocaleString()}
        </p>
        <p className="card-body mt-3 px-3">{body || "Message Body"}</p>
      </div>
    </div>
  );
}

export default Notification;