const mongoose = require("mongoose");

mongoose
  .connect("mongodb://users_db:27017/usersdb", { useNewUrlParser: true })
  .catch((e) => {
    console.error("Connection error", e.message);
});

const db = mongoose.connection;

db.on('disconnected', () => {
  console.log('Disconnected from MongoDB');
});


module.exports = db;
