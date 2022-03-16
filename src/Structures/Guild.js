const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  config = require("../../config.json");

module.exports = mongoose.model(
  "Guild",
  new Schema({
    id: { type: String },
    prefix: { type: String, default: config.prefix },
    mch: false,
    msg: false,
    requesterOn: false,
    vcs: { type: Array, default: [] },
  })
);
