import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

const AddBook = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: "",
    author: "",
    ISBN: "",
    category: "",
    copiesAvailable: 1,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (!user || user.role !== "admin") {
    return (
      <div style={{ color: "red", textAlign: "center" }}>
        Only admins can add books.
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "copiesAvailable" ? Number(value) : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title) newErrors.title = "Title is required";
    if (!form.author) newErrors.author = "Author is required";
    if (!form.ISBN) newErrors.ISBN = "ISBN is required";
    if (!form.category) newErrors.category = "Category is required";
    if (form.copiesAvailable < 0)
      newErrors.copiesAvailable = "Copies must be 0 or more";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await axios.post("/api/books", form);
      toast.success("Book added successfully!");
      setForm({
        title: "",
        author: "",
        ISBN: "",
        category: "",
        copiesAvailable: 1,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding book");
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Add New Book</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className={errors.title ? "error" : ""}
            />
            {errors.title && (
              <div className="error-message">{errors.title}</div>
            )}
          </div>
          <div className="form-group">
            <label>Author</label>
            <input
              name="author"
              value={form.author}
              onChange={handleChange}
              className={errors.author ? "error" : ""}
            />
            {errors.author && (
              <div className="error-message">{errors.author}</div>
            )}
          </div>
          <div className="form-group">
            <label>ISBN</label>
            <input
              name="ISBN"
              value={form.ISBN}
              onChange={handleChange}
              className={errors.ISBN ? "error" : ""}
            />
            {errors.ISBN && <div className="error-message">{errors.ISBN}</div>}
          </div>
          <div className="form-group">
            <label>Category</label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              className={errors.category ? "error" : ""}
            />
            {errors.category && (
              <div className="error-message">{errors.category}</div>
            )}
          </div>
          <div className="form-group">
            <label>Copies Available</label>
            <input
              name="copiesAvailable"
              type="number"
              min="0"
              value={form.copiesAvailable}
              onChange={handleChange}
              className={errors.copiesAvailable ? "error" : ""}
            />
            {errors.copiesAvailable && (
              <div className="error-message">{errors.copiesAvailable}</div>
            )}
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Book"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBook;
