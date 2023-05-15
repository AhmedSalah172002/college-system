const router = require("express").Router();
const studentController = require("../controllers/student.controller");

const subController = require("../controllers/Sub.controller");

const Type = require("./auth.type");

router.get("/adminAbsence", Type.isAdmin, subController.getSubToAdminAbsence);

router.get("/adminAbsence/:sub", Type.isAdmin, studentController.getStudents);

module.exports = router;
