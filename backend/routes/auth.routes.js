module.exports = (app) => {
  const auth = require("../controllers/auth.controller");
  const router = require("express").Router();

  router.post("/login/karyawan", auth.loginKaryawan);
  router.post("/login/admin", auth.loginAdmin);

  app.use("/auth", router);
};
