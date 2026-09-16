const { model } = require("mongoose");
const { HoldingsSchema } = require("../schemas/HoldingsSchema");

// Compile schema into model
const HoldingsModel = model("holding", HoldingsSchema);

module.exports = { HoldingsModel };