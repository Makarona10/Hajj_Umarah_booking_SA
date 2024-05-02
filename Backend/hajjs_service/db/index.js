const mongoose = require("mongoose");

mongoose
  .connect("mongodb://hajjs_db:27017/hajjsdb", { useNewUrlParser: true })
  .catch((e) => {
    console.error("Connection error", e.message);
  });

const db = mongoose.connection;

module.exports = db;
