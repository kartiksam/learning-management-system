import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { getToken, getUserRole } from "../../utils/auth";
import "./CourseListStudent.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import CourseMediaPlayer, {
  resolveIsVideo,
} from "./CourseMediaPlayer";

function StudentCourses() {
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState("");
  const [file, setFile] = useState(null);
  const [type, setType] = useState("VIDEO");
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const role = getUserRole();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const learnCourseId = searchParams.get("learn");

  const selectedCourse = useMemo(() => {
    if (!learnCourseId) return null;
    return (
      courses.find(
        (course) => String(course.id) === String(learnCourseId)
      ) || null
    );
  }, [courses, learnCourseId]);

  const activeLessonIndex = useMemo(() => {
    if (!selectedMaterial) return -1;
    return materials.findIndex((mat) => mat.id === selectedMaterial.id);
  }, [materials, selectedMaterial]);

  useEffect(() => {
    const token = getToken();
    const endpoint =
      role === "INSTRUCTOR"
        ? "http://localhost:8080/api/courses/instructor"
        : "http://localhost:8080/api/courses/student";

    setCoursesLoading(true);
    setCoursesError("");

    axios
      .get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.content)
            ? res.data.content
            : Array.isArray(res.data?.courses)
              ? res.data.courses
              : [];
        setCourses(list);
      })
      .catch((err) => {
        console.log(err);
        setCourses([]);
        setCoursesError("Could not load courses. Please refresh and try again.");
      })
      .finally(() => setCoursesLoading(false));
  }, [role]);

  // Load materials whenever ?learn=<courseId> is in the URL
  useEffect(() => {
    if (!learnCourseId) {
      setMaterials([]);
      setSelectedMaterial(null);
      return;
    }

    const token = getToken();
    let cancelled = false;

    setLoadingMaterials(true);
    setSidebarOpen(true);

    axios
      .get(`http://localhost:8080/api/materials/course/${learnCourseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (cancelled) return;
        const list = Array.isArray(res.data) ? res.data : [];
        setMaterials(list);
        setSelectedMaterial(list.length > 0 ? list[0] : null);
      })
      .catch((error) => {
        if (cancelled) return;
        console.error(error);
        setMaterials([]);
        setSelectedMaterial(null);
        alert("Please Purchase Course First");
        setSearchParams({});
      })
      .finally(() => {
        if (!cancelled) setLoadingMaterials(false);
      });

    return () => {
      cancelled = true;
    };
  }, [learnCourseId, setSearchParams]);

  const handleEnroll = (courseId) => {
    axios
      .post(
        `http://localhost:8080/api/enrollments/enroll/${courseId}`,
        {},
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      )
      .then(() => {
        alert("Enrolled successfully");
        navigate("/enrolled-courses");
      })
      .catch((error) => {
        console.error(error);
        if (error.response) {
          alert(error.response.data);
        } else {
          alert("Something went wrong");
        }
      });
  };

  const purchaseCourse = async (courseId) => {
    try {
      const token = getToken();

      if (!token) {
        alert("Please login to purchase a course");
        navigate("/login");
        return;
      }

      const res = await axios.post(
        `http://localhost:8080/api/payment/create-checkout-session/${courseId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data && res.data.url) {
        window.location.href = res.data.url;
      } else {
        alert("Failed to create checkout session. Please try again.");
      }
    } catch (err) {
      console.error("Checkout error", err);

      if (err.response) {
        const status = err.response.status;
        const message =
          err.response.data?.message ||
          err.response.data?.error ||
          "Unknown error";

        if (status === 401) {
          alert("Session expired. Please login again.");
          navigate("/login");
        } else if (status === 404) {
          alert("Course not found. Please refresh the page.");
        } else if (status === 400) {
          alert(`Invalid request: ${message}`);
        } else if (status === 500) {
          alert("Server error. Please try again later.");
        } else {
          alert(`Error: ${message}`);
        }
      } else if (err.request) {
        alert(
          "Unable to connect to server. Please check your internet connection."
        );
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    }
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

  const openCoursePlayer = (courseId) => {
    setSearchParams({ learn: String(courseId) });
  };

  const closePlayer = () => {
    setSearchParams({});
    setMaterials([]);
    setSelectedMaterial(null);
  };

  const playLesson = (material) => {
    setSelectedMaterial(material);
  };

  const playAdjacentLesson = (direction) => {
    if (activeLessonIndex < 0) return;
    const nextIndex = activeLessonIndex + direction;
    if (nextIndex < 0 || nextIndex >= materials.length) return;
    setSelectedMaterial(materials[nextIndex]);
  };

  // Player view — only when ?learn= is present
  if (learnCourseId) {
    const courseTitle =
      selectedCourse?.title ||
      (coursesLoading ? "Loading course…" : `Course ${learnCourseId}`);
    const courseDescription = selectedCourse?.description || "";

    return (
      <div className="udemy-player">
        <header className="udemy-player-topbar">
          <button type="button" className="udemy-back-btn" onClick={closePlayer}>
            ← Back to courses
          </button>

          <div className="udemy-topbar-title">
            <strong>{courseTitle}</strong>
            <span>
              {selectedMaterial?.fileName || "Select a lecture to begin"}
            </span>
          </div>

          <button
            type="button"
            className="udemy-toggle-content"
            onClick={() => setSidebarOpen((open) => !open)}
          >
            {sidebarOpen ? "Hide content" : "Course content"}
          </button>
        </header>

        <div
          className={`udemy-player-body ${
            sidebarOpen ? "with-sidebar" : "full-stage"
          }`}
        >
          <section className="udemy-stage">
            <div className="udemy-media-frame">
              {loadingMaterials ? (
                <div className="udemy-empty-stage">Loading course content…</div>
              ) : selectedMaterial ? (
                <CourseMediaPlayer
                  key={selectedMaterial.id}
                  material={selectedMaterial}
                />
              ) : (
                <div className="udemy-empty-stage">
                  No materials available for this course yet.
                </div>
              )}
            </div>

            <div className="udemy-lesson-meta">
              <div>
                <p className="udemy-eyebrow">
                  Lecture {activeLessonIndex >= 0 ? activeLessonIndex + 1 : "—"}{" "}
                  of {materials.length || "—"}
                </p>
                <h1>{selectedMaterial?.fileName || "Course preview"}</h1>
                {courseDescription && (
                  <p className="udemy-course-blurb">{courseDescription}</p>
                )}
              </div>

              <div className="udemy-lesson-nav">
                <button
                  type="button"
                  onClick={() => playAdjacentLesson(-1)}
                  disabled={activeLessonIndex <= 0}
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => playAdjacentLesson(1)}
                  disabled={
                    activeLessonIndex < 0 ||
                    activeLessonIndex >= materials.length - 1
                  }
                >
                  Next lecture
                </button>
              </div>
            </div>
          </section>

          {sidebarOpen && (
            <aside className="udemy-curriculum">
              <div className="udemy-curriculum-header">
                <h2>Course content</h2>
                <span>{materials.length} lectures</span>
              </div>

              <div className="udemy-curriculum-list">
                {materials.length === 0 ? (
                  <p className="udemy-curriculum-empty">
                    {loadingMaterials
                      ? "Loading lectures…"
                      : "No lectures uploaded yet."}
                  </p>
                ) : (
                  materials.map((mat, index) => {
                    const isActive = selectedMaterial?.id === mat.id;
                    const isVideo = resolveIsVideo(mat);

                    return (
                      <button
                        key={mat.id}
                        type="button"
                        className={`udemy-lecture ${isActive ? "active" : ""}`}
                        onClick={() => playLesson(mat)}
                      >
                        <span className="udemy-lecture-index">
                          {isActive ? "▶" : index + 1}
                        </span>
                        <span className="udemy-lecture-body">
                          <span className="udemy-lecture-title">
                            {mat.fileName}
                          </span>
                          <span className="udemy-lecture-meta">
                            {isVideo ? "Video" : "Document"} · Lecture{" "}
                            {index + 1}
                          </span>
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            </aside>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="course-catalog">
      <header className="catalog-hero">
        <div>
          <p className="catalog-eyebrow">SmartLearn</p>
          <h2>
            {role === "INSTRUCTOR" ? "Your teaching library" : "Explore courses"}
          </h2>
          <p className="catalog-subtitle">
            {role === "INSTRUCTOR"
              ? "Upload materials and open any course in the learning player."
              : "Pick a course, open the player, and learn lecture by lecture."}
          </p>
        </div>
      </header>

      {coursesLoading && (
        <p className="catalog-empty">Loading courses…</p>
      )}

      {coursesError && !coursesLoading && (
        <p className="catalog-empty">{coursesError}</p>
      )}

      {!coursesLoading && !coursesError && (
        <div className="course-grid">
          {courses.map((course) => (
            <article key={course.id} className="course-card">
              <button
                type="button"
                className="course-card-media"
                onClick={() => openCoursePlayer(course.id)}
                aria-label={`Open ${course.title}`}
              >
                <span>{(course.title || "C").charAt(0)}</span>
              </button>

              <div className="course-card-body">
                <h3>{course.title}</h3>
                <p>{course.description}</p>

                {course.price != null && course.price !== "" && (
                  <div className="course-price">${course.price}</div>
                )}

                {role === "INSTRUCTOR" ? (
                  <div className="course-actions instructor-actions">
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
                      Upload material
                    </button>

                    <button
                      className="view-materials-button"
                      onClick={() => openCoursePlayer(course.id)}
                      disabled={loadingMaterials}
                    >
                      Open course player
                    </button>
                  </div>
                ) : (
                  <div className="course-actions">
                    <button
                      className="view-materials-button primary"
                      onClick={() => openCoursePlayer(course.id)}
                      disabled={loadingMaterials}
                    >
                      Start learning
                    </button>

                    <button
                      onClick={() => handleEnroll(course.id)}
                      className="enroll-button"
                    >
                      Enroll now
                    </button>

                    <button
                      onClick={() => purchaseCourse(course.id)}
                      className="purchase-button"
                    >
                      Purchase course
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {!coursesLoading && !coursesError && courses.length === 0 && (
        <p className="catalog-empty">No courses available yet.</p>
      )}
    </div>
  );
}

export default StudentCourses;
