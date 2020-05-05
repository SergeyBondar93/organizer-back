const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nickname: {
    required: false,
  },
  email: String,
  password: String,
  name: String,
  regDate: {
    required: false,
    type: Date,
    default: Date.now,
  },
  avatar: {
    required: false,
  },
  logins: {
    required: false,
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model("User", userSchema);
