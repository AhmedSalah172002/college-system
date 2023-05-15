const router = require("express").Router();
const bodyParser = require("body-parser");
const signupController = require("../controllers/auth.controller");

const Type = require("./auth.type");
const { isAuth } = require("./auth.guard");
const { check } = require("express-validator");

router.get("/", Type.isAdmin, signupController.getUsers);

// router.post(
//     "/delete",Type.isAdmin,
//     bodyParser.urlencoded({ extended: true }),
//     signupController.postDelete
// );

router.post(
  "/:id",
  Type.isAdmin,
  bodyParser.urlencoded({ extended: false }),
  signupController.postDelete
);

router.get("/edit/:userId", Type.isAdmin, signupController.getEditPageUser);

router.post(
  "/edit/:userId",
  Type.isAdmin,
  bodyParser.urlencoded({ extended: false }),
  check("password")
    .not()
    .isEmpty()
    .withMessage("كلمه السر مطلوبه")
    .isLength({ min: 6 })
    .withMessage("كلمه السر الجديده يجب ان تكون مكونه من 6 حروف او اكثر"),
  signupController.postEditPage
);

module.exports = router;
