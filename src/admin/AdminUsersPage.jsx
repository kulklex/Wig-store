import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/auth/admin", { withCredentials: true });
        setUsers(res.data);
      } catch (err) {
        console.log("Failed to fetch users", err);
      } finally {
        setLoading(false);
      }
    };
    
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    fetchUsers();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) {
    return <div className="text-center my-5">Loading users...</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center text-md-start">Manage Users</h2>

      <div className="table-responsive">
        <table className="table table-bordered table-striped align-middle">
          <thead className="table-dark">
            <tr>
              {!isMobile && <th>User ID</th>}
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              {!isMobile && <th>Signed Up</th>}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                {!isMobile && <td>{user._id.slice(-6)}</td>}
                <td>{user.name || "—"}</td>
                <td>{user.email}</td>
                <td>
                  <span
                    className={`badge text-bg-${
                      user.role === "admin" ? "primary" : "secondary"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                {!isMobile && (
                  <td>{format(new Date(user.createdAt), "dd MMM yyyy")}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <p className="text-center text-muted mt-4">No users found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;