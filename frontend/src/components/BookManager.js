import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

const BookManager = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchBooks = async () => {
    try {
      const res = await axios.get("/api/books");
      setBooks(res.data.books);
    } catch (err) {
      toast.error("Failed to fetch books");
    }
  };

  useEffect(() => {
    if (user?.role === "admin") fetchBooks();
  }, [user]);

  const startEdit = (book) => {
    setEditingId(book._id);
    setEditForm({ ...book });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: name === "copiesAvailable" ? Number(value) : value,
    }));
  };

  const saveEdit = async () => {
    setLoading(true);
    try {
      await axios.put(`/api/books/${editingId}`, editForm);
      toast.success("Book updated!");
      setEditingId(null);
      fetchBooks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
    setLoading(false);
  };

  const deleteBook = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    setLoading(true);
    try {
      await axios.delete(`/api/books/${id}`);
      toast.success("Book deleted!");
      fetchBooks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
    setLoading(false);
  };

  if (!user || user.role !== "admin") return null;

  return (
    <div style={{ marginTop: 40 }}>
      <h2>Manage Books</h2>
      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}
      >
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>ISBN</th>
            <th>Category</th>
            <th>Copies</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) =>
            editingId === book._id ? (
              <tr key={book._id}>
                <td>
                  <input
                    name="title"
                    value={editForm.title}
                    onChange={handleEditChange}
                  />
                </td>
                <td>
                  <input
                    name="author"
                    value={editForm.author}
                    onChange={handleEditChange}
                  />
                </td>
                <td>
                  <input
                    name="ISBN"
                    value={editForm.ISBN}
                    onChange={handleEditChange}
                  />
                </td>
                <td>
                  <input
                    name="category"
                    value={editForm.category}
                    onChange={handleEditChange}
                  />
                </td>
                <td>
                  <input
                    name="copiesAvailable"
                    type="number"
                    min="0"
                    value={editForm.copiesAvailable}
                    onChange={handleEditChange}
                  />
                </td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={saveEdit}
                    disabled={loading}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={cancelEdit}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ) : (
              <tr key={book._id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.ISBN}</td>
                <td>{book.category}</td>
                <td>{book.copiesAvailable}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => startEdit(book)}
                    disabled={loading}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => deleteBook(book._id)}
                    disabled={loading}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BookManager;
