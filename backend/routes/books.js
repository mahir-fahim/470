const express = require("express");
const { body, validationResult } = require("express-validator");
const Book = require("../models/Book");
const { authenticateToken, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// Add a new book (admin only)
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("author").notEmpty().withMessage("Author is required"),
    body("ISBN").notEmpty().withMessage("ISBN is required"),
    body("category").notEmpty().withMessage("Category is required"),
    body("copiesAvailable")
      .isInt({ min: 0 })
      .withMessage("Copies available must be a non-negative integer"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: errors.array() });
    }
    try {
      const { title, author, ISBN, category, copiesAvailable } = req.body;
      const book = new Book({ title, author, ISBN, category, copiesAvailable });
      await book.save();
      res.status(201).json({ message: "Book added successfully", book });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ message: "ISBN must be unique" });
      }
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Edit a book (admin only)
router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("author").notEmpty().withMessage("Author is required"),
    body("ISBN").notEmpty().withMessage("ISBN is required"),
    body("category").notEmpty().withMessage("Category is required"),
    body("copiesAvailable")
      .isInt({ min: 0 })
      .withMessage("Copies available must be a non-negative integer"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: errors.array() });
    }
    try {
      const { title, author, ISBN, category, copiesAvailable } = req.body;
      const book = await Book.findByIdAndUpdate(
        req.params.id,
        { title, author, ISBN, category, copiesAvailable },
        { new: true, runValidators: true }
      );
      if (!book) return res.status(404).json({ message: "Book not found" });
      res.json({ message: "Book updated successfully", book });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ message: "ISBN must be unique" });
      }
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Delete a book (admin only)
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all books (for listing)
router.get("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json({ books });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Public search endpoint (no auth required)
router.get("/search", async (req, res) => {
  try {
    const { q, category } = req.query;
    const query = {};
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: "i" } },
        { author: { $regex: q, $options: "i" } },
        { ISBN: { $regex: q, $options: "i" } },
      ];
    }
    if (category) {
      query.category = category;
    }
    const books = await Book.find(query).sort({ createdAt: -1 });
    res.json({ books });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
