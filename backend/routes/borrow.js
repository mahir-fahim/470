const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { authenticateToken, requireRole } = require("../middleware/auth");
const borrowController = require("../controllers/borrowController");

// Get user's borrowing history (for the logged-in user)
router.get("/my-history", authenticateToken, borrowController.getMyHistory);

// Get all borrowing records (admin/staff only)
router.get(
  "/all",
  authenticateToken,
  requireRole(["admin", "staff"]),
  borrowController.getAllRecords
);

// Issue a book to a user (admin/staff only)
router.post(
  "/issue",
  authenticateToken,
  requireRole(["admin", "staff"]),
  [
    body("userId").isMongoId().withMessage("Valid user ID is required"),
    body("bookId").isMongoId().withMessage("Valid book ID is required"),
    body("dueDate").isISO8601().withMessage("Valid due date is required"),
    body("notes").optional().isString().trim(),
  ],
  borrowController.issueBook
);

// Return a book (admin/staff only)
router.put(
  "/return/:recordId",
  authenticateToken,
  requireRole(["admin", "staff"]),
  borrowController.returnBook
);

// Get overdue books
router.get(
  "/overdue",
  authenticateToken,
  requireRole(["admin", "staff"]),
  borrowController.getOverdue
);

// Get borrowing statistics
router.get(
  "/stats",
  authenticateToken,
  requireRole(["admin", "staff"]),
  borrowController.getStats
);

module.exports = router;
