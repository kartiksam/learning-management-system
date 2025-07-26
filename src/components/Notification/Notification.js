import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Notifications.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data);
    };
    fetchNotifications();
  }, []);

  return (
    <div className="notifications">
      <h3>Your Notifications</h3>
      {notifications.map((n, i) => (
        <div key={i} className="notification-item">
          <p>{n.message}</p>
          <span>{new Date(n.createdAt).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
