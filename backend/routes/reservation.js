const express = require("express");
const { authenticateToken, requireAdmin } = require("../middleware/auth");
const reservationController = require("../controllers/reservationController");

const router = express.Router();

// User: create reservation
router.post("/", authenticateToken, reservationController.createReservation);
// User: view own reservations
router.get("/my", authenticateToken, reservationController.myReservations);
// User: cancel reservation
router.put(
  "/:id/cancel",
  authenticateToken,
  reservationController.cancelReservation
);
// Admin: list all reservations
router.get(
  "/",
  authenticateToken,
  requireAdmin,
  reservationController.listReservations
);
// Admin: fulfill reservation
router.put(
  "/:id/fulfill",
  authenticateToken,
  requireAdmin,
  reservationController.fulfillReservation
);

module.exports = router;
