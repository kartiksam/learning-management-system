import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { getToken } from "../../utils/auth";
import "./AdminPage.css";

const EnrollmentsList = () => {
  const [studentsData, setStudentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // "all", "enrolled", "completed", "no-courses"

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8080/admin/students/enrollments", {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((res) => {
        setStudentsData(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching enrollments:", err);
        setLoading(false);
      });
  }, []);

  // Flatten the data structure to create individual enrollment records
  const flattenedEnrollments = useMemo(() => {
    const enrollments = [];
    studentsData.forEach((student) => {
      if (student.enrolledCourses && student.enrolledCourses.length > 0) {
        student.enrolledCourses.forEach((course) => {
          enrollments.push({
            id: `${student.studentUsername || "unknown"}-${course.title}-${
              course.enrolledDate
            }`,
            studentUsername: student.studentUsername || "Unknown",
            courseTitle: course.title,
            status: course.status,
            progress: course.progress,
            enrolledDate: course.enrolledDate,
            completionDate: course.completionDate,
          });
        });
      }
    });
    return enrollments;
  }, [studentsData]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Format progress percentage
  const formatProgress = (progress) => {
    if (progress === null || progress === undefined) return "0%";
    return `${(progress * 100).toFixed(1)}%`;
  };

  // Filter enrollments
  const getFilteredEnrollments = () => {
    if (filter === "all") return flattenedEnrollments;
    if (filter === "enrolled") {
      return flattenedEnrollments.filter((e) => e.status === "ENROLLED");
    }
    if (filter === "completed") {
      return flattenedEnrollments.filter((e) => e.completionDate !== null);
    }
    return flattenedEnrollments;
  };

  const filteredEnrollments = getFilteredEnrollments();

  // Calculate statistics
  const stats = useMemo(() => {
    const totalEnrollments = flattenedEnrollments.length;
    const enrolled = flattenedEnrollments.filter(
      (e) => e.status === "ENROLLED"
    ).length;
    const completed = flattenedEnrollments.filter(
      (e) => e.completionDate !== null
    ).length;
    const studentsWithCourses = studentsData.filter(
      (s) => s.enrolledCourses && s.enrolledCourses.length > 0
    ).length;
    const studentsWithoutCourses = studentsData.filter(
      (s) => !s.enrolledCourses || s.enrolledCourses.length === 0
    ).length;
    const averageProgress =
      flattenedEnrollments.length > 0
        ? (
            flattenedEnrollments.reduce(
              (sum, e) => sum + (e.progress || 0),
              0
            ) / flattenedEnrollments.length
          ).toFixed(1)
        : 0;

    return {
      totalEnrollments,
      enrolled,
      completed,
      studentsWithCourses,
      studentsWithoutCourses,
      averageProgress,
      totalStudents: studentsData.length,
    };
  }, [flattenedEnrollments, studentsData]);

  if (loading) {
    return (
      <div className="admin-page-container">
        <h2>All Enrollments</h2>
        <div style={{ textAlign: "center", color: "white", padding: "2rem" }}>
          Loading enrollments...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page-container">
      <h2>All Enrollments</h2>

      {/* Statistics Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
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
            Total Enrollments
          </h3>
          <p style={{ margin: 0, fontSize: "2rem", fontWeight: "bold" }}>
            {stats.totalEnrollments}
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
            Active Enrollments
          </h3>
          <p style={{ margin: 0, fontSize: "2rem", fontWeight: "bold" }}>
            {stats.enrolled}
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
            Completed
          </h3>
          <p style={{ margin: 0, fontSize: "2rem", fontWeight: "bold" }}>
            {stats.completed}
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
            {stats.studentsWithCourses}
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
            {stats.averageProgress}%
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
            Total Students
          </h3>
          <p style={{ margin: 0, fontSize: "2rem", fontWeight: "bold" }}>
            {stats.totalStudents}
          </p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          marginBottom: "2rem",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => setFilter("all")}
          style={{
            padding: "0.75rem 1.5rem",
            background:
              filter === "all"
                ? "linear-gradient(45deg, #ff6b6b, #feca57)"
                : "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "10px",
            color: "white",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
        >
          All ({stats.totalEnrollments})
        </button>
        <button
          onClick={() => setFilter("enrolled")}
          style={{
            padding: "0.75rem 1.5rem",
            background:
              filter === "enrolled"
                ? "linear-gradient(45deg, #ff6b6b, #feca57)"
                : "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "10px",
            color: "white",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
        >
          Enrolled ({stats.enrolled})
        </button>
        <button
          onClick={() => setFilter("completed")}
          style={{
            padding: "0.75rem 1.5rem",
            background:
              filter === "completed"
                ? "linear-gradient(45deg, #ff6b6b, #feca57)"
                : "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "10px",
            color: "white",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
        >
          Completed ({stats.completed})
        </button>
      </div>

      {/* Enrollments Table */}
      {filteredEnrollments.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            color: "white",
            padding: "3rem",
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "16px",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          {filter === "all"
            ? "No enrollments found"
            : `No ${filter} enrollments found`}
        </div>
      ) : (
        <div
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            overflowX: "auto",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(255, 255, 255, 0.15)" }}>
                <th
                  style={{
                    padding: "1.25rem",
                    textAlign: "left",
                    color: "white",
                  }}
                >
                  Student Username
                </th>
                <th
                  style={{
                    padding: "1.25rem",
                    textAlign: "left",
                    color: "white",
                  }}
                >
                  Course Title
                </th>
                <th
                  style={{
                    padding: "1.25rem",
                    textAlign: "left",
                    color: "white",
                  }}
                >
                  Enrollment Status
                </th>
                <th
                  style={{
                    padding: "1.25rem",
                    textAlign: "left",
                    color: "white",
                  }}
                >
                  Progress
                </th>
                <th
                  style={{
                    padding: "1.25rem",
                    textAlign: "left",
                    color: "white",
                  }}
                >
                  Enrolled Date
                </th>
                <th
                  style={{
                    padding: "1.25rem",
                    textAlign: "left",
                    color: "white",
                  }}
                >
                  Completion Date
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEnrollments.map((enrollment) => (
                <tr
                  key={enrollment.id}
                  style={{
                    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "rgba(255, 255, 255, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <td
                    style={{
                      padding: "1.25rem",
                      color: "rgba(255, 255, 255, 0.9)",
                    }}
                  >
                    <strong>{enrollment.studentUsername}</strong>
                  </td>
                  <td
                    style={{
                      padding: "1.25rem",
                      color: "rgba(255, 255, 255, 0.9)",
                    }}
                  >
                    {enrollment.courseTitle}
                  </td>
                  <td
                    style={{
                      padding: "1.25rem",
                      color: "rgba(255, 255, 255, 0.9)",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        padding: "0.4rem 0.8rem",
                        borderRadius: "20px",
                        fontSize: "0.85rem",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        background: "rgba(33, 150, 243, 0.3)",
                        color: "#2196f3",
                        border: "1px solid rgba(33, 150, 243, 0.5)",
                      }}
                    >
                      {enrollment.status || "N/A"}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "1.25rem",
                      color: "rgba(255, 255, 255, 0.9)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <div
                        style={{
                          flex: 1,
                          height: "8px",
                          background: "rgba(255, 255, 255, 0.1)",
                          borderRadius: "4px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${(enrollment.progress || 0) * 100}%`,
                            background:
                              "linear-gradient(45deg, #4caf50, #66bb6a)",
                            borderRadius: "4px",
                            transition: "width 0.3s ease",
                          }}
                        />
                      </div>
                      <span style={{ minWidth: "50px", textAlign: "right" }}>
                        {formatProgress(enrollment.progress)}
                      </span>
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "1.25rem",
                      color: "rgba(255, 255, 255, 0.9)",
                    }}
                  >
                    {formatDate(enrollment.enrolledDate)}
                  </td>
                  <td
                    style={{
                      padding: "1.25rem",
                      color: "rgba(255, 255, 255, 0.9)",
                    }}
                  >
                    {enrollment.completionDate
                      ? formatDate(enrollment.completionDate)
                      : "Not Completed"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Students without courses section */}
      {stats.studentsWithoutCourses > 0 && (
        <div style={{ marginTop: "3rem" }}>
          <h3
            style={{
              color: "white",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            Students Without Enrollments ({stats.studentsWithoutCourses})
          </h3>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "16px",
              padding: "1.5rem",
              maxWidth: "1200px",
              margin: "0 auto",
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.75rem",
                justifyContent: "center",
              }}
            >
              {studentsData
                .filter(
                  (s) => !s.enrolledCourses || s.enrolledCourses.length === 0
                )
                .map((student, index) => (
                  <span
                    key={index}
                    style={{
                      padding: "0.5rem 1rem",
                      background: "rgba(255, 255, 255, 0.1)",
                      borderRadius: "8px",
                      color: "rgba(255, 255, 255, 0.9)",
                      fontSize: "0.9rem",
                    }}
                  >
                    {student.studentUsername || "Unknown"}
                  </span>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrollmentsList;
