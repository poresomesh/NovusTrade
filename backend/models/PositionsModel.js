const { model } = require("mongoose");
const { PositionsSchema } = require("../schemas/PositionsSchema");

// Compile the schema into a Mongoose model
const PositionsModel = model("position", PositionsSchema);

module.exports = { PositionsModel };