const { authKaryawan, authAdmin } = require("../middleware/roleAuth");

module.exports = (app) => {
  const absen = require("../controllers/absen.controller");
  const router = require("express").Router();

  // route untuk karyawan
  router.post("/checkin/:id", absen.checkIn);
  router.post("/checkout/:id", absen.checkOut);

  // route untuk admin
  router.get("/", authAdmin, absen.findAll);
  router.get("/:id", authAdmin, absen.findOne);
  router.put("/:id", authAdmin, absen.update);
  router.delete("/:id", authAdmin, absen.delete);

  app.use("/absen", router);
};
