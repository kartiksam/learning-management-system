import axios from "axios";
import React, { useState } from "react";
import { getToken } from "../../utils/auth";
import { Link } from "react-router-dom";
import "./CourseCreate.css";

const CourseCreate = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = getToken();
    axios
      .post("http://localhost:8080/api/courses/create", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
    // navigate("/inscourse");
  };

  return (
    <div className="course-create-container">
      <h1>Create Course</h1>
      <form onSubmit={handleSubmit} className="course-create-form">
        <div className="form-group">
          <label htmlFor="title">Course Title</label>
          <input
            id="title"
            name="title"
            value={form.title}
            placeholder="Enter course title"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Enter course description"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="create-button">
          <span>Create Course</span>
          <span className="button-icon">→</span>
        </button>
        <Link to="/list" className="course-link">
          View Available Courses
        </Link>
      </form>
    </div>
  );
};

export default CourseCreate;
