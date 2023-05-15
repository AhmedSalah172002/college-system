const { getSubjectMaterial } = require("../models/Sub.model");
const StudentModel = require("../models/student.model");
const XLSX = require("xlsx");
const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");

exports.getStudents = (req, res, next) => {
  let sub = req.params.sub;
  StudentModel.getItems()
    .then((Students) => {
      Students = Students.filter((e) => e.currSub.includes(sub));
      let obj = [];
      for (let i = 0; i < Students.length; i++) {
        obj.push({
          No: i + 1,
          Accademic_Num: Students[i].accademic,
          studentName: Students[i].name,
        });
        for (let j = 1; j <= 12; j++) {
          obj[i][`Week${j}`] = " ";
        }
      }
      const ws = XLSX.utils.json_to_sheet(obj);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Responses");
      XLSX.writeFile(wb, `${sub}.xlsx`);

      let myPath = __dirname.split("software-Project")[0] + "software-Project";
      fs.cp(
        path.join(myPath, `${sub}.xlsx`),
        path.join(myPath, "assets", "adminAbsenceFiles", `${sub}.xlsx`),
        (err) => {
          if (err) console.log(err);
        }
      );

      setTimeout(() => {
        fs.unlink(path.join(myPath, `${sub}.xlsx`), (err) => {
          if (err) {
            console.log(err);
          }
        });
      }, 2000);

      req.flash("successDownloadAbsenceFileByAdmin", " تم تنزيل الملف بنجاح");
      res.redirect("/");
    })
    .catch((err) => {
      req.flash("failedDownloadAbsenceFileByAdmin", " حدث خطأ اثناء التنزيل ");
      res.redirect("/");
      console.log(err);
    });
};

exports.getStudentName = (req, res, next) => {
  StudentModel.getItemByName(req.session.name)
    .then((Student) => {
      res.render("StudentPages/studentMaterials", {
        Student: Student,
        validationError: req.flash("validationErrors")[0],
        name: req.session.name,
        type: req.session.type,
        prevStudent: req.session.prevStudent,
        accademic: req.session.accademic,
        pageTitle: `${req.session.name} | FCI`,
        image: req.session.image,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postStudent = (req, res, next) => {
  const grades = {};
  const absence = {};

  let currSub = req.body.currSub;

  if (currSub) {
    currSub = currSub.split(",");
    for (let i = 0; i < currSub.length; i++) {
      grades[currSub[i]] = {
        grade: "notAvailable",
        rate: 0,
        status: 0,
      };
      absence[currSub[i]] = {
        week1: false,
        week2: false,
        week3: false,
        week4: false,
        week5: false,
        week6: false,
        week7: false,
      };
    }
  }

  if (validationResult(req).isEmpty()) {
    StudentModel.addNewItem({
      name: req.body.name,
      accademic: req.body.accademic,
      prevSub: req.body.prevSub,
      currSub: req.body.currSub,
      grades,
      absence,
    })
      .then(() => {
        res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    req.flash("validationErrors", validationResult(req).array());
    res.redirect("/regMaterials");
  }
};

exports.getStudentSubDetails = (req, res, next) => {
  req.session.subName = req.params.subName;
  res.render("StudentPages/studentSubDetails", {
    pageTitle: "تفاصيل الماده",
    type: req.session.type,
    subName: req.params.subName,
    accademic: req.session.accademic,
    name: req.session.name,
    grade: "notAvailable",
    image: req.session.image,
  });
};

exports.getStudentGrade = (req, res, next) => {
  let subName = req.session.subName;
  let studentName = req.session.name;
  let accademic = req.session.accademic;

  StudentModel.getGrade(subName, studentName, accademic)
    .then((grade) => {
      res.render("StudentPages/studentSubDetails", {
        pageTitle: "تفاصيل الماده",
        type: req.session.type,
        subName: req.session.subName,
        grade,
        accademic: req.session.accademic,
        name: req.session.name,
        image: req.session.image,
      });
    })
    .catch((err) => {
      res.redirect("/studentMaterials/" + req.session.subName);
      console.log(err);
    });
};

exports.getSubMaterial = (req, res, next) => {
  const subName = req.session.subName;
  getSubjectMaterial(subName).then((material) => {
    // console.log(material);
    res.render("StudentPages/studentSubMaterial", {
      material,
      pageTitle: "الملفات",
      type: req.session.type,
      accademic: req.session.accademic,
      name: req.session.name,
      image: req.session.image,
    });
  });
};
