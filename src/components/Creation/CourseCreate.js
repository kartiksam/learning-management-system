import axios from "axios";
import React, { useState } from "react";
import { getToken } from "../../utils/auth";
import { Link, useNavigate } from "react-router-dom";

const CourseCreate = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
  });
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

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
    <div>
      <h1>CourseCreate</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          value={form.title}
          placeholder="title"
          onChange={handleChange}
          required
        ></input>

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <button type="submit">Create</button>
      </form>
      <Link to="/list">Available Courses</Link>
    </div>
  );
};

export default CourseCreate;
