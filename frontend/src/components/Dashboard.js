import React from "react";
import { useAuth } from "../contexts/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();

  const getRoleDisplayName = (role) => {
    switch (role) {
      case "admin":
        return "Administrator";
      case "staff":
        return "Library Staff";
      case "user":
        return "Library User";
      default:
        return role;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "#e74c3c";
      case "staff":
        return "#f39c12";
      case "user":
        return "#27ae60";
      default:
        return "#666";
    }
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="container">
          <div className="navbar-content">
            <a href="/" className="navbar-brand">
              E-Library Management System
            </a>
            <ul className="navbar-nav">
              <li>
                <span style={{ color: "#666" }}>
                  Welcome, {user?.firstName} {user?.lastName}
                </span>
              </li>
              <li>
                <button
                  onClick={logout}
                  className="nav-link"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "inherit",
                  }}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container">
        <div className="main-content">
          <div className="welcome-card">
            <h2>Welcome to E-Library Management System</h2>
            <p>Manage your library operations efficiently and securely</p>

            <div className="user-info">
              <h3>User Information</h3>
              <p>
                <strong>Name:</strong> {user?.firstName} {user?.lastName}
              </p>
              <p>
                <strong>Username:</strong> {user?.username}
              </p>
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
              <p>
                <strong>Phone:</strong> {user?.phoneNumber || "Not provided"}
              </p>
              <p>
                <strong>Role:</strong>{" "}
                <span
                  style={{
                    color: getRoleColor(user?.role),
                    fontWeight: "bold",
                  }}
                >
                  {getRoleDisplayName(user?.role)}
                </span>
              </p>
              <p>
                <strong>Member Since:</strong>{" "}
                {new Date(user?.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Last Login:</strong>{" "}
                {new Date(user?.lastLogin).toLocaleString()}
              </p>
            </div>

            <div style={{ marginTop: "30px", textAlign: "center" }}>
              <h3>Available Features</h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "20px",
                  marginTop: "20px",
                }}
              >
                <div
                  style={{
                    background: "#f8f9fa",
                    padding: "20px",
                    borderRadius: "10px",
                    border: "2px solid #e9ecef",
                  }}
                >
                  <h4>📚 Book Management</h4>
                  <p>Add, edit, and manage library books</p>
                </div>

                <div
                  style={{
                    background: "#f8f9fa",
                    padding: "20px",
                    borderRadius: "10px",
                    border: "2px solid #e9ecef",
                  }}
                >
                  <h4>🔍 Search & Filter</h4>
                  <p>Find books by title, author, ISBN, or category</p>
                </div>

                <div
                  style={{
                    background: "#f8f9fa",
                    padding: "20px",
                    borderRadius: "10px",
                    border: "2px solid #e9ecef",
                  }}
                >
                  <h4>📖 Issue & Return</h4>
                  <p>Manage book borrowing and returns</p>
                </div>

                <div
                  style={{
                    background: "#f8f9fa",
                    padding: "20px",
                    borderRadius: "10px",
                    border: "2px solid #e9ecef",
                  }}
                >
                  <h4>📅 Due Date Tracking</h4>
                  <p>Track due dates and calculate fines</p>
                </div>

                <div
                  style={{
                    background: "#f8f9fa",
                    padding: "20px",
                    borderRadius: "10px",
                    border: "2px solid #e9ecef",
                  }}
                >
                  <h4>👥 User History</h4>
                  <p>View borrowing history for all users</p>
                </div>

                <div
                  style={{
                    background: "#f8f9fa",
                    padding: "20px",
                    borderRadius: "10px",
                    border: "2px solid #e9ecef",
                  }}
                >
                  <h4>📋 Reservations</h4>
                  <p>Reserve books that are currently issued</p>
                </div>
              </div>
            </div>

            {(user?.role === "admin" || user?.role === "staff") && (
              <div
                style={{
                  marginTop: "30px",
                  padding: "20px",
                  background: "#fff3cd",
                  border: "1px solid #ffeaa7",
                  borderRadius: "10px",
                }}
              >
                <h3>🔧 Administrative Features</h3>
                <p>
                  As a {getRoleDisplayName(user?.role).toLowerCase()}, you have
                  access to:
                </p>
                <ul style={{ textAlign: "left", marginTop: "10px" }}>
                  <li>Add new books to the library</li>
                  <li>Edit book information and inventory</li>
                  <li>Issue books to users</li>
                  <li>Process book returns</li>
                  <li>Manage user accounts</li>
                  <li>Generate reports and analytics</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
