const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    ISBN: { type: String, required: true, unique: true, trim: true },
    category: { type: String, required: true, trim: true },
    copiesAvailable: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
