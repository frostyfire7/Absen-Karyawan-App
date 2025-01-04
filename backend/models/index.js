const dbConfig = require("../config/database");
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

module.exports = {
  mongoose,
  url: dbConfig.url,
  karyawan: require("./karyawan.model.js")(mongoose),
  absen: require("./absen.model.js")(mongoose),
  admin: require("./admin.model.js")(mongoose),
};
