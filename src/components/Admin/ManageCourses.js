import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../utils/auth";
import "./AdminPage.css";

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);

  const fetchCourses = () => {
    axios
      .get("http://localhost:8080/admin/courses", {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((res) => setCourses(res.data));
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleApproveChange = (id) => {
    axios
      .put(
        `http://localhost:8080/admin/courses/${id}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      )
      .then(fetchCourses)
      .catch((err) => {
        console.error("Error updating course status:", err);
        alert("Failed to update course status. Please try again.");
      });
  };

  const handleRejectChange = (id) => {
    axios
      .put(
        `http://localhost:8080/admin/courses/${id}/reject`,
        {},
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      )
      .then(fetchCourses)
      .catch((err) => {
        console.error("Error updating course status:", err);
        alert("Failed to update course status. Please try again.");
      });
  };
  return (
    <div className="admin-page-container">
      <h2>Manage Courses</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td>{course.id}</td>
              <td>{course.title}</td>
              <td>{course.status}</td>
              <td>
                <button onClick={() => handleApproveChange(course.id)}>
                  Approve
                </button>
                <button onClick={() => handleRejectChange(course.id)}>
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageCourses;
