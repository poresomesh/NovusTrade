const mongoose = require("mongoose");

const OrdersSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "User ID is required"],
      index: true, // Optimizes retrieval performance for user-specific queries
    },
    name: {
      type: String,
      required: [true, "Stock name is required"],
      trim: true,
    },
    qty: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    mode: {
      type: String,
      required: [true, "Order mode is required"],
      enum: ["BUY", "SELL"], // Restricts operations to valid transaction types
      uppercase: true,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt timestamps
  }
);

const OrdersModel = mongoose.model("order", OrdersSchema);

module.exports = { OrdersModel };