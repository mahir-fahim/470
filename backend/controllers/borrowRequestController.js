const BorrowRequest = require("../models/BorrowRequest");
const Book = require("../models/Book");
const User = require("../models/User");

// User requests to borrow a book
exports.createRequest = async (req, res) => {
  try {
    const { bookId, notes } = req.body;
    const userId = req.user._id;
    const book = await Book.findById(bookId);
    if (!book || book.copiesAvailable < 1) {
      return res.status(400).json({ message: "Book not available" });
    }
    // Prevent duplicate pending requests
    const existing = await BorrowRequest.findOne({
      user: userId,
      book: bookId,
      status: "pending",
    });
    if (existing) {
      return res
        .status(400)
        .json({ message: "You already have a pending request for this book." });
    }
    const request = new BorrowRequest({ user: userId, book: bookId, notes });
    await request.save();
    res.status(201).json({ message: "Request submitted", request });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Admin: list all borrow requests
exports.listRequests = async (req, res) => {
  try {
    const requests = await BorrowRequest.find()
      .populate("user")
      .populate("book")
      .sort({ requestedAt: -1 });
    res.json({ requests });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Admin: approve a request
exports.approveRequest = async (req, res) => {
  try {
    const request = await BorrowRequest.findById(req.params.id).populate(
      "book"
    );
    if (!request || request.status !== "pending") {
      return res
        .status(404)
        .json({ message: "Request not found or already processed" });
    }
    if (request.book.copiesAvailable < 1) {
      return res.status(400).json({ message: "Book not available" });
    }
    request.status = "approved";
    request.approvedAt = new Date();
    request.admin = req.user._id;
    await request.save();
    // Decrement book copies
    request.book.copiesAvailable -= 1;
    await request.book.save();
    res.json({ message: "Request approved", request });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Admin: reject a request
exports.rejectRequest = async (req, res) => {
  try {
    const request = await BorrowRequest.findById(req.params.id);
    if (!request || request.status !== "pending") {
      return res
        .status(404)
        .json({ message: "Request not found or already processed" });
    }
    request.status = "rejected";
    request.rejectedAt = new Date();
    request.admin = req.user._id;
    await request.save();
    res.json({ message: "Request rejected", request });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// User: list own requests
exports.myRequests = async (req, res) => {
  try {
    const requests = await BorrowRequest.find({ user: req.user._id })
      .populate("book")
      .sort({ requestedAt: -1 });
    res.json({ requests });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
