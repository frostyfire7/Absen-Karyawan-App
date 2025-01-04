const { authAdmin } = require("../middleware/roleAuth");

module.exports = (app) => {
  const admin = require("../controllers/admin.controller");
  const router = require("express").Router();

  // route tanpa auth utk register/login
  router.post("/", admin.create);

  // route dengan auth
  router.get("/", authAdmin, admin.findAll);
  router.get("/:id", authAdmin, admin.findOne);
  router.put("/:id", authAdmin, admin.update);
  router.delete("/:id", authAdmin, admin.delete);

  app.use("/admin", router);
};
