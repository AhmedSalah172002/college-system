const SubModel = require("../models/Sub.model");
const StudentModel = require("../models/student.model");
const DeptModel = require("../models/Dept.model");
const validationResult = require("express-validator").validationResult;

exports.getSub = (req, res, next) => {
  SubModel.getItems()
    .then((subjects) => {
      res.render("materials", {
        subjects: subjects,
        name: req.session.name,
        type: req.session.type,
        pageTitle: "Subjects | FCI",
        accademic: req.session.accademic,
        image: req.session.image,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getStudentSub = (req, res, next) => {
  SubModel.getItems()
    .then((subjects) => {
      StudentModel.getItemByName(req.session.name).then((student) => {
        res.render("regMaterials", {
          subjects: subjects,
          student: student,
          validationError: req.flash("validationErrors")[0],
          name: req.session.name,
          type: req.session.type,
          prevSub: req.session.prevSub,
          accademic: req.session.accademic,
          pageTitle: "Subjects | FCI",
          image: req.session.image,
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getSubToAdmin = (req, res, next) => {
  SubModel.getItems()
    .then((subjects) => {
      res.render("getMaterials", {
        subjects: subjects,
        validationError: req.flash("validationErrors")[0],
        name: req.session.name,
        type: req.session.type,
        prevSub: req.session.prevSub,
        accademic: req.session.accademic,
        pageTitle: "Subjects | FCI",
        subAddedSuccessfully: req.flash("subAddedSuccessfully")[0],
        deleteSub: req.flash("deleteSub")[0],
        image: req.session.image,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getSubToAdminAbsence = (req, res, next) => {
  SubModel.getItems()
    .then((subjects) => {
      res.render("adminAbsence", {
        subjects: subjects,
        validationError: req.flash("validationErrors")[0],
        name: req.session.name,
        type: req.session.type,
        prevSub: req.session.prevSub,
        accademic: req.session.accademic,
        pageTitle: "Subjects | FCI",
        subAddedSuccessfully: req.flash("subAddedSuccessfully")[0],
        deleteSub: req.flash("deleteSub")[0],
        image: req.session.image,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postSub = (req, res, next) => {
  if (validationResult(req).isEmpty()) {
    SubModel.addNewItem({
      subName: req.body.subName,
      subCode: req.body.subCode,
      subDoc: req.body.subDoc,
      deptName: req.body.deptName,
      subPrev: req.body.subPrev,
    })
      .then(() => {
        req.flash("subAddedSuccessfully", "تم اضافه الماده بنجاح");
        res.redirect("/getMaterials");
      })
      .catch((err) => {
        req.flash("postSubErr", err);
        res.redirect("/materials");
      });
  } else {
    req.flash("validationErrs", validationResult(req).array());
    res.redirect("/materials");
  }
};

exports.postDelete = (req, res, next) => {
  SubModel.deleteItem(req.body.subId)
    .then(() => {
      req.flash("deleteSub", "تم حذف الماده بنجاح");
      res.redirect("/getMaterials");
    })
    .catch((err) => {
      console.log(err);
      req.flash("deleteSub", "خطأ فى حذف الماده");
      res.redirect("/getMaterials");
    });
};

exports.getsubEdit = (req, res, next) => {
  DeptModel.getItems()
    .then((items) => {
      let sub;
      SubModel.getItems().then((subject) => {
        sub = subject.filter((e) => e._id == req.params.subId);
        res.render("edit/materialEdit", {
          items: items,
          subId: req.params.subId,
          sub: sub,
          name: req.session.name,
          type: req.session.type,
          subId: req.params.subId,
          accademic: req.session.accademic,
          pageTitle: "Subjects | FCI",
          validationErrs: req.flash("validationErrs"),
          subAddErr: req.flash("subAddErr")[0],
          image: req.session.image,
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postsubEdit = (req, res, next) => {
  if (validationResult(req).isEmpty()) {
    SubModel.editItem({
      id: req.params.subId,
      data: {
        subName: req.body.subName,
        subCode: req.body.subCode,
        subDoc: req.body.subDoc,
        subName: req.body.subName,
        subPrev: req.body.subPrev,
      },
    })
      .then(() => {
        req.flash("subAddedSuccessfully", "تم تعديل المادة  بنجاح");
        res.redirect("/getMaterials");
      })
      .catch((err) => {
        req.flash("postSubErr", err);
        res.redirect(`${req.params.subId}`);
      });
  } else {
    req.flash("validationErrs", validationResult(req).array());
    res.redirect(`${req.params.subId}`);
  }
};
