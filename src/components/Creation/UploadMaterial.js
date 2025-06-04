import React, { useState } from "react";
import axios from "axios";
const UploadMaterial = () => {
  const [file, setFile] = useState(null);
  const [type, setType] = useState("video");

  const handleUpload = (courseId) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    axios
      .post(`http://localhost:8080/api/materials/${courseId}/upload`, formData)
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  };
  return (
    <div>
      <h3>Upload Course Material</h3>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <select onChange={(e) => setType(e.target.value)}>
        <option value="video">Video</option>
        <option value="pdf">PDF</option>
        <option value="image">Image</option>
      </select>
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default UploadMaterial;
