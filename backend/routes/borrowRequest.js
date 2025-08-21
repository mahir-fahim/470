const express = require("express");
const { authenticateToken, requireAdmin } = require("../middleware/auth");
const borrowRequestController = require("../controllers/borrowRequestController");

const router = express.Router();

// User: create a borrow request
router.post("/", authenticateToken, borrowRequestController.createRequest);
// User: view own requests
router.get("/my", authenticateToken, borrowRequestController.myRequests);
// Admin: list all requests
router.get(
  "/",
  authenticateToken,
  requireAdmin,
  borrowRequestController.listRequests
);
// Admin: approve
router.put(
  "/:id/approve",
  authenticateToken,
  requireAdmin,
  borrowRequestController.approveRequest
);
// Admin: reject
router.put(
  "/:id/reject",
  authenticateToken,
  requireAdmin,
  borrowRequestController.rejectRequest
);

module.exports = router;
