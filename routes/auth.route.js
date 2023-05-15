const router = require("express").Router();
const bodyparser = require("body-parser");
const check = require("express-validator").check;
const signupController = require("../controllers/auth.controller");
const Auth = require("./auth.guard");
const Type = require("./auth.type");
const bodyParser = require("body-parser");
const multer = require("multer");

router.get("/signup", Type.isAdmin, signupController.getSignup);

router.post(
  "/signup",
  Type.isAdmin,
  bodyparser.urlencoded({ extended: false }),
  check("username").not().isEmpty().withMessage("اسم المستخدم مطلوب"),
  check("type").not().isEmpty().withMessage("من فضلك ادخل نوع الحساب"),
  check("password")
    .not()
    .isEmpty()
    .withMessage("كلمه السر مطلوبه")
    .isLength({ min: 6 })
    .withMessage("كلمه السر يجب الا تقل عن 6 احرف"),
  signupController.postSignup
);

router.get("/login", Auth.isNotAuth, signupController.getlogin);

router.post(
  "/login",
  Auth.isNotAuth,
  bodyparser.urlencoded({ extended: false }),
  check("username").not().isEmpty().withMessage("اسم المستخدم مطلوب"),
  check("password")
    .not()
    .isEmpty()
    .withMessage("كلمه السر مطلوبه")
    .isLength({ min: 6 })
    .withMessage("كلمه السر يجب الا تقل عن 6 احرف"),
  signupController.postlogin
);

router.all("/logout", Auth.isAuth, signupController.logout);

// change password
router.get(
  "/user/changePassword",
  Auth.isAuth,
  signupController.getChangePasswordPage
);

router.post(
  "/changePassword",
  Auth.isAuth,
  bodyParser.urlencoded({ extended: false }),
  check("oldPassword")
    .not()
    .isEmpty()
    .withMessage("كلمه السر القديمه مطلوبه")
    .isLength({ min: 6 })
    .withMessage("يجب ان تكون كلمه السر القديمه اكثر من 5 حروف"),
  check("newPassword")
    .not()
    .isEmpty()
    .withMessage("كلمه السر الجديده مطلوبه")
    .isLength({ min: 6 })
    .withMessage("يجب ان تكون كلمه السر الجديده اكثر من 5 حروف"),
  check("confirmNewPassword")
    .not()
    .isEmpty()
    .withMessage("كلمه السر الجديده مطلوبه")
    .isLength({ min: 6 })
    .withMessage("يجب ان يكون تأكيد كلمه السر الجديده اكثر من 5 حروف")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw "يجب ان تكون كلمة السر الجديده وتأكيد كلمة السر الجديدة متشابهين ";
      }
      return true;
    }),
  signupController.postChangePassword
);

router.post(
  "/user/changeImage",
  Auth.isAuth,
  multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "assets/userImages");
      },
      filename: (req, file, cb) => {
        cb(
          null,
          req.session.name +
            "-" +
            req.session.userId +
            "-" +
            Date.now() +
            "=" +
            file.originalname
        );
      },
    }),
  }).single("image"),
  check("image").custom((value, { req }) => {
    if (!req.file) throw new Error("يجب اختيار صوره");
    else return true;
  }),
  signupController.postChangeImage
);

router.post(
  "/user/deleteImage",
  Auth.isAuth,
  bodyParser.urlencoded({ extended: true }),
  signupController.postDeleteImage
);

router.post(
  "/admin/deleteUserImage",
  Type.isAdmin,
  bodyParser.urlencoded({ extended: false }),
  signupController.postDeleteImageByAdmin
);

module.exports = router;
