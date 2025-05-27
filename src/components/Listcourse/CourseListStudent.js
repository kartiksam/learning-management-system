import axios from "axios";
import React, { useEffect, useState } from "react";
import { getToken } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import { getUserRole } from "../../utils/auth";
import "./CourseListStudent.css";

function StudentCourses() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const role = getUserRole();

  useEffect(() => {
    const token = localStorage.getItem("token");

    const endpoint =
      role === "INSTRUCTOR"
        ? "http://localhost:8080/api/courses/instructor"
        : "http://localhost:8080/api/courses/student";

    axios
      .get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCourses(res.data))
      .catch((err) => console.log(err));
  }, [role]);

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

  const handleEdit = (courseId) => {
    navigate(`/edit-course/${courseId}`);
  };

  const handleDelete = (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      axios
        .delete(`http://localhost:8080/api/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        })
        .then(() => {
          setCourses(courses.filter((course) => course.id !== courseId));
          alert("Course deleted successfully");
        })
        .catch((error) => console.error(error));
    }
  };

  return (
    <div className="course-list-container">
      <h2>{role === "INSTRUCTOR" ? "My Courses" : "Available Courses"}</h2>
      <div className="course-grid">
        {courses.map((course) => (
          <div key={course.id} className="course-card">
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            {role === "INSTRUCTOR" ? (
              <div className="instructor-actions">
                <button
                  onClick={() => handleEdit(course.id)}
                  className="edit-button"
                >
                  Edit Course
                </button>
                <button
                  onClick={() => handleDelete(course.id)}
                  className="delete-button"
                >
                  Delete Course
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleEnroll(course.id)}
                className="enroll-button"
              >
                Enroll Now
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentCourses;
