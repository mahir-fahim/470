import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const BookSearch = () => {
  const { user } = useAuth();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [requesting, setRequesting] = useState("");

  useEffect(() => {
    // Fetch all categories from books
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/books/search");
        const cats = Array.from(new Set(res.data.books.map((b) => b.category)));
        setCategories(cats);
      } catch (err) {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    // Fetch user's borrow requests
    const fetchRequests = async () => {
      if (!user) return;
      try {
        const res = await axios.get("/api/borrow-requests/my");
        setMyRequests(res.data.requests);
      } catch (err) {
        setMyRequests([]);
      }
    };
    fetchRequests();
  }, [user]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const params = {};
      if (q) params.q = q;
      if (category) params.category = category;
      const res = await axios.get("/api/books/search", { params });
      // Only show books with copiesAvailable > 0
      setBooks(res.data.books.filter((b) => b.copiesAvailable > 0));
    } catch (err) {
      setBooks([]);
    }
    setLoading(false);
  };

  const handleRequest = async (bookId) => {
    setRequesting(bookId);
    try {
      await axios.post("/api/borrow-requests", { bookId });
      // Refresh requests
      const res = await axios.get("/api/borrow-requests/my");
      setMyRequests(res.data.requests);
      alert("Request submitted!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to request");
    }
    setRequesting("");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Search Books</h1>
        </div>
        <form onSubmit={handleSearch} style={{ marginBottom: 20 }}>
          <div className="form-group">
            <label>Search (Title, Author, ISBN)</label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Enter keyword"
            />
          </div>
          <div className="form-group">
            <label>Category (optional)</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
        <div>
          {books.length === 0 && !loading && <p>No books found.</p>}
          {books.length > 0 && (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>ISBN</th>
                  <th>Category</th>
                  <th>Copies</th>
                  {user && user.role === "user" && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {books.map((book) => {
                  let req = myRequests.find(
                    (r) => r.book._id === book._id && r.status === "pending"
                  );
                  return (
                    <tr key={book._id}>
                      <td>{book.title}</td>
                      <td>{book.author}</td>
                      <td>{book.ISBN}</td>
                      <td>{book.category}</td>
                      <td>{book.copiesAvailable}</td>
                      {user && user.role === "user" && (
                        <td>
                          {req ? (
                            <span style={{ color: "#888" }}>Requested</span>
                          ) : (
                            <button
                              className="btn btn-primary"
                              disabled={requesting === book._id}
                              onClick={() => handleRequest(book._id)}
                            >
                              {requesting === book._id
                                ? "Requesting..."
                                : "Request"}
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookSearch;
