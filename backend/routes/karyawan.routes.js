const { authAdmin } = require("../middleware/roleAuth");

module.exports = (app) => {
  const karyawan = require("../controllers/karyawan.controller");
  const router = require("express").Router();

  // route tanpa auth untuk register/;ogin
  router.post("/", karyawan.create);

  // route dengan auth admin
  router.get("/", authAdmin, karyawan.findAll);
  router.get("/:id", authAdmin, karyawan.findOne);
  router.put("/:id", authAdmin, karyawan.update);
  router.delete("/:id", authAdmin, karyawan.delete);

  app.use("/karyawan", router);
};
