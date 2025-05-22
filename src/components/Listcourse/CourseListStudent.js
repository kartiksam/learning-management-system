import axios from "axios";
import React, { useEffect, useState } from "react";
import { getToken } from "../../utils/auth";

function StudentCourses() {
  const [courses, setCourses] = useState([]);

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
      .then(() => alert("Enrolled successfully"))
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
