const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    status: {
      type: String,
      enum: ["active", "fulfilled", "cancelled"],
      default: "active",
    },
    reservedAt: { type: Date, default: Date.now },
    fulfilledAt: { type: Date },
    cancelledAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reservation", reservationSchema);
