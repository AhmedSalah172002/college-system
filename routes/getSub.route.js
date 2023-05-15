const router = require("express").Router();
const bodyParser = require("body-parser");

const subController = require("../controllers/Sub.controller");

const Type = require("./auth.type");

router.get("/", Type.isAdmin, subController.getSubToAdmin);

router.post(
  "/delete",
  Type.isAdmin,
  bodyParser.urlencoded({ extended: true }),
  subController.postDelete
);

module.exports = router;
