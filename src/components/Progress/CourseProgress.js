import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CourseProgress.css";

const CourseProgress = ({ courseId }) => {
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`http://localhost:8080/materials/courses/${courseId}/progress`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProgress(res.data))
      .catch((err) => console.error("Failed to load progress", err));
  }, [courseId]);

  return (
    <div className="course-progress">
      <h3>Your Course Progress</h3>
      {progress.length === 0 ? (
        <p>No progress data available.</p>
      ) : (
        progress.map((item, i) => (
          <div key={i} className="material-item">
            <p>Material ID: {item.material_id}</p>
            <span>{item.completed ? "✅ Completed" : "❌ Not Completed"}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default CourseProgress;
