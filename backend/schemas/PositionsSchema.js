const { Schema } = require("mongoose");

const PositionsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true, // Speeds up queries when filtering positions by user
    },
    product: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    qty: {
      type: Number,
      required: true,
    },
    avg: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    net: {
      type: String,
      required: true,
    },
    day: {
      type: String,
      required: true,
    },
    isLoss: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = { PositionsSchema };