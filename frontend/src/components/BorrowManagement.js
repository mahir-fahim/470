import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

const BorrowManagement = () => {
  const { user } = useAuth();
  const [borrowingRecords, setBorrowingRecords] = useState([]);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [stats, setStats] = useState({});
  const [issueForm, setIssueForm] = useState({
    userId: "",
    bookId: "",
    dueDate: "",
    notes: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch all data in parallel
      const [recordsRes, usersRes, booksRes, statsRes] = await Promise.all([
        axios.get("/api/borrow/all", { headers }),
        axios.get("/api/auth/users", { headers }),
        axios.get("/api/books", { headers }),
        axios.get("/api/borrow/stats", { headers }),
      ]);

      setBorrowingRecords(recordsRes.data.records);
      setUsers(usersRes.data.users);
      setBooks(booksRes.data.books);
      // Extract unique categories
      setCategories(
        Array.from(new Set(booksRes.data.books.map((b) => b.category)))
      );
      setStats(statsRes.data.stats);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleIssueBook = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("/api/borrow/issue", issueForm, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Book issued successfully!");
      setIssueForm({ userId: "", bookId: "", dueDate: "", notes: "" });
      fetchData(); // Refresh data
    } catch (error) {
      console.error("Error issuing book:", error);
      toast.error(error.response?.data?.message || "Failed to issue book");
    }
  };

  const handleReturnBook = async (recordId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/borrow/return/${recordId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Book returned successfully!");
      fetchData(); // Refresh data
    } catch (error) {
      console.error("Error returning book:", error);
      toast.error(error.response?.data?.message || "Failed to return book");
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

  const filteredRecords = borrowingRecords.filter((record) => {
    if (activeTab === "all") return true;
    return record.status === activeTab;
  });

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <div className="loading" style={{ margin: "0 auto 20px" }}></div>
        <p>Loading borrowing management...</p>
      </div>
    );
  }

  return (
    <div className="borrow-management">
      <div className="management-header">
        <h2>📚 Borrowing Management</h2>
        <p>Manage book borrowing operations and track user activity.</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon">📖</div>
          <div className="stat-content">
            <h3>{stats.totalBorrowed || 0}</h3>
            <p>Currently Borrowed</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <h3>{stats.totalOverdue || 0}</h3>
            <p>Overdue Books</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.totalReturned || 0}</h3>
            <p>Books Returned</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>${(stats.totalFines || 0).toFixed(2)}</h3>
            <p>Total Fines</p>
          </div>
        </div>
      </div>

      {/* Issue Book Form */}
      <div className="issue-book-section">
        <h3>📤 Issue Book to User</h3>
        <form onSubmit={handleIssueBook} className="issue-form">
          <div className="form-row">
            <div className="form-group">
              <label>Select User:</label>
              <select
                value={issueForm.userId}
                onChange={(e) =>
                  setIssueForm({ ...issueForm, userId: e.target.value })
                }
                required
              >
                <option value="">Choose a user...</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.firstName} {user.lastName} ({user.username})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Filter by Category:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Select Book:</label>
              <select
                value={issueForm.bookId}
                onChange={(e) =>
                  setIssueForm({ ...issueForm, bookId: e.target.value })
                }
                required
              >
                <option value="">Choose a book...</option>
                {books
                  .filter(
                    (book) =>
                      book.copiesAvailable > 0 &&
                      (selectedCategory === "" ||
                        book.category === selectedCategory)
                  )
                  .map((book) => (
                    <option key={book._id} value={book._id}>
                      {book.title} by {book.author} ({book.copiesAvailable}{" "}
                      copies)
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Due Date:</label>
              <input
                type="date"
                value={issueForm.dueDate}
                onChange={(e) =>
                  setIssueForm({ ...issueForm, dueDate: e.target.value })
                }
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="form-group">
              <label>Notes (Optional):</label>
              <input
                type="text"
                value={issueForm.notes}
                onChange={(e) =>
                  setIssueForm({ ...issueForm, notes: e.target.value })
                }
                placeholder="Any additional notes..."
              />
            </div>
          </div>
          <button type="submit" className="issue-button">
            Issue Book
          </button>
        </form>
      </div>

      {/* Records Management */}
      <div className="records-section">
        <div className="section-header">
          <h3>📋 Borrowing Records</h3>
          <div className="tab-buttons">
            <button
              className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              All ({borrowingRecords.length})
            </button>
            <button
              className={`tab-btn ${activeTab === "borrowed" ? "active" : ""}`}
              onClick={() => setActiveTab("borrowed")}
            >
              Borrowed (
              {borrowingRecords.filter((r) => r.status === "borrowed").length})
            </button>
            <button
              className={`tab-btn ${activeTab === "overdue" ? "active" : ""}`}
              onClick={() => setActiveTab("overdue")}
            >
              Overdue (
              {borrowingRecords.filter((r) => r.status === "overdue").length})
            </button>
            <button
              className={`tab-btn ${activeTab === "returned" ? "active" : ""}`}
              onClick={() => setActiveTab("returned")}
            >
              Returned (
              {borrowingRecords.filter((r) => r.status === "returned").length})
            </button>
          </div>
        </div>

        <div className="records-table">
          {filteredRecords.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h3>No borrowing records found</h3>
              <p>Start by issuing some books to users.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Book</th>
                  <th>Borrowed Date</th>
                  <th>Due Date</th>
                  <th>Returned Date</th>
                  <th>Fine</th>
                  <th>Status</th>
                  <th>Issued By</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record._id}>
                    <td>
                      <div className="user-info">
                        <strong>
                          {record.user.firstName} {record.user.lastName}
                        </strong>
                        <small>{record.user.email}</small>
                      </div>
                    </td>
                    <td>
                      <div className="book-info">
                        <strong>{record.book.title}</strong>
                        <small>{record.book.author}</small>
                      </div>
                    </td>
                    <td>{formatDate(record.borrowedDate)}</td>
                    <td>{formatDate(record.dueDate)}</td>
                    <td>
                      {record.returnedDate
                        ? formatDateTime(record.returnedDate)
                        : "-"}
                    </td>
                    <td>
                      {record.fine > 0 ? (
                        <span className="fine">${record.fine.toFixed(2)}</span>
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
                    <td>
                      {record.issuedBy.firstName} {record.issuedBy.lastName}
                    </td>
                    <td>
                      {record.status !== "returned" && (
                        <button
                          onClick={() => handleReturnBook(record._id)}
                          className="return-button"
                        >
                          Return
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default BorrowManagement;
