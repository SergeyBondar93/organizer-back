const mongoose = require("mongoose");

const listSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  assignedUsers: {
    required: false,
    type: [[mongoose.Types.ObjectId]],
    default: [],
  },
  createDate: {
    required: false,
    type: Date,
    default: Date.now,
  },
  lastModified: {
    required: false,
    type: Date,
    default: Date.now,
  },
  name: String,
  data: {
    required: false,
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model("List", listSchema);
