const mongoose = require("mongoose");

const printRequestSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  file_path: {
    type: String,
    required: true
  },
  copies: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  pages: {
    type: Number,
    required: true,
    min: 1,
    max: 1000
  },
  paper_size: {
    type: String,
    enum: ["A4", "Letter", "Legal"],
    required: true
  },
  color_mode: {
    type: String,
    required: true
  },
  print_type: {
    type: String,
    required: true
  },
  orientation: {
    type: String,
    required: true
  },
  queue_number: {
    type: Number,
    required: true,
    unique: true
  },
  estimated_cost: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: [
      "Pending",
      "In Progress",
      "Printing",
      "Ready for Pickup",
      "Completed"
    ],
    default: "Pending"
  }
}, {
  timestamps: true
});

module.exports = mongoose.model(
  "PrintRequest",
  printRequestSchema
);
