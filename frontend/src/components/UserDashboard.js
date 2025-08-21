import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

const UserDashboard = () => {
  const { user } = useAuth();
  const [borrowingHistory, setBorrowingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("current");

  useEffect(() => {
    fetchBorrowingHistory();
  }, []);

  const fetchBorrowingHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/borrow/my-history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBorrowingHistory(response.data.records);
    } catch (error) {
      console.error("Error fetching borrowing history:", error);
      toast.error("Failed to load borrowing history");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "borrowed":
        return "#3498db";
      case "returned":
        return "#27ae60";
      case "overdue":
        return "#e74c3c";
      default:
        return "#666";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "borrowed":
        return "Currently Borrowed";
      case "returned":
        return "Returned";
      case "overdue":
        return "Overdue";
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDaysRemainingText = (dueDate) => {
    const days = calculateDaysRemaining(dueDate);
    if (days < 0) {
      return `${Math.abs(days)} days overdue`;
    } else if (days === 0) {
      return "Due today";
    } else if (days === 1) {
      return "Due tomorrow";
    } else {
      return `${days} days remaining`;
    }
  };

  const getDaysRemainingColor = (dueDate) => {
    const days = calculateDaysRemaining(dueDate);
    if (days < 0) {
      return "#e74c3c";
    } else if (days <= 3) {
      return "#f39c12";
    } else {
      return "#27ae60";
    }
  };

  const currentBooks = borrowingHistory.filter(
    (record) => record.status === "borrowed" || record.status === "overdue"
  );

  const returnedBooks = borrowingHistory.filter(
    (record) => record.status === "returned"
  );

  const overdueBooks = borrowingHistory.filter(
    (record) => record.status === "overdue"
  );

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <div className="loading" style={{ margin: "0 auto 20px" }}></div>
        <p>Loading your borrowing history...</p>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <h2>📚 My Library Dashboard</h2>
        <p>Welcome back, {user?.firstName}! Here's your borrowing activity.</p>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon">📖</div>
          <div className="card-content">
            <h3>{currentBooks.length}</h3>
            <p>Currently Borrowed</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="card-icon">⏰</div>
          <div className="card-content">
            <h3>{overdueBooks.length}</h3>
            <p>Overdue Books</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="card-icon">✅</div>
          <div className="card-content">
            <h3>{returnedBooks.length}</h3>
            <p>Books Returned</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <h3>
              $
              {borrowingHistory
                .reduce((sum, record) => sum + (record.fine || 0), 0)
                .toFixed(2)}
            </h3>
            <p>Total Fines</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === "current" ? "active" : ""}`}
          onClick={() => setActiveTab("current")}
        >
          Currently Borrowed ({currentBooks.length})
        </button>
        <button
          className={`tab-button ${activeTab === "history" ? "active" : ""}`}
          onClick={() => setActiveTab("history")}
        >
          Borrowing History ({returnedBooks.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "current" && (
          <div className="current-books">
            {currentBooks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📚</div>
                <h3>No books currently borrowed</h3>
                <p>Visit the library to borrow some books!</p>
              </div>
            ) : (
              <div className="books-grid">
                {currentBooks.map((record) => (
                  <div key={record._id} className="book-card current">
                    <div className="book-header">
                      <h3>{record.book.title}</h3>
                      <span
                        className="status-badge"
                        style={{
                          backgroundColor: getStatusColor(record.status),
                        }}
                      >
                        {getStatusText(record.status)}
                      </span>
                    </div>
                    <div className="book-details">
                      <p>
                        <strong>Author:</strong> {record.book.author}
                      </p>
                      <p>
                        <strong>ISBN:</strong> {record.book.ISBN}
                      </p>
                      <p>
                        <strong>Category:</strong> {record.book.category}
                      </p>
                      <p>
                        <strong>Borrowed:</strong>{" "}
                        {formatDate(record.borrowedDate)}
                      </p>
                      <p>
                        <strong>Due Date:</strong> {formatDate(record.dueDate)}
                      </p>
                      <p
                        className="days-remaining"
                        style={{ color: getDaysRemainingColor(record.dueDate) }}
                      >
                        <strong>{getDaysRemainingText(record.dueDate)}</strong>
                      </p>
                      {record.fine > 0 && (
                        <p className="fine-amount">
                          <strong>Fine:</strong> ${record.fine.toFixed(2)}
                        </p>
                      )}
                    </div>
                    <div className="book-footer">
                      <small>
                        Issued by: {record.issuedBy.firstName}{" "}
                        {record.issuedBy.lastName}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div className="borrowing-history">
            {returnedBooks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📖</div>
                <h3>No borrowing history yet</h3>
                <p>Your returned books will appear here.</p>
              </div>
            ) : (
              <div className="history-table">
                <table>
                  <thead>
                    <tr>
                      <th>Book Title</th>
                      <th>Author</th>
                      <th>Borrowed Date</th>
                      <th>Due Date</th>
                      <th>Returned Date</th>
                      <th>Fine</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {returnedBooks.map((record) => (
                      <tr key={record._id}>
                        <td>{record.book.title}</td>
                        <td>{record.book.author}</td>
                        <td>{formatDate(record.borrowedDate)}</td>
                        <td>{formatDate(record.dueDate)}</td>
                        <td>{formatDateTime(record.returnedDate)}</td>
                        <td>
                          {record.fine > 0 ? (
                            <span className="fine">
                              ${record.fine.toFixed(2)}
                            </span>
                          ) : (
                            <span className="no-fine">$0.00</span>
                          )}
                        </td>
                        <td>
                          <span
                            className="status-badge"
                            style={{
                              backgroundColor: getStatusColor(record.status),
                            }}
                          >
                            {getStatusText(record.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Overdue Warning */}
      {overdueBooks.length > 0 && (
        <div className="overdue-warning">
          <div className="warning-icon">⚠️</div>
          <div className="warning-content">
            <h3>You have {overdueBooks.length} overdue book(s)</h3>
            <p>
              Please return these books as soon as possible to avoid additional
              fines. Current fine rate: $1.00 per day.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
