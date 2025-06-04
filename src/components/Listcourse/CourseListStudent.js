// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { getToken } from "../../utils/auth";
// import { useNavigate } from "react-router-dom";
// import { getUserRole } from "../../utils/auth";
// import "./CourseListStudent.css";

// function StudentCourses() {
//   const [courses, setCourses] = useState([]);
//   const navigate = useNavigate();
//   const role = getUserRole();

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     const endpoint =
//       role === "INSTRUCTOR"
//         ? "http://localhost:8080/api/courses/instructor"
//         : "http://localhost:8080/api/courses/student";

//     axios
//       .get(endpoint, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => setCourses(res.data))
//       .catch((err) => console.log(err));
//   }, [role]);

//   const handleEnroll = (courseId) => {
//     axios
//       .post(
//         `http://localhost:8080/api/enrollments/enroll/${courseId}`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${getToken()}` },
//         }
//       )
//       .then((response) => {
//         alert("Enrolled successfully");

//         navigate("/enrolled-courses");
//       })
//       .catch((error) => console.error(error));
//   };

//   const handleEdit = (courseId) => {
//     navigate(`/edit-course/${courseId}`);
//   };

//   const handleDelete = (courseId) => {
//     if (window.confirm("Are you sure you want to delete this course?")) {
//       axios
//         .delete(`http://localhost:8080/api/courses/${courseId}`, {
//           headers: { Authorization: `Bearer ${getToken()}` },
//         })
//         .then(() => {
//           setCourses(courses.filter((course) => course.id !== courseId));
//           alert("Course deleted successfully");
//         })
//         .catch((error) => console.error(error));
//     }
//   };

//   return (
//     <div className="course-list-container">
//       <h2>{role === "INSTRUCTOR" ? "My Courses" : "Available Courses"}</h2>
//       <div className="course-grid">
//         {courses.map((course) => (
//           <div key={course.id} className="course-card">
//             <h3>{course.title}</h3>
//             <p>{course.description}</p>
//             {role === "INSTRUCTOR" ? (
//               <div className="instructor-actions">
//                 <button
//                   onClick={() => handleEdit(course.id)}
//                   className="edit-button"
//                 >
//                   Edit Course
//                 </button>
//                 <button
//                   onClick={() => handleDelete(course.id)}
//                   className="delete-button"
//                 >
//                   Delete Course
//                 </button>
//               </div>
//             ) : (
//               <button
//                 onClick={() => handleEnroll(course.id)}
//                 className="enroll-button"
//               >
//                 Enroll Now
//               </button>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default StudentCourses;

import axios from "axios";
import React, { useEffect, useState } from "react";
import { getToken, getUserRole } from "../../utils/auth";
import "./CourseListStudent.css";

function StudentCourses() {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null); // For upload/view
  const [file, setFile] = useState(null);
  const [type, setType] = useState("VIDEO");
  const [materials, setMaterials] = useState([]);
  const role = getUserRole();

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
      const res = await axios.get(
        `http://localhost:8080/api/materials/course/${courseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMaterials(res.data);
      setSelectedCourseId(courseId);
    } catch (error) {
      console.error(error);
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
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <select value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="VIDEO">Video</option>
                  <option value="PDF">PDF</option>
                </select>
                <button onClick={() => handleUpload(course.id)}>Upload</button>
              </>
            ) : (
              <button onClick={() => handleViewMaterials(course.id)}>
                View Materials
              </button>
            )}

            {/* Show materials list only for selected course */}
            {selectedCourseId === course.id && materials.length > 0 && (
              <div>
                <h4>Materials:</h4>
                {materials.map((mat) => (
                  <div key={mat.id}>
                    <p>{mat.fileName}</p>
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
                      >
                        Download PDF
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentCourses;
