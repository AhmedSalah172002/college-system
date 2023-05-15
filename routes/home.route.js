const router = require("express").Router();
const signupController = require("../controllers/auth.controller");
const { isAuth } = require("./auth.guard");

router.get("/", isAuth, signupController.getHome);

module.exports = router;
