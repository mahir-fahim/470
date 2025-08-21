const mongoose = require("mongoose");

const borrowRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    requestedAt: { type: Date, default: Date.now },
    approvedAt: { type: Date },
    rejectedAt: { type: Date },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // who approved/rejected
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BorrowRequest", borrowRequestSchema);
