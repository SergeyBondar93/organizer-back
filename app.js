const createError = require("http-errors");
const express = require("express");
const path = require("path");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const mongoose = require("mongoose");
const config = require("config");
const MongoDBStore = require("connect-mongodb-session")(session);

const list = require("./routes/list");
const login = require("./routes/login");
const logout = require("./routes/logout");
const reg = require("./routes/reg");

async function startBackend() {
  try {
    await mongoose.connect(config.get("mongoUri"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log("DB connected");
  } catch (e) {
    console.log("connect to DB failed, ", e);
  }
}
startBackend();

const store = new MongoDBStore({
  collections: "sessions",
  uri: config.get("mongoUri"),
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  express.static(path.resolve(__dirname, "..", "transfer-list", "build"))
);
app.use(
  session({
    secret: config.get("secretString"),
    resave: false,
    saveUninitialized: false,
    store,
  })
);

app.use("/list", list);
app.use("/login", login);
app.use("/logout", logout);
app.use("/reg", reg);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

module.exports = app;
