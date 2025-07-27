import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../utils/auth";

const ProgressTracker = () => {
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    axios
      .get("/api/admin/progress", {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((res) => setProgress(res.data));
  }, []);

  return (
    <div>
      <h2>Student Course Progress</h2>
      <table>
        <thead>
          <tr>
            <th>Student</th>
            <th>Course</th>
            <th>Completed Materials</th>
          </tr>
        </thead>
        <tbody>
          {progress.map((p) => (
            <tr key={p.id}>
              <td>{p.studentName}</td>
              <td>{p.courseTitle}</td>
              <td>
                {p.completedCount}/{p.totalCount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProgressTracker;
