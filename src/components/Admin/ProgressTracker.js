import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../utils/auth";
import "./AdminPage.css";

const ProgressTracker = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("summary"); // "summary" or "detailed"

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8080/admin/students/enrollments", {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((res) => {
        setStudents(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching progress:", err);
        setLoading(false);
      });
  }, []);

  // Calculate summary statistics
  const calculateSummary = () => {
    const validStudents = students.filter(
      (s) => s.studentUsername && s.studentUsername !== null
    );
    const totalStudents = validStudents.length;
    const totalEnrollments = students.reduce(
      (sum, s) => sum + (s.enrolledCourses?.length || 0),
      0
    );
    const studentsWithCourses = validStudents.filter(
      (s) => s.enrolledCourses && s.enrolledCourses.length > 0
    ).length;
    const averageProgress =
      students.reduce((sum, s) => {
        const courses = s.enrolledCourses || [];
        const avg =
          courses.length > 0
            ? courses.reduce((s, c) => s + (c.progress || 0), 0) /
              courses.length
            : 0;
        return sum + avg;
      }, 0) / (totalStudents || 1);

    return {
      totalStudents,
      totalEnrollments,
      studentsWithCourses,
      studentsWithoutCourses: totalStudents - studentsWithCourses,
      averageProgress: (averageProgress * 100).toFixed(1),
    };
  };

  const summary = calculateSummary();

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  // Format progress percentage
  const formatProgress = (progress) => {
    if (progress === null || progress === undefined) return "0%";
    return `${(progress * 100).toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="admin-page-container">
        <h2>Student Course Progress</h2>
        <div style={{ textAlign: "center", color: "white", padding: "2rem" }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page-container">
      <h2>Student Course Progress</h2>

      {/* View Mode Toggle */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          marginBottom: "2rem",
        }}
      >
        <button
          onClick={() => setViewMode("summary")}
          style={{
            background:
              viewMode === "summary"
                ? "linear-gradient(45deg, #ff6b6b, #feca57)"
                : "rgba(255, 255, 255, 0.1)",
          }}
        >
          Summary View
        </button>
        <button
          onClick={() => setViewMode("detailed")}
          style={{
            background:
              viewMode === "detailed"
                ? "linear-gradient(45deg, #ff6b6b, #feca57)"
                : "rgba(255, 255, 255, 0.1)",
          }}
        >
          Detailed View
        </button>
      </div>

      {/* Summary View */}
      {viewMode === "summary" && (
        <div>
          {/* Summary Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1.5rem",
              marginBottom: "2rem",
              maxWidth: "1200px",
              margin: "0 auto 2rem auto",
            }}
          >
            <div
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "16px",
                padding: "1.5rem",
                color: "white",
              }}
            >
              <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem" }}>
                Total Students
              </h3>
              <p style={{ margin: 0, fontSize: "2rem", fontWeight: "bold" }}>
                {summary.totalStudents}
              </p>
            </div>
            <div
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "16px",
                padding: "1.5rem",
                color: "white",
              }}
            >
              <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem" }}>
                Total Enrollments
              </h3>
              <p style={{ margin: 0, fontSize: "2rem", fontWeight: "bold" }}>
                {summary.totalEnrollments}
              </p>
            </div>
            <div
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "16px",
                padding: "1.5rem",
                color: "white",
              }}
            >
              <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem" }}>
                Students with Courses
              </h3>
              <p style={{ margin: 0, fontSize: "2rem", fontWeight: "bold" }}>
                {summary.studentsWithCourses}
              </p>
            </div>
            <div
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "16px",
                padding: "1.5rem",
                color: "white",
              }}
            >
              <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem" }}>
                Average Progress
              </h3>
              <p style={{ margin: 0, fontSize: "2rem", fontWeight: "bold" }}>
                {summary.averageProgress}%
              </p>
            </div>
          </div>

          {/* Summary Table */}
          <table>
            <thead>
              <tr>
                <th>Student Username</th>
                <th>Number of Courses</th>
                <th>Average Progress</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {students
                .filter((s) => s.studentUsername && s.studentUsername !== null)
                .map((student, index) => {
                  const courses = student.enrolledCourses || [];
                  const avgProgress =
                    courses.length > 0
                      ? courses.reduce((sum, c) => sum + (c.progress || 0), 0) /
                        courses.length
                      : 0;
                  return (
                    <tr key={index}>
                      <td>{student.studentUsername}</td>
                      <td>{courses.length}</td>
                      <td>{formatProgress(avgProgress)}</td>
                      <td>{courses.length > 0 ? "Enrolled" : "No Courses"}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}

      {/* Detailed View */}
      {viewMode === "detailed" && (
        <div>
          <table>
            <thead>
              <tr>
                <th>Student Username</th>
                <th>Course Title</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Enrolled Date</th>
                <th>Completion Date</th>
              </tr>
            </thead>
            <tbody>
              {students
                .filter((s) => s.studentUsername && s.studentUsername !== null)
                .map((student, studentIndex) => {
                  const courses = student.enrolledCourses || [];
                  if (courses.length === 0) {
                    return (
                      <tr key={`student-${studentIndex}`}>
                        <td>{student.studentUsername}</td>
                        <td colSpan="5" style={{ textAlign: "center" }}>
                          No enrolled courses
                        </td>
                      </tr>
                    );
                  }
                  return courses.map((course, courseIndex) => (
                    <tr key={`${studentIndex}-${courseIndex}`}>
                      {courseIndex === 0 && (
                        <td
                          rowSpan={courses.length}
                          style={{
                            verticalAlign: "top",
                            fontWeight: "600",
                          }}
                        >
                          {student.studentUsername}
                        </td>
                      )}
                      <td>{course.title}</td>
                      <td>{course.status}</td>
                      <td>{formatProgress(course.progress)}</td>
                      <td>{formatDate(course.enrolledDate)}</td>
                      <td>
                        {course.completionDate
                          ? formatDate(course.completionDate)
                          : "Not Completed"}
                      </td>
                    </tr>
                  ));
                })}
            </tbody>
          </table>

          {/* Show students with null username or empty courses if any */}
          {students.filter(
            (s) => !s.studentUsername || s.studentUsername === null
          ).length > 0 && (
            <div style={{ marginTop: "2rem" }}>
              <h3 style={{ color: "white", marginBottom: "1rem" }}>
                Students with Missing Information
              </h3>
              <table>
                <thead>
                  <tr>
                    <th>Student Username</th>
                    <th>Number of Courses</th>
                  </tr>
                </thead>
                <tbody>
                  {students
                    .filter(
                      (s) => !s.studentUsername || s.studentUsername === null
                    )
                    .map((student, index) => (
                      <tr key={`null-${index}`}>
                        <td>N/A</td>
                        <td>{student.enrolledCourses?.length || 0}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;
