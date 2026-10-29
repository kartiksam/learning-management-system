import { useEffect, useState } from "react";
import axios from "axios";
import AITutor from "./AITutor";
import { getToken, getUserRole } from "../../utils/auth";
import "./AITutorWidget.css";

const COURSE_STORAGE_KEY = "smartlearn-ai-selected-course";

function getCourseLabel(course) {
  return course?.title || course?.name || `Course ${course?.id}`;
}

export default function AITutorWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState(() => {
    try {
      return localStorage.getItem(COURSE_STORAGE_KEY) || "";
    } catch {
      return "";
    }
  });
  const [coursesLoading, setCoursesLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setCoursesLoading(false);
      return;
    }

    const role = getUserRole();
    const endpoint =
      role === "ADMIN"
        ? "http://localhost:8080/admin/courses"
        : role === "INSTRUCTOR"
          ? "http://localhost:8080/api/courses/instructor"
          : "http://localhost:8080/api/courses/student";

    let cancelled = false;

    axios
      .get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (cancelled) return;

        const list = Array.isArray(res.data) ? res.data : [];
        setCourses(list);

        if (list.length === 0) {
          setCourseId("");
          return;
        }

        setCourseId((current) => {
          const savedStillValid = list.some(
            (course) => String(course.id) === String(current)
          );
          const nextId = savedStillValid
            ? String(current)
            : String(list[0].id);

          try {
            localStorage.setItem(COURSE_STORAGE_KEY, nextId);
          } catch {
            /* ignore */
          }

          return nextId;
        });
      })
      .catch((err) => {
        console.error("Could not load courses for AI Tutor:", err);
      })
      .finally(() => {
        if (!cancelled) setCoursesLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const handleCourseChange = (event) => {
    const nextId = event.target.value;
    setCourseId(nextId);
    try {
      localStorage.setItem(COURSE_STORAGE_KEY, nextId);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="ai-copilot">
      {!isOpen && (
        <button
          type="button"
          className="ai-copilot-fab"
          onClick={() => setIsOpen(true)}
          aria-label="Open SmartLearn Copilot"
          title="SmartLearn Copilot"
        >
          <span className="ai-copilot-fab-icon" aria-hidden="true">
            ✦
          </span>
        </button>
      )}

      {isOpen && (
        <>
          <button
            type="button"
            className="ai-copilot-backdrop"
            aria-label="Close Copilot"
            onClick={() => setIsOpen(false)}
          />

          <aside
            className="ai-copilot-panel"
            role="dialog"
            aria-modal="true"
            aria-label="SmartLearn Copilot"
          >
            <header className="ai-copilot-header">
              <div className="ai-copilot-header-left">
                <span className="ai-copilot-badge" aria-hidden="true">
                  ✦
                </span>
                <div>
                  <strong>SmartLearn Copilot</strong>
                  <span>Ask about your courses anytime</span>
                </div>
              </div>

              <button
                type="button"
                className="ai-copilot-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close Copilot"
                title="Close"
              >
                ×
              </button>
            </header>

            <div className="ai-copilot-course-bar">
              <label htmlFor="ai-copilot-course">Course context</label>
              <select
                id="ai-copilot-course"
                value={courseId}
                onChange={handleCourseChange}
                disabled={coursesLoading || courses.length === 0}
              >
                {coursesLoading && <option value="">Loading courses…</option>}
                {!coursesLoading && courses.length === 0 && (
                  <option value="">No courses available</option>
                )}
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {getCourseLabel(course)}
                  </option>
                ))}
              </select>
            </div>

            <div className="ai-copilot-body">
              {courseId ? (
                <AITutor courseId={courseId} compact />
              ) : (
                <div className="ai-copilot-empty">
                  <p>
                    {coursesLoading
                      ? "Loading your courses…"
                      : "Enroll in or create a course to start chatting with Copilot."}
                  </p>
                </div>
              )}
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
