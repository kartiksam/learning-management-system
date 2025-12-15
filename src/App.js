import "./App.css";
import HomePage from "./pages/HomePage";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import { Routes, Route, Navigate } from "react-router-dom";
import CourseCreate from "./components/Creation/CourseCreate";
import CourseListInstructor from "./components/LIstcourseinstr/CourseListInstructor";
import CourseListStudent from "./components/Listcourse/CourseListStudent";
import Mycourses from "./components/Cart/Mycourses";
import Dashboard from "./components/Dashboard/dashboard";
import MainLayout from "./pages/MainLayout";
import AdminDashboard from "./components/Admin/AdminDashboard";
import ManageUsers from "./components/Admin/ManageUsers";
import ManageCourses from "./components/Admin/ManageCourses";
import EnrollmentsList from "./components/Admin/EnrollmentsList";
import MaterialUpload from "./components/Admin/MaterialUpload";
import ProgressTracker from "./components/Admin/ProgressTracker";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import RoleBasedRoute from "./components/PrivateRoute/RoleBasedRoute";
import PublicRoute from "./components/PrivateRoute/PublicRoute";
import VerifyEmail from "./pages/VerifyEmail";

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Public routes - accessible without authentication */}
        <Route path="/" element={<HomePage />} />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/verify-email"
          element={
            <PublicRoute>
              <VerifyEmail />
            </PublicRoute>
          }
        />

        {/* All authenticated pages share the main layout (with profile + logout) */}
        <Route
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          {/* General authenticated routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/list" element={<CourseListStudent />} />
          <Route path="/enrolled-courses" element={<Mycourses />} />

          {/* Instructor-only routes */}
          <Route
            path="/create"
            element={
              <RoleBasedRoute allowedRoles={["INSTRUCTOR", "ADMIN"]}>
                <CourseCreate />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/inscourse"
            element={
              <RoleBasedRoute allowedRoles={["INSTRUCTOR", "ADMIN"]}>
                <CourseListInstructor />
              </RoleBasedRoute>
            }
          />

          {/* Admin-only routes */}
          <Route
            path="/admin"
            element={
              <RoleBasedRoute allowedRoles={["ADMIN"]}>
                <AdminDashboard />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <RoleBasedRoute allowedRoles={["ADMIN"]}>
                <ManageUsers />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/admin/courses"
            element={
              <RoleBasedRoute allowedRoles={["ADMIN"]}>
                <ManageCourses />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/admin/enrollments"
            element={
              <RoleBasedRoute allowedRoles={["ADMIN"]}>
                <EnrollmentsList />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/admin/materials"
            element={
              <RoleBasedRoute allowedRoles={["ADMIN"]}>
                <MaterialUpload />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/admin/progress"
            element={
              <RoleBasedRoute allowedRoles={["ADMIN"]}>
                <ProgressTracker />
              </RoleBasedRoute>
            }
          />
        </Route>

        {/* Catch-all route - redirect any undefined routes to dashboard (inside layout) */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}

export default App;
