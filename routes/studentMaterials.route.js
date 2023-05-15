const router = require("express").Router();

const studentController = require("../controllers/student.controller");

const Type = require("./auth.type");

router.get("/", Type.isStudent, studentController.getStudentName);

module.exports = router;
