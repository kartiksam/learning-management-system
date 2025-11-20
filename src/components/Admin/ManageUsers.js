import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../utils/auth";
import "./AdminPage.css";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/admin/users", {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((res) => setUsers(res.data));
  }, []);

  return (
    <div className="admin-page-container">
      <h2>All Users</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.password}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
