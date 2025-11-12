import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../utils/auth";
import "./AdminPage.css";

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
    <div className="admin-page-container">
      <h2>All Uploaded Materials</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>File Name</th>
            <th>File Type</th>
            <th>File Path</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((m) => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.fileName}</td>
              <td>{m.fileType}</td>
              <td>{m.filePath}</td>
              <td>{m.createdAt || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MaterialUploads;
