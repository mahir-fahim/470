const { validationResult } = require("express-validator");
const BorrowRecord = require("../models/BorrowRecord");
const Book = require("../models/Book");
const User = require("../models/User");

const MS_PER_DAY = 1000 * 60 * 60 * 24;

async function updateRecordStatusAndFine(borrowRecord) {
  let hasChanges = false;
  const now = new Date();

  if (borrowRecord.status !== "returned" && now > borrowRecord.dueDate) {
    if (borrowRecord.status !== "overdue") {
      borrowRecord.status = "overdue";
      hasChanges = true;
    }
    const daysLate = Math.max(
      0,
      Math.ceil((now - borrowRecord.dueDate) / MS_PER_DAY)
    );
    const newFine = daysLate * 1;
    if (borrowRecord.fine !== newFine) {
      borrowRecord.fine = newFine;
      hasChanges = true;
    }
  }

  if (borrowRecord.status === "returned" && borrowRecord.returnedDate) {
    const daysLate = Math.max(
      0,
      Math.ceil((borrowRecord.returnedDate - borrowRecord.dueDate) / MS_PER_DAY)
    );
    const newFine = daysLate * 1;
    if (borrowRecord.fine !== newFine) {
      borrowRecord.fine = newFine;
      hasChanges = true;
    }
  }

  if (hasChanges) {
    await borrowRecord.save();
  }

  return borrowRecord;
}

exports.getMyHistory = async (req, res) => {
  try {
    let records = await BorrowRecord.find({ user: req.user.id })
      .populate("book", "title author ISBN category")
      .populate("issuedBy", "firstName lastName")
      .sort({ createdAt: -1 });
    records = await Promise.all(records.map(updateRecordStatusAndFine));
    res.json({ records });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAllRecords = async (req, res) => {
  try {
    const { status, userId } = req.query;
    const query = {};
    if (status) query.status = status;
    if (userId) query.user = userId;
    let records = await BorrowRecord.find(query)
      .populate("user", "firstName lastName username email")
      .populate("book", "title author ISBN category")
      .populate("issuedBy", "firstName lastName")
      .sort({ createdAt: -1 });
    records = await Promise.all(records.map(updateRecordStatusAndFine));
    res.json({ records });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.issueBook = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { userId, bookId, dueDate, notes } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.copiesAvailable <= 0) {
      return res
        .status(400)
        .json({ message: "No copies available for this book" });
    }
    const existingBorrow = await BorrowRecord.findOne({
      user: userId,
      book: bookId,
      status: { $in: ["borrowed", "overdue"] },
    });
    if (existingBorrow) {
      return res
        .status(400)
        .json({ message: "User already has this book borrowed" });
    }
    const borrowRecord = new BorrowRecord({
      user: userId,
      book: bookId,
      dueDate: new Date(dueDate),
      issuedBy: req.user.id,
      notes: notes || "",
    });
    await borrowRecord.save();
    book.copiesAvailable -= 1;
    await book.save();
    await borrowRecord.populate("user", "firstName lastName username");
    await borrowRecord.populate("book", "title author ISBN");
    await borrowRecord.populate("issuedBy", "firstName lastName");
    res
      .status(201)
      .json({ message: "Book issued successfully", record: borrowRecord });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.returnBook = async (req, res) => {
  try {
    const { recordId } = req.params;
    const borrowRecord = await BorrowRecord.findById(recordId);
    if (!borrowRecord)
      return res.status(404).json({ message: "Borrow record not found" });
    if (borrowRecord.status === "returned") {
      return res.status(400).json({ message: "Book is already returned" });
    }
    borrowRecord.status = "returned";
    borrowRecord.returnedDate = new Date();
    borrowRecord.fine = borrowRecord.calculateFine();
    await borrowRecord.save();
    const book = await Book.findById(borrowRecord.book);
    if (book) {
      book.copiesAvailable += 1;
      await book.save();
    }
    await borrowRecord.populate("user", "firstName lastName username");
    await borrowRecord.populate("book", "title author ISBN");
    await borrowRecord.populate("issuedBy", "firstName lastName");
    res.json({ message: "Book returned successfully", record: borrowRecord });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getOverdue = async (req, res) => {
  try {
    let overdueRecords = await BorrowRecord.find({
      $or: [
        { status: "overdue" },
        { status: "borrowed", dueDate: { $lt: new Date() } },
      ],
    })
      .populate("user", "firstName lastName username email")
      .populate("book", "title author ISBN category")
      .populate("issuedBy", "firstName lastName")
      .sort({ dueDate: 1 });
    overdueRecords = await Promise.all(
      overdueRecords.map(updateRecordStatusAndFine)
    );
    res.json({ records: overdueRecords.filter((r) => r.status === "overdue") });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const candidates = await BorrowRecord.find({
      $or: [
        { status: "overdue" },
        { status: "borrowed", dueDate: { $lt: new Date() } },
        { status: "returned" },
      ],
    });
    await Promise.all(candidates.map(updateRecordStatusAndFine));

    const totalBorrowed = await BorrowRecord.countDocuments({
      status: "borrowed",
    });
    const totalOverdue = await BorrowRecord.countDocuments({
      $or: [
        { status: "overdue" },
        { status: "borrowed", dueDate: { $lt: new Date() } },
      ],
    });
    const totalReturned = await BorrowRecord.countDocuments({
      status: "returned",
    });
    const totalFines = await BorrowRecord.aggregate([
      { $group: { _id: null, total: { $sum: "$fine" } } },
    ]);
    res.json({
      stats: {
        totalBorrowed,
        totalOverdue,
        totalReturned,
        totalFines: totalFines[0]?.total || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
