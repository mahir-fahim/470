import React, { useState } from "react";
import { useAuth } from "./contexts/AuthContext";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";

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

  // If user is authenticated, show dashboard
  if (user) {
    return <Dashboard />;
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
