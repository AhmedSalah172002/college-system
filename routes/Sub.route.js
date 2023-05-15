const router = require("express").Router();
const bodyParser = require("body-parser");
const check = require("express-validator").check;

const subController = require("../controllers/Sub.controller");

const deptController = require("../controllers/Dept.controller");

const Type = require("./auth.type");

router.get("/", Type.isAdmin, deptController.getDeptToSub);
router.get("/:subId", Type.isAdmin, subController.getsubEdit);

router.post(
  "/",
  Type.isAdmin,
  bodyParser.urlencoded({ extended: false }),
  check("subName").not().isEmpty().withMessage("اسم الماده مطلوب"),
  check("subCode").not().isEmpty().withMessage("كود الماده مطلوب"),
  check("subPrev").not().isEmpty().withMessage("المتطلب السابق مطلوب"),
  check("subDoc").not().isEmpty().withMessage("اسم الدكتور مطلوب"),
  check("deptName").not().isEmpty().withMessage("القسم مطلوب"),
  subController.postSub
);

router.post(
  "/:subId",
  Type.isAdmin,
  bodyParser.urlencoded({ extended: false }),
  check("subName").not().isEmpty().withMessage("اسم الماده مطلوب"),
  check("subCode").not().isEmpty().withMessage("كود الماده مطلوب"),
  check("subPrev").not().isEmpty().withMessage("المتطلب السابق مطلوب"),
  check("subDoc").not().isEmpty().withMessage("اسم الدكتور مطلوب"),
  check("deptName").not().isEmpty().withMessage("القسم مطلوب"),
  subController.postsubEdit
);

module.exports = router;
