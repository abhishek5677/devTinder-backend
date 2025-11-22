const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://abhishekgarad5677_db_user:VsePJNn5KUVEWTHY@namastedev.axbaaei.mongodb.net/devTinder"
  );
};

module.exports = connectDb;
