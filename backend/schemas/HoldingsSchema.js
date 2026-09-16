const { Schema } = require("mongoose");

const HoldingsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, "User ID is required"],
      index: true, // Improves performance when filtering by user
    },
    name: {
      type: String,
      required: [true, "Instrument name is required"],
      trim: true,
    },
    qty: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    avg: {
      type: Number,
      required: [true, "Average cost is required"],
      min: [0, "Average cost cannot be negative"],
    },
    price: {
      type: Number,
      required: [true, "Current price is required"],
      min: [0, "Price cannot be negative"],
    },
    net: {
      type: String,
      required: [true, "Net change is required"],
    },
    day: {
      type: String,
      required: [true, "Day change is required"],
    },
  },
  {
    timestamps: true, // Manages createdAt and updatedAt automatically
  }
);

module.exports = { HoldingsSchema };