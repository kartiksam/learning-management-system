import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
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
    <div>
      <h2>My Enrolled Courses</h2>
      <ul>
        {enrollments.map((enrollment) => (
          <li key={enrollment.id}>
            {enrollment.course.title} - Status: {enrollment.status} - Progress:{" "}
            {enrollment.progress}%
            <input
              type="number"
              value={enrollment.progress}
              //   onChange={(e) => updateProgress(enrollment.id, e.target.value)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Mycourses;
