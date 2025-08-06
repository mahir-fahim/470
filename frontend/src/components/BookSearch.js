import React, { useState } from "react";
import axios from "axios";

const BookSearch = () => {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const params = {};
      if (q) params.q = q;
      if (category) params.category = category;
      const res = await axios.get("/api/books/search", { params });
      setBooks(res.data.books);
    } catch (err) {
      setBooks([]);
    }
    setLoading(false);
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
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Fiction, Science"
            />
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
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book._id}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.ISBN}</td>
                    <td>{book.category}</td>
                    <td>{book.copiesAvailable}</td>
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

export default BookSearch;
