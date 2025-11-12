import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../utils/auth";
import "./AdminPage.css";

const EnrollmentsList = () => {
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/admin/enrollments", {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((res) => setEnrollments(res.data));
  }, []);

  return (
    <div className="admin-page-container">
      <h2>All Enrollments</h2>
      <table>
        <thead>
          <tr>
            <th>Student</th>
            <th>Course</th>
            <th>Enrollment Date</th>
          </tr>
        </thead>
        <tbody>
          {enrollments.map((e) => (
            <tr key={e.id}>
              <td>{e.studentName}</td>
              <td>{e.courseTitle}</td>
              <td>{e.enrollmentDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EnrollmentsList;
