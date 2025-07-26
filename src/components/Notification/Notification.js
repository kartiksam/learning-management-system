import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Notification.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8080/api/notification", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setNotifications(res.data || []); // Safe fallback
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setNotifications([]); // In case of error, keep it safe
      }
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
