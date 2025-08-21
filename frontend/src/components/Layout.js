import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import BookSearch from "./BookSearch";

const Layout = ({ children }) => {
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

  // Search bar state
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="container">
          <div className="navbar-content">
            <Link to="/library" className="navbar-brand">
              E-Library Management System
            </Link>
            <ul className="navbar-nav">
              <li>
                <Link to="/library" className="nav-link">
                  My Library
                </Link>
              </li>
              {(user?.role === "admin" || user?.role === "staff") && (
                <li>
                  <Link to="/borrow" className="nav-link">
                    Borrowing Management
                  </Link>
                </li>
              )}
              {user?.role === "admin" && (
                <li>
                  <Link to="/books/new" className="nav-link">
                    Add New Book
                  </Link>
                </li>
              )}
              <li>
                <button
                  className="nav-link"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowSearch((s) => !s)}
                  title="Search Books"
                >
                  🔍 Search Books
                </button>
              </li>
              <li>
                <span className="nav-link" style={{ color: "#666" }}>
                  {getRoleDisplayName(user?.role)}: {user?.firstName}{" "}
                  {user?.lastName}
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
                  }}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {showSearch && (
        <div
          style={{
            background: "rgba(0,0,0,0.2)",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setShowSearch(false)}
        >
          <div
            style={{ minWidth: 350, maxWidth: 600, width: "90vw" }}
            onClick={(e) => e.stopPropagation()}
          >
            <BookSearch />
            <button
              className="btn btn-secondary"
              style={{ marginTop: 10, width: "100%" }}
              onClick={() => setShowSearch(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="container">
        <div className="main-content">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
