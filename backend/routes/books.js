const express = require("express");
const { body } = require("express-validator");
const { authenticateToken, requireAdmin } = require("../middleware/auth");
const bookController = require("../controllers/bookController");

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
  bookController.addBook
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
  bookController.updateBook
);

// Delete a book (admin only)
router.delete(
  "/:id",
  authenticateToken,
  requireAdmin,
  bookController.deleteBook
);

// Get all books (for listing)
router.get("/", authenticateToken, requireAdmin, bookController.listBooks);

// Public search endpoint (no auth required)
router.get("/search", bookController.searchBooks);

module.exports = router;
