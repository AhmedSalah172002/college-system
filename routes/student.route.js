const { displayPdf } = require("../controllers/docSub.controller");
const {
  getStudentSubDetails,
  getStudentGrade,
  getSubMaterial,
} = require("../controllers/student.controller");
const { isStudent } = require("./auth.type");

const router = require("express").Router();

router.get("/studentMaterials/:subName", isStudent, getStudentSubDetails);

router.post("/studentGrade", isStudent, getStudentGrade);

router.post("/studentSubMaterial", isStudent, getSubMaterial);

router.get("/student/:pdfName", isStudent, displayPdf);

module.exports = router;
