const { validationResult } = require("express-validator");
const user = require("../models/auth.model");
const StudentModel = require("../models/student.model");

exports.getUsers = (req, res, next) => {
  user
    .getItems()
    .then((Users) => {
      res.render("UsersPages/users", {
        Users: Users,
        validationError: req.flash("validationErrors")[0],
        name: req.session.name,
        type: req.session.type,
        prevSub: req.session.prevSub,
        accademic: req.session.accademic,
        pageTitle: "Users | FCI",
        addedSuccessfully: req.flash("addedSuccessfully")[0],
        deleteUser: req.flash("deleteUser")[0],
        image: req.session.image,
        editStatus: req.flash("editStatus")[0],
      });
    })
    .catch((err) => {
      console.log(err);
      req.flash("fetchUsersErr", "Something went wrong");
    });
};

exports.getHome = (req, res, next) => {
  res.render("index", {
    name: req.session.name,
    type: req.session.type,
    accademic: req.session.accademic,
    pageTitle: "FCI",
    changePasswordStatus: req.flash("changePasswordStatus")[0],
    image: req.session.image,
    validationErr: req.flash("validationErr")[0],
    uploadImageStatus: req.flash("uploadImageStatus")[0],
    successDownloadAbsenceFileByAdmin: req.flash(
      "successDownloadAbsenceFileByAdmin"
    )[0],
    failedDownloadAbsenceFileByAdmin: req.flash(
      "failedDownloadAbsenceFileByAdmin"
    )[0],
  });
};

exports.getSignup = (req, res, next) => {
  res.render("AuthPages/signup", {
    name: req.session.name,
    type: req.session.type,
    accademic: req.session.accademic,
    pageTitle: "Signup | FCI",
    validationErrs: req.flash("validationErrs"),
    authErr: req.flash("authErr")[0],
    image: req.session.image,
  });
};

exports.postSignup = (req, res, next) => {
  if (validationResult(req).isEmpty()) {
    user
      .addToSignup(
        req.body.username,
        req.body.type,
        req.body.password,
        req.body.accademic,
        req.body.prevSub
      )
      .then((addedSuccessfully) => {
        res.redirect("/users");
        req.flash("addedSuccessfully", addedSuccessfully);
      })
      .catch((err) => {
        res.redirect("/signup");
        req.flash("authErr", err);
      });
  } else {
    req.flash("validationErrs", validationResult(req).array());
    res.redirect("/signup");
  }
};

exports.getlogin = (req, res, next) => {
  res.render("AuthPages/login", {
    authErr: req.flash("authErr")[0],
    validationErrs: req.flash("validationErrs"),
    name: req.session.name,
    accademic: req.session.accademic,
    type: req.session.type,
    pageTitle: "Login | FCI",
    image: req.session.image,
  });
};

exports.postlogin = (req, res, next) => {
  if (validationResult(req).isEmpty()) {
    user
      .addToLogin(req.body.username, req.body.password)
      .then((user) => {
        req.session.userId = user.id;
        req.session.type = user.type;
        req.session.name = user.username;
        req.session.prevSub = user.prevSub;
        req.session.accademic = user.accademic;
        req.session.image = user.image;
        res.redirect("/");
      })
      .catch((err) => {
        req.flash("authErr", err);
        res.redirect("/login");
      });
  } else {
    req.flash("validationErrs", validationResult(req).array());
    res.redirect("/login");
  }
};

exports.postDelete = (req, res, next) => {
  user
    .deleteItem(req.body.username, req.body._id)
    .then(() => {
      StudentModel.deleteStudent(req.body.username, req.body._id);
      res.redirect("/users");
      req.flash("deleteUser", "تم ازاله المستخدم");
    })
    .catch((err) => {
      console.log(err);
      req.flash("deleteUser", "حدث خطأ ");
      res.redirect("/users");
    });
};

exports.logout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

exports.getChangePasswordPage = (req, res, next) => {
  res.render("AuthPages/changePassword", {
    name: req.session.name,
    accademic: req.session.accademic,
    type: req.session.type,
    pageTitle: "تغير كلمه السر",
    changePasswordStatus: req.flash("changePasswordStatus"),
    validationErrs: req.flash("validationErrs"),
    image: req.session.image,
  });
};

exports.postChangePassword = (req, res, next) => {
  const name = req.session.name,
    userId = req.session.userId,
    newPassword = req.body.newPassword,
    oldPassword = req.body.oldPassword;
  if (validationResult(req).isEmpty()) {
    user
      .changePassword(name, userId, newPassword, oldPassword)
      .then((msg) => {
        res.redirect("/");
        req.flash("changePasswordStatus", msg);
      })
      .catch((err) => {
        res.redirect("/user/changePassword");
        req.flash("changePasswordStatus", err);
      });
  } else {
    res.redirect("/user/changePassword");
    req.flash("validationErrs", validationResult(req).array());
  }
};

exports.postChangeImage = (req, res, next) => {
  if (validationResult(req).isEmpty()) {
    const name = req.session.name,
      userId = req.session.userId,
      image = req.file.filename;
    req.session.image = image;

    user
      .changeImage(name, userId, image)
      .then(() => {
        res.redirect("/");
        req.flash("uploadImageStatus", "تم تغير الصوره بنجاح");
        req.session.image = image;
      })
      .catch((err) => {
        res.redirect("/");
        req.flash("uploadImageStatus", "حدث خطأ حاول بعد فتره");
        console.log(err);
      });
  } else {
    res.redirect("/");
    req.flash("validationErr", validationResult(req).array());
  }
};

exports.postDeleteImage = (req, res, next) => {
  const name = req.session.name,
    userId = req.session.userId,
    image = req.body.defaultImage;
  req.session.image = image;

  user
    .changeImage(name, userId, image)
    .then(() => {
      res.redirect("/");
      req.flash("uploadImageStatus", "تم حذف الصوره بنجاح");
      req.session.image = image;
    })
    .catch((err) => {
      res.redirect("/");
      req.flash("uploadImageStatus", "حدث خطأ حاول بعد فتره");
      console.log(err);
    });
};

exports.getEditPageUser = (req, res, next) => {
  user.getItems().then((users) => {
    users = users.filter((e) => e._id == req.params.userId);
    res.render("AuthPages/editUser", {
      users: users,
      name: req.session.name,
      accademic: req.session.accademic,
      type: req.session.type,
      userId: req.session.userId,
      image: req.session.image,
      id: req.params.userId,
      pageTitle: "User | Edit",
      validationErrs: req.flash("validationErr")[0],
      editUserStatus: req.flash("editStatus")[0],
      deleteImageStatus: req.flash("deleteImageStatus")[0],
    });
  });
};

exports.postEditPage = (req, res, next) => {
  if (validationResult(req).isEmpty()) {
    user
      .editUser({
        id: req.params.userId,
        data: {
          username: req.body.username,
          type: req.body.type,
          password: req.body.password,
          accademic: req.body.accademic,
          prevSub: req.body.prevSub,
          image: req.session.image,
        },
      })
      .then(() => {
        res.redirect("/users");
        req.flash("editStatus", "تم التعديل بنجاح");
      })
      .catch((err) => {
        console.log(err);
        res.redirect(`/users/edit/${req.params.userId}`);
        req.flash("editStatus", "حدث خطأ حاول مره اخرى");
      });
  } else {
    res.redirect(`/users/edit/${req.params.userId}`);
    req.flash("validationErr", validationResult(req).array());
  }
};

exports.postDeleteImageByAdmin = (req, res, next) => {
  let username = req.body.username;
  let _id = req.body._id;
  let defaultImage = req.body.defaultImage;
  let userAcademic = req.body.userAcademic;
  let userImage = req.body.userImage;

  if (userImage == "user-image.jpg") {
    req.flash("deleteImageStatus", "الصوره محذوفه بالفعل");
    res.redirect(
      `/users/edit/${_id}?username=${username}&userImage=${defaultImage}&userAcademic=${userAcademic}`
    );
    return;
  } else {
    user
      .changeImage(username, _id, defaultImage)
      .then(() => {
        res.redirect(
          `/users/edit/${_id}?username=${username}&userImage=${defaultImage}&userAcademic=${userAcademic}`
        );
        req.flash("deleteImageStatus", "تم الحذف بنجاح");
      })
      .catch((err) => {
        console.log(err);
        res.redirect(
          `/users/edit/${_id}?username=${username}&userImage=${userImage}&userAcademic=${userAcademic}`
        );
        req.flash("deleteImageStatus", "حدث خطأ حاول مجددا فى وقت لاحق");
      });
  }
};
