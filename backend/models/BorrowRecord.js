const mongoose = require("mongoose");

const borrowRecordSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    borrowedDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    returnedDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["borrowed", "returned", "overdue"],
      default: "borrowed",
    },
    fine: {
      type: Number,
      default: 0,
    },
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Index for efficient queries
borrowRecordSchema.index({ user: 1, status: 1 });
borrowRecordSchema.index({ dueDate: 1, status: 1 });

// Method to calculate fine
borrowRecordSchema.methods.calculateFine = function () {
  if (this.status === "returned" && this.returnedDate) {
    const daysLate = Math.max(
      0,
      Math.ceil((this.returnedDate - this.dueDate) / (1000 * 60 * 60 * 24))
    );
    return daysLate * 1; // $1 per day late
  } else if (this.status === "overdue") {
    const daysLate = Math.max(
      0,
      Math.ceil((new Date() - this.dueDate) / (1000 * 60 * 60 * 24))
    );
    return daysLate * 1; // $1 per day late
  }
  return 0;
};

// Pre-save middleware to update status
borrowRecordSchema.pre("save", function (next) {
  if (this.status === "borrowed" && new Date() > this.dueDate) {
    this.status = "overdue";
  }
  this.fine = this.calculateFine();
  next();
});

module.exports = mongoose.model("BorrowRecord", borrowRecordSchema);
