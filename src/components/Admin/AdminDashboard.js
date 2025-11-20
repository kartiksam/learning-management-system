import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../utils/auth";
import { Link } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [students, setStudents] = useState([]);
  const [courseFilter, setCourseFilter] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState({
    courses: true,
    instructors: true,
    students: true,
  });

  // Fetch all courses
  const fetchCourses = () => {
    setLoading((prev) => ({ ...prev, courses: true }));
    axios
      .get("http://localhost:8080/admin/courses", {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((res) => {
        setCourses(res.data || []);
        setLoading((prev) => ({ ...prev, courses: false }));
      })
      .catch((err) => {
        console.error("Error fetching courses:", err);
        setLoading((prev) => ({ ...prev, courses: false }));
      });
  };

  // Fetch all instructors
  const fetchInstructors = () => {
    setLoading((prev) => ({ ...prev, instructors: true }));
    axios
      .get("http://localhost:8080/admin/users", {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((res) => {
        const allUsers = res.data || [];
        const instructorUsers = allUsers.filter(
          (user) => user.role === "INSTRUCTOR"
        );
        setInstructors(instructorUsers);
        setLoading((prev) => ({ ...prev, instructors: false }));
      })
      .catch((err) => {
        console.error("Error fetching instructors:", err);
        setLoading((prev) => ({ ...prev, instructors: false }));
      });
  };

  // Fetch all students
  const fetchStudents = () => {
    setLoading((prev) => ({ ...prev, students: true }));
    axios
      .get("http://localhost:8080/admin/users", {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((res) => {
        const allUsers = res.data || [];
        const studentUsers = allUsers.filter((user) => user.role === "STUDENT");
        setStudents(studentUsers);
        setLoading((prev) => ({ ...prev, students: false }));
      })
      .catch((err) => {
        console.error("Error fetching students:", err);
        setLoading((prev) => ({ ...prev, students: false }));
      });
  };

  useEffect(() => {
    fetchCourses();
    fetchInstructors();
    fetchStudents();
  }, []);

  // Handle course approval
  const handleCourseStatusChange = (courseId) => {
    axios
      .put(
        `http://localhost:8080/admin/courses/${courseId}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      )
      .then(() => {
        fetchCourses();
        setSelectedCourse(null);
        alert(`Course Approved successfully!`);
      })
      .catch((err) => {
        console.error("Error updating course status:", err);
        alert("Failed to update course status. Please try again.");
      });
  };

  // Handle course rejection
  const handleRejectCourse = (courseId) => {
    axios
      .put(
        `http://localhost:8080/admin/courses/${courseId}/reject`,
        {},
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      )
      .then(() => {
        fetchCourses();
        setSelectedCourse(null);
        alert(`Course Rejected successfully!`);
      })
      .catch((err) => {
        console.error("Error updating course status:", err);
        alert("Failed to update course status. Please try again.");
      });
  };

  // Filter courses based on status
  const getFilteredCourses = () => {
    if (courseFilter === "all") return courses;
    return courses.filter(
      (course) => course.status?.toUpperCase() === courseFilter.toUpperCase()
    );
  };

  const filteredCourses = getFilteredCourses();

  // Calculate statistics
  const stats = {
    totalCourses: courses.length,
    approvedCourses: courses.filter(
      (c) => c.status?.toUpperCase() === "APPROVED"
    ).length,
    pendingCourses: courses.filter(
      (c) => c.status?.toUpperCase() === "PENDING" || !c.status
    ).length,
    rejectedCourses: courses.filter(
      (c) => c.status?.toUpperCase() === "REJECTED"
    ).length,
    totalInstructors: instructors.length,
    totalStudents: students.length,
  };

  return (
    <div className="admin-dashboard">
      {/* Top Navigation Bar */}
      <nav className="admin-navbar">
        <div className="navbar-brand">
          <h2>Smart Learn Admin</h2>
        </div>
        <div className="navbar-links">
          <Link to="/admin" className="nav-link active">
            Dashboard
          </Link>
          <Link to="/admin/courses" className="nav-link">
            Manage Courses
          </Link>
          <Link to="/admin/users" className="nav-link">
            Manage Users
          </Link>
          <Link to="/admin/enrollments" className="nav-link">
            Enrollments
          </Link>
          <Link to="/admin/progress" className="nav-link">
            Student Progress
          </Link>
          <Link to="/admin/materials" className="nav-link">
            Materials
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Welcome to Smart Learn Admin Dashboard</h1>
            <p className="hero-description">
              Your comprehensive control center for managing courses,
              instructors, students, and the entire learning ecosystem. Monitor
              real-time progress, approve course submissions, and ensure quality
              education delivery.
            </p>
          </div>
          <div className="hero-image">
            <div className="hero-image-placeholder">
              <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient
                    id="grad1"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      style={{ stopColor: "#667eea", stopOpacity: 1 }}
                    />
                    <stop
                      offset="100%"
                      style={{ stopColor: "#764ba2", stopOpacity: 1 }}
                    />
                  </linearGradient>
                </defs>
                <rect width="400" height="300" fill="url(#grad1)" rx="20" />
                <circle cx="200" cy="120" r="40" fill="white" opacity="0.3" />
                <rect
                  x="160"
                  y="180"
                  width="80"
                  height="60"
                  fill="white"
                  opacity="0.3"
                  rx="5"
                />
                <text
                  x="200"
                  y="270"
                  textAnchor="middle"
                  fill="white"
                  fontSize="24"
                  fontWeight="bold"
                >
                  Smart Learn
                </text>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="stats-section">
        <h2 className="section-title">Platform Overview</h2>
        <p className="section-description">
          Get a quick snapshot of your learning platform's key metrics and
          statistics at a glance.
        </p>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-info">
              <h3>{stats.totalCourses}</h3>
              <p>Total Courses</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{stats.approvedCourses}</h3>
              <p>Approved Courses</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <h3>{stats.pendingCourses}</h3>
              <p>Pending Review</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👨‍🏫</div>
            <div className="stat-info">
              <h3>{stats.totalInstructors}</h3>
              <p>Instructors</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>{stats.totalStudents}</h3>
              <p>Active Students</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3>{stats.rejectedCourses}</h3>
              <p>Rejected Courses</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="main-content-section">
        <div className="content-header">
          <h2 className="section-title">Management Center</h2>
          <p className="section-description">
            Manage all aspects of your learning platform from one centralized
            location. Review course submissions, monitor user activity, and
            maintain platform quality.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="admin-tabs">
          <button
            className={activeTab === "overview" ? "active" : ""}
            onClick={() => setActiveTab("overview")}
          >
            📊 Overview
          </button>
          <button
            className={activeTab === "courses" ? "active" : ""}
            onClick={() => setActiveTab("courses")}
          >
            📚 All Courses
          </button>
          <button
            className={activeTab === "instructors" ? "active" : ""}
            onClick={() => setActiveTab("instructors")}
          >
            👨‍🏫 All Instructors
          </button>
          <button
            className={activeTab === "students" ? "active" : ""}
            onClick={() => setActiveTab("students")}
          >
            👥 All Students
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="admin-content">
            <div className="overview-grid">
              <div className="overview-card">
                <h3>Quick Actions</h3>
                <p>Access frequently used admin functions quickly</p>
                <div className="quick-actions">
                  <Link to="/admin/courses" className="action-btn">
                    Manage Courses
                  </Link>
                  <Link to="/admin/users" className="action-btn">
                    Manage Users
                  </Link>
                  <Link to="/admin/progress" className="action-btn">
                    View Progress
                  </Link>
                  <Link to="/admin/enrollments" className="action-btn">
                    Enrollments
                  </Link>
                </div>
              </div>
              <div className="overview-card">
                <h3>Recent Activity</h3>
                <p>Monitor the latest platform activities and updates</p>
                <div className="activity-list">
                  <div className="activity-item">
                    <span className="activity-icon">📚</span>
                    <div className="activity-text">
                      <strong>{stats.pendingCourses} courses</strong> awaiting
                      approval
                    </div>
                  </div>
                  <div className="activity-item">
                    <span className="activity-icon">👥</span>
                    <div className="activity-text">
                      <strong>{stats.totalStudents} students</strong> actively
                      learning
                    </div>
                  </div>
                  <div className="activity-item">
                    <span className="activity-icon">👨‍🏫</span>
                    <div className="activity-text">
                      <strong>{stats.totalInstructors} instructors</strong>{" "}
                      creating content
                    </div>
                  </div>
                </div>
              </div>
              <div className="overview-card">
                <h3>Platform Health</h3>
                <p>Overall system status and performance metrics</p>
                <div className="health-metrics">
                  <div className="metric-item">
                    <span className="metric-label">Course Approval Rate</span>
                    <div className="metric-bar">
                      <div
                        className="metric-fill"
                        style={{
                          width: `${
                            stats.totalCourses > 0
                              ? (stats.approvedCourses / stats.totalCourses) *
                                100
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                    <span className="metric-value">
                      {stats.totalCourses > 0
                        ? (
                            (stats.approvedCourses / stats.totalCourses) *
                            100
                          ).toFixed(1)
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Active Users</span>
                    <span className="metric-value-large">
                      {stats.totalStudents + stats.totalInstructors}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === "courses" && (
          <div className="admin-content">
            <div className="content-intro">
              <h3>Course Management</h3>
              <p>
                Review and manage all courses in your platform. Approve
                high-quality content, reject submissions that don't meet
                standards, and maintain the quality of your learning catalog.
              </p>
            </div>

            {/* Course Filter Buttons */}
            <div className="filter-buttons">
              <button
                className={courseFilter === "all" ? "active-filter" : ""}
                onClick={() => setCourseFilter("all")}
              >
                All Courses ({courses.length})
              </button>
              <button
                className={courseFilter === "approved" ? "active-filter" : ""}
                onClick={() => setCourseFilter("approved")}
              >
                Approved ({stats.approvedCourses})
              </button>
              <button
                className={courseFilter === "rejected" ? "active-filter" : ""}
                onClick={() => setCourseFilter("rejected")}
              >
                Rejected ({stats.rejectedCourses})
              </button>
              <button
                className={courseFilter === "pending" ? "active-filter" : ""}
                onClick={() => setCourseFilter("pending")}
              >
                Pending ({stats.pendingCourses})
              </button>
            </div>

            {/* Courses Table */}
            {loading.courses ? (
              <div className="loading-message">Loading courses...</div>
            ) : filteredCourses.length === 0 ? (
              <div className="no-data-message">No courses found</div>
            ) : (
              <div className="courses-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCourses.map((course) => (
                      <React.Fragment key={course.id}>
                        <tr
                          className="course-row"
                          onClick={() =>
                            setSelectedCourse(
                              selectedCourse?.id === course.id ? null : course
                            )
                          }
                          style={{ cursor: "pointer" }}
                        >
                          <td>{course.id}</td>
                          <td>{course.title || "N/A"}</td>
                          <td>
                            {course.description
                              ? course.description.length > 50
                                ? `${course.description.substring(0, 50)}...`
                                : course.description
                              : "N/A"}
                          </td>
                          <td>
                            <span
                              className={`status-badge status-${
                                course.status?.toLowerCase() || "pending"
                              }`}
                            >
                              {course.status || "PENDING"}
                            </span>
                          </td>
                          <td>
                            <button
                              className="view-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCourse(
                                  selectedCourse?.id === course.id
                                    ? null
                                    : course
                                );
                              }}
                            >
                              {selectedCourse?.id === course.id
                                ? "Hide"
                                : "View Details"}
                            </button>
                          </td>
                        </tr>
                        {selectedCourse?.id === course.id && (
                          <tr className="course-details-row">
                            <td colSpan="5">
                              <div className="course-details">
                                <h3>Course Details</h3>
                                <div className="course-details-content">
                                  <p>
                                    <strong>ID:</strong> {course.id}
                                  </p>
                                  <p>
                                    <strong>Title:</strong>{" "}
                                    {course.title || "N/A"}
                                  </p>
                                  <p>
                                    <strong>Description:</strong>{" "}
                                    {course.description || "N/A"}
                                  </p>
                                  <p>
                                    <strong>Status:</strong>{" "}
                                    {course.status || "PENDING"}
                                  </p>
                                  {course.instructorName && (
                                    <p>
                                      <strong>Instructor:</strong>{" "}
                                      {course.instructorName}
                                    </p>
                                  )}
                                </div>
                                <div className="course-actions">
                                  <button
                                    className="approve-btn"
                                    onClick={() =>
                                      handleCourseStatusChange(course.id)
                                    }
                                    disabled={
                                      course.status?.toUpperCase() ===
                                      "APPROVED"
                                    }
                                  >
                                    Approve Course
                                  </button>
                                  <button
                                    className="reject-btn"
                                    onClick={() =>
                                      handleRejectCourse(course.id)
                                    }
                                    disabled={
                                      course.status?.toUpperCase() ===
                                      "REJECTED"
                                    }
                                  >
                                    Reject Course
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Instructors Tab */}
        {activeTab === "instructors" && (
          <div className="admin-content">
            <div className="content-intro">
              <h3>Instructor Management</h3>
              <p>
                View and manage all instructors on your platform. Monitor
                instructor activity, track course creation, and ensure quality
                content delivery from your teaching team.
              </p>
            </div>
            {loading.instructors ? (
              <div className="loading-message">Loading instructors...</div>
            ) : instructors.length === 0 ? (
              <div className="no-data-message">No instructors found</div>
            ) : (
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {instructors.map((instructor) => (
                      <tr key={instructor.id}>
                        <td>{instructor.id}</td>
                        <td>
                          {instructor.name || instructor.username || "N/A"}
                        </td>
                        <td>{instructor.email || "N/A"}</td>
                        <td>
                          <span className="status-badge status-instructor">
                            {instructor.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Students Tab */}
        {activeTab === "students" && (
          <div className="admin-content">
            <div className="content-intro">
              <h3>Student Management</h3>
              <p>
                Monitor all students enrolled in your platform. Track enrollment
                statistics, view learning progress, and ensure students have
                access to quality educational content.
              </p>
            </div>
            {loading.students ? (
              <div className="loading-message">Loading students...</div>
            ) : students.length === 0 ? (
              <div className="no-data-message">No students found</div>
            ) : (
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id}>
                        <td>{student.id}</td>
                        <td>{student.name || student.username || "N/A"}</td>
                        <td>{student.email || "N/A"}</td>
                        <td>
                          <span className="status-badge status-student">
                            {student.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
