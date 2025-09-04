const Reservation = require("../models/Reservation");
const Book = require("../models/Book");

// User reserves a book that is currently issued
exports.createReservation = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user._id;
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.copiesAvailable > 0) {
      return res
        .status(400)
        .json({ message: "Book is available, no need to reserve" });
    }
    // Prevent duplicate active reservation
    const existing = await Reservation.findOne({
      user: userId,
      book: bookId,
      status: "active",
    });
    if (existing) {
      return res
        .status(400)
        .json({
          message: "You already have an active reservation for this book.",
        });
    }
    const reservation = new Reservation({ user: userId, book: bookId });
    await reservation.save();
    res.status(201).json({ message: "Reservation created", reservation });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// User: list own reservations
exports.myReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id })
      .populate("book")
      .sort({ reservedAt: -1 });
    res.json({ reservations });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Admin: list all reservations
exports.listReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("user")
      .populate("book")
      .sort({ reservedAt: -1 });
    res.json({ reservations });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Admin: fulfill reservation (when book is returned)
exports.fulfillReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation || reservation.status !== "active") {
      return res
        .status(404)
        .json({ message: "Reservation not found or already processed" });
    }
    reservation.status = "fulfilled";
    reservation.fulfilledAt = new Date();
    await reservation.save();
    res.json({ message: "Reservation fulfilled", reservation });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// User: cancel reservation
exports.cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation || reservation.status !== "active") {
      return res
        .status(404)
        .json({ message: "Reservation not found or already processed" });
    }
    reservation.status = "cancelled";
    reservation.cancelledAt = new Date();
    await reservation.save();
    res.json({ message: "Reservation cancelled", reservation });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
