const router = require("express").Router();
const bodyParser = require("body-parser");

const docSubController = require("../controllers/docSub.controller");
const { isDoctor } = require("./auth.type");
const multer = require("multer");
const { check } = require("express-validator");

router.get("/docMaterials", isDoctor, docSubController.getDocSubject);

router.get("/docMaterials/:name", isDoctor, docSubController.docSubInfo);

router.get("/subMaterial", isDoctor, docSubController.subMaterial);

router.post(
  "/subMaterial/add",
  isDoctor,
  multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "assets/files");
      },
      filename: (req, file, cb) => {
        cb(null, file.originalname);
      },
    }),
  }).single("material"),
  check("material").custom((value, { req }) => {
    if (!req.file) throw "يجب اختيار ملف";
    else return true;
  }),

  docSubController.addSubMaterial
);

router.get("/file/:pdfName", isDoctor, docSubController.displayPdf);

router.post(
  "/subMaterial/delete",
  isDoctor,
  bodyParser.urlencoded({ extended: false }),
  docSubController.deletePdf
);

router.all(
  "/studentAndAbsence",
  isDoctor,
  bodyParser.urlencoded({ extended: false }),
  docSubController.getAllStudent
);

router.post(
  "/saveAbsence",
  isDoctor,
  bodyParser.urlencoded({ extended: false }),
  docSubController.saveAbsence
);

router.all("/studentsGrades", isDoctor, docSubController.getStudents);

router.post(
  "/setGrade",
  isDoctor,
  bodyParser.urlencoded({ extended: false }),
  docSubController.setGrade
);

router.post(
  "/previewAbsence",
  isDoctor,
  bodyParser.urlencoded({ extended: false }),
  docSubController.getPreviewPageForAbsence
);

router.post(
  "/previewGrades",
  isDoctor,
  bodyParser.urlencoded({ extended: false }),
  docSubController.getPreviewPageForGrades
);

module.exports = router;
