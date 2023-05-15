const router = require("express").Router();
const bodyParser = require("body-parser");
const Type = require("./auth.type");

const deptController = require("../controllers/Dept.controller");

router.get("/", Type.isAdmin, deptController.getDepartments);

router.post(
  "/delete",
  Type.isAdmin,
  bodyParser.urlencoded({ extended: true }),
  deptController.postDelete
);

module.exports = router;
