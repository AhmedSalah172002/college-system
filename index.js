require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT;
const path = require("path");

const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const flash = require("connect-flash");

const homeRouter = require("./routes/home.route");
const deptRouter = require("./routes/Dept.route");
const subRouter = require("./routes/Sub.route");
const authRouter = require("./routes/auth.route");
const usersRouter = require("./routes/users.route");
const docSubRouter = require("./routes/docSub.route");
const getDeptRouter = require("./routes/getDept.route");
const adminAbsenceRouter = require("./routes/adminAbsence.route");

const getSubRouter = require("./routes/getSub.route");

const regMaterialsRouter = require("./routes/regMaterials.route");
const studentMaterialsRouter = require("./routes/studentMaterials.route");
const studentRoute = require("./routes/student.route");

app.use(express.static(path.join(__dirname, "assets")));
app.use(express.static(path.join(__dirname, "images")));

app.set("view engine", "ejs");
app.set("views", "views");

const store = new MongoDBStore({
  uri: process.env.DB_URL,
  collection: "sessions",
});

app.use(
  session({
    secret:
      "This is a secretThis is a secretThis is a secretThis is a secretThis is a secretThis is a secret",
    saveUninitialized: true,
    store: store,
  })
);

app.use(flash());
app.use("/", homeRouter);
app.use("/departments", deptRouter);
app.use("/materials", subRouter);
app.use("/getDepartments", getDeptRouter);
app.use("/getMaterials", getSubRouter);
app.use("/users", usersRouter);
app.use("/", authRouter);
app.use("/", docSubRouter);
app.use("/regMaterials", regMaterialsRouter);
app.use("/studentMaterials", studentMaterialsRouter);
app.use("/", studentRoute);
app.use("/", adminAbsenceRouter);

app.listen(port, (err) => {
  console.log(`server listen on port ${port} `);
});
