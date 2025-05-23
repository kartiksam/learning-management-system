import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import "./MyCourses.css";

const Mycourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/enrollments/my-courses", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        console.log(response);
        setEnrollments(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="my-courses-container">
      <h2>My Enrolled Courses</h2>
      <ul className="my-courses-list">
        {enrollments.map((enrollment) => (
          <li key={enrollment.id} className="my-course-item">
            <span className="course-title">{enrollment.course.title}</span>
            <span className="course-status">Status: {enrollment.status}</span>
            <span className="course-progress">
              Progress: {enrollment.progress}%
            </span>
            <input
              type="number"
              className="progress-input"
              value={enrollment.progress}
              readOnly
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Mycourses;
