import axios from "axios";
import React, { useEffect, useState } from "react";
import { getToken, getUserRole } from "../../utils/auth";
import "./CourseListStudent.css";
import { useNavigate } from "react-router-dom";

function StudentCourses() {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null); // For upload/view
  const [file, setFile] = useState(null);
  const [type, setType] = useState("VIDEO");
  const [materials, setMaterials] = useState([]);
  const role = getUserRole();

  const navigate = useNavigate();
  useEffect(() => {
    const token = getToken();
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

  const handleUpload = async (courseId) => {
    const token = getToken();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      await axios.post(
        `http://localhost:8080/api/materials/${courseId}/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Uploaded Successfully");
      setFile(null);
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    }
  };

  const handleViewMaterials = async (courseId) => {
    const token = getToken();
    try {
      console.log("Fetching materials for course ID:", courseId); // ✅ Debug log
      const res = await axios.get(
        `http://localhost:8080/api/materials/course/${courseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Materials response:", res.data); // ✅ Debug log
      setMaterials(res.data);
      setSelectedCourseId(courseId);
    } catch (error) {
      console.error("Error fetching materials:", error);
      alert("Failed to load materials. Please try again.");
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
              <>
                <div className="file-input-container">
                  <input
                    type="file"
                    className="file-input"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                  <select
                    className="type-select"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="VIDEO">Video</option>
                    <option value="PDF">PDF</option>
                  </select>
                </div>
                <button
                  className="upload-button"
                  onClick={() => handleUpload(course.id)}
                  disabled={!file}
                >
                  <span>Upload Material</span>
                  <span>📤</span>
                </button>
              </>
            ) : (
              <>
                <button
                  className="view-materials-button"
                  onClick={() => handleViewMaterials(course.id)}
                >
                  <span>View Materials</span>
                  <span>📚</span>
                </button>

                <button
                  onClick={() => handleEnroll(course.id)}
                  className="enroll-button"
                >
                  <span>Enroll Now</span>
                  <span>🎓</span>
                </button>
              </>
            )}

            {/* Show materials list only for selected course */}
            {selectedCourseId === course.id && (
              <div className="materials-display">
                <h4>📚 Course Materials</h4>
                {materials.length > 0 ? (
                  materials.map((mat) => (
                    <div key={mat.id} className="material-item">
                      <p>
                        <strong>{mat.fileName}</strong>
                      </p>
                      {mat.fileType === "VIDEO" ? (
                        <video controls width="320" height="240">
                          <source
                            src={`http://localhost:8080/${mat.filePath}`}
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <a
                          href={`http://localhost:8080/${mat.filePath}`}
                          target="_blank"
                          rel="noreferrer"
                          download
                          className="download-link"
                        >
                          📄 Download PDF
                        </a>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="no-materials">
                    <p>📭 No materials available for this course yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentCourses;
