import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../utils/auth";

const MaterialUploads = () => {
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/admin/materials", {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((res) => setMaterials(res.data));
  }, []);

  return (
    <div>
      <h2>All Uploaded Materials</h2>
      <table>
        <thead>
          <tr>
            <th>Course</th>
            <th>Type</th>
            <th>Filename</th>
            <th>Uploader</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((m) => (
            <tr key={m.id}>
              <td>{m.courseTitle}</td>
              <td>{m.type}</td>
              <td>{m.filename}</td>
              <td>{m.uploaderName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MaterialUploads;
