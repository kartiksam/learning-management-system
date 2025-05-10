import axios from "axios";
import React, { useEffect, useState } from "react";
import { getToken } from "../../utils/auth";

const CourseListInstructor = () => {
  const [courses, setCourses] = useState([]);

  //   setTimeout(()=>{
  // calculateNewValue()
  // })
  useEffect(() => {
    const token = getToken();
    axios
      .get("http://localhost:8080/api/courses/instructor", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response);
        setCourses(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <h1>Instructor Created Courses</h1>
      <ul>
        {courses.map((course) => (
          <li key={course.id}>
            {course.title} - {course.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseListInstructor;
