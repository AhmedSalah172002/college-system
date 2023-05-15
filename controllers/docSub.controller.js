const { validationResult } = require("express-validator");
const SubModel = require("../models/Sub.model");
const {
  setStudentAbsence,
  getGradePage,
  getAllStudent,
  setGrade,
} = require("../models/student.model");

exports.getDocSubject = (req, res, next) => {
  SubModel.getDocSub(req.session.name)
    .then((subjects) => {
      res.render("DoctorPages/docMaterials", {
        subjects: subjects,
        name: req.session.name,
        type: req.session.type,
        accademic: req.session.accademic,
        pageTitle: "Subjects | FCI",
        image: req.session.image,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.docSubInfo = (req, res, next) => {
  req.session.subName = req.params.name;
  res.render("DoctorPages/subDoc", {
    subName: req.params.name,
    pageTitle: "معلومات الماده",
    type: req.session.type,
    accademic: req.session.accademic,
    name: req.session.name,
    image: req.session.image,
  });
};

exports.subMaterial = (req, res, next) => {
  const docName = req.session.name;
  const subName = req.session.subName;
  const addPdfError = req.flash("addPdfError")[0];

  SubModel.getAllPdf(subName, docName)
    .then((material) => {
      res.render("DoctorPages/subMaterial", {
        pageTitle: "Subject Material",
        type: req.session.type,
        subName: req.query.subName,
        material,
        addPdfError,
        accademic: req.session.accademic,
        name: req.session.name,
        validationErr: req.flash("validationErr")[0],
        image: req.session.image,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.addSubMaterial = (req, res, next) => {
  if (validationResult(req).isEmpty()) {
    const data = {
      docName: req.session.name,
      subName: req.session.subName,
      filename: req.file.filename,
    };
    SubModel.addPdfToSub(data)
      .then(() => {
        res.redirect("/subMaterial");
      })
      .catch((err) => {
        res.redirect("/subMaterial");
        req.flash("addPdfError", err);
        console.log(err);
      });
  } else {
    req.flash("validationErr", validationResult(req).array());
    res.redirect("/subMaterial");
  }
};

exports.displayPdf = (req, res, next) => {
  res.render("DoctorPages/showPdf", {
    pageTitle: "عرض الملف",
    type: req.session.type,
    pdfName: req.params.pdfName,
    accademic: req.session.accademic,
    name: req.session.name,
    image: req.session.image,
  });
};

exports.deletePdf = (req, res, next) => {
  const data = {
    docName: req.session.name,
    subName: req.session.subName,
    filename: req.body.filename,
  };
  SubModel.deletePdfByName(data)
    .then(() => {
      res.redirect("/subMaterial");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getAllStudent = (req, res, next) => {
  getAllStudent(req.session.subName)
    .then((students) => {
      // console.log(students);
      res.render("DoctorPages/studentsDoctorAbsence", {
        students,
        pageTitle: "الغياب",
        type: req.session.type,
        subName: req.session.subName,
        accademic: req.session.accademic,
        name: req.session.name,
        image: req.session.image,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.saveAbsence = (req, res, next) => {
  const studentName = req.body.studentName,
    accademic = req.body.accademic,
    subName = req.session.subName;

  const data = {};
  for (const key in req.body) {
    if (key.toString().startsWith("w")) {
      data[`${key}`] = req.body[key] === "true";
    }
  }

  setStudentAbsence(studentName, accademic, data, subName)
    .then(() => {
      res.redirect("/studentAndAbsence");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getStudents = (req, res, next) => {
  getAllStudent(req.session.subName)
    .then((students) => {
      res.render("DoctorPages/studentsDoctorGrades", {
        students,
        pageTitle: "رصد الدرجات",
        type: req.session.type,
        subName: req.session.subName,
        accademic: req.session.accademic,
        name: req.session.name,
        image: req.session.image,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.setGrade = (req, res, next) => {
  const studentName = req.body.studentName,
    accademic = req.body.accademic,
    subName = req.session.subName,
    grade = req.body.grade;
  setGrade(studentName, accademic, grade, subName)
    .then(() => {
      res.redirect("/studentsGrades");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getPreviewPageForAbsence = (req, res, next) => {
  getAllStudent(req.session.subName)
    .then((students) => {
      res.render("DoctorPages/previewAndPrintAbsence", {
        students,
        pageTitle: "عرض الغياب",
        type: req.session.type,
        subName: req.session.subName,
        accademic: req.session.accademic,
        name: req.session.name,
        image: req.session.image,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getPreviewPageForGrades = (req, res, next) => {
  getAllStudent(req.session.subName)
    .then((students) => {
      res.render("DoctorPages/previewAndPrintGrades", {
        students,
        pageTitle: "عرض الدرجات",
        type: req.session.type,
        subName: req.session.subName,
        accademic: req.session.accademic,
        name: req.session.name,
        image: req.session.image,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
