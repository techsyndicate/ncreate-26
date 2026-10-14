const passport = require("passport");

require("dotenv").config();

const express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  PORT = process.env.PORT || 5000;

const indexRouter = require('./routers/indexRouter')

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use("/", indexRouter);

app.listen(PORT, console.log(`Server is running on port ${PORT}`));
