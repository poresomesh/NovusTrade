const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Your email address is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      required: [true, "Your username is required"],
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
    },
    password: {
      type: String,
      required: [true, "Your password is required"],
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
  }
);

const UserModel = mongoose.model("user", UserSchema);

module.exports = { UserModel };