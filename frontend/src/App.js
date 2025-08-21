import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Layout from "./components/Layout";
import MyLibraryPage from "./pages/MyLibraryPage";
import BorrowingManagementPage from "./pages/BorrowingManagementPage";
import AddBookPage from "./pages/AddBookPage";

function App() {
  const { user, loading } = useAuth();
  const [authMode, setAuthMode] = useState("login");

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "40px",
            borderRadius: "15px",
            boxShadow: "0 15px 35px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
          }}
        >
          <div className="loading" style={{ margin: "0 auto 20px" }}></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, show routed app
  if (user) {
    return (
      <Router>
        <Layout>
          <Routes>
            <Route path="/library" element={<MyLibraryPage />} />
            {(user.role === "admin" || user.role === "staff") && (
              <>
                <Route path="/borrow" element={<BorrowingManagementPage />} />
              </>
            )}
            {user.role === "admin" && (
              <Route path="/books/new" element={<AddBookPage />} />
            )}
            <Route path="*" element={<Navigate to="/library" replace />} />
          </Routes>
        </Layout>
      </Router>
    );
  }

  // Show authentication forms
  return (
    <div>
      {authMode === "login" ? (
        <Login onSwitchToSignup={() => setAuthMode("signup")} />
      ) : (
        <Signup onSwitchToLogin={() => setAuthMode("login")} />
      )}
    </div>
  );
}

export default App;
