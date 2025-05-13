// import axios from "axios";
// import React, { useEffect, useState } from "react";

// function StudentCourses() {
//   const [courses, setCourses] = useState([]);

//   useEffect(() => {
//     axios
//       .get("http://localhost:8080/api/courses/student")
//       .then((response) => {
//         setCourses(response.data);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }, []);

//   return (
//     <div>
//       <h2>Available Courses</h2>
//       <ul>
//         {courses.map((course) => (
//           <li key={course.id}>
//             {course.title} - {course.description}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default StudentCourses;

import React, { useEffect, useState } from "react";
import axios from "axios";
import StudentCourseCard from "../Cart/StudentCart";
import InstructorCourseCard from "../Cart/InstructorCart";
import { getUserRole } from "../../utils/auth";

const CourseListPage = () => {
  const [courses, setCourses] = useState([]);
  const role = getUserRole();

  useEffect(() => {
    const token = localStorage.getItem("token");

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

  return (
    <div className="course-list">
      <h2>{role} Courses</h2>
      {courses.map((course) =>
        role === "INSTRUCTOR" ? (
          <InstructorCourseCard key={course.id} course={course} />
        ) : (
          <StudentCourseCard key={course.id} course={course} />
        )
      )}
    </div>
  );
};

export default CourseListPage;
