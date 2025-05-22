import axios from "axios";
import React, { useEffect, useState } from "react";
import { getToken } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
function StudentCourses() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/courses/student")
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleEnroll = (courseId) => {
    axios
      .post(
        `http://localhost:8080/api/enrollments/enroll/${courseId}`,
        {},
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      )
      .then((response) => {
        alert("Enrolled successfully");

        navigate("/enrolled-courses");
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="course-list-container">
      <h2>Available Courses</h2>
      <div className="course-grid">
        {courses.map((course) => (
          <div key={course.id} className="course-card">
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <button
              onClick={() => handleEnroll(course.id)}
              className="enroll-button"
            >
              Enroll Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentCourses;
