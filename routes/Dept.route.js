const router = require("express").Router();
const bodyParser = require("body-parser");
const check = require("express-validator").check;

const Type = require("./auth.type");

const deptController = require("../controllers/Dept.controller");

router.get("/", Type.isAdmin, deptController.getDept);
router.get("/:deptId", Type.isAdmin, deptController.getDeptEdit);

router.post(
  "/",
  Type.isAdmin,
  bodyParser.urlencoded({ extended: true }),
  check("deptName").not().isEmpty().withMessage("اسم القسم مطلوب"),
  check("deptCode").not().isEmpty().withMessage("كود القسم مطلوب"),
  deptController.postDept
);

router.post(
  "/:deptId",
  Type.isAdmin,
  bodyParser.urlencoded({ extended: true }),
  check("deptName").not().isEmpty().withMessage("اسم القسم مطلوب"),
  check("deptCode").not().isEmpty().withMessage("كود القسم مطلوب"),
  deptController.postDeptEdit
);

module.exports = router;
