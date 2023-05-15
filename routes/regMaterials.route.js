const router = require("express").Router();
const bodyParser = require("body-parser");
const check = require("express-validator").check;

const subController = require("../controllers/Sub.controller");

const studentController = require("../controllers/student.controller");

const Type = require("./auth.type");

router.get("/", Type.isStudent, subController.getStudentSub);

router.post(
  "/",
  Type.isStudent,
  bodyParser.urlencoded({ extended: true }),
  check("name").not().isEmpty().withMessage("materials is required"),
  check("currSub").not().isEmpty().withMessage("materials is required"),
  studentController.postStudent
);

module.exports = router;

