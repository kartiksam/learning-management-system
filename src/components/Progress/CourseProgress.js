import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CourseProgress.css";

const CourseProgress = ({ courseId }) => {
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`/api/progress/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProgress(res.data));
  }, [courseId]);

  return (
    <div className="course-progress">
      <h3>Your Progress</h3>
      {progress.map((item, i) => (
        <div key={i} className="material-item">
          <p>{item.title}</p>
          <span>{item.completed ? "✅ Completed" : "❌ Not Completed"}</span>
        </div>
      ))}
    </div>
  );
};

export default CourseProgress;
