import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../utils/auth";

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

  const handleStatusChange = (id, status) => {
    axios
      .put(
        `/api/admin/courses/${id}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      )
      .then(fetchCourses);
  };

  return (
    <div>
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
                <button
                  onClick={() => handleStatusChange(course.id, "APPROVED")}
                >
                  Approve
                </button>
                <button
                  onClick={() => handleStatusChange(course.id, "REJECTED")}
                >
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
