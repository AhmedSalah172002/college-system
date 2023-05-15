const mongoose = require("mongoose");

const DB_URL = process.env.DB_URL;
const StudentSchema = mongoose.Schema({
  name: String,
  prevSub: String,
  accademic: Number,
  currSub: String,
  grades: Object,
  absence: Object,
});

const Students = mongoose.model("Student", StudentSchema);

const addNewItem = (data) => {
  let currSub = data.currSub;

  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL)
      .then(() => {
        return Students.findOne({ name: data.name });
      })
      .then((items) => {
        if (!items) {
          let item = new Students(data);
          return item.save();
        }
      })
      .then((item) => {
        mongoose.disconnect();
        resolve(item);
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};

const getItems = () => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL)
      .then(() => {
        return Students.find({});
      })
      .then((items) => {
        resolve(items);
        mongoose.disconnect();
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};

const getItemByName = (studentName) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL)
      .then(() => {
        return Students.find({ name: studentName });
      })
      .then((items) => {
        resolve(items);
        mongoose.disconnect();
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};

const deleteStudent = (studentName) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL)
      .then(() => Students.findOneAndDelete({ name: studentName }))
      .then(() => {
        mongoose.disconnect();
        resolve();
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};

const setStudentAbsence = (name, accademic, data, subName) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL)
      .then(() => {
        return Students.findOne({ name, accademic });
      })
      .then((student) => {
        let newDate = {
          ...student.absence[subName],
          ...data,
        };

        if (Object.keys(student.absence[subName]).length) {
          return Students.findOneAndUpdate(
            { name, accademic },
            { absence: { ...student.absence, [subName]: newDate } }
          );
        } else {
          return Students.findOneAndUpdate(
            { name, accademic },
            { absence: { ...student.absence, [subName]: data } }
          );
        }
      })
      .then(() => {
        mongoose.disconnect();
        resolve();
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};

const getAllStudent = (subName) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL)
      .then(() => {
        return Students.find({ currSub: { $regex: subName } });
      })
      .then((students) => {
        mongoose.disconnect();
        resolve(students);
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};

const setGrade = (name, accademic, grade, subName) => {
  const status = grade >= 50 ? "ناجح" : "راسب";
  let rate;
  if (grade >= 90) {
    rate = "A+";
  } else if (grade >= 85 && grade < 90) {
    rate = "A";
  } else if (grade >= 70 && grade < 85) {
    rate = "B+";
  } else if (grade >= 60 && grade < 70) {
    rate = "C+";
  } else if (grade >= 50 && grade < 60) {
    rate = "D";
  } else {
    rate = "F";
  }

  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL)
      .then(() => {
        return Students.findOne({ name, accademic });
      })
      .then((student) => {
        return Students.findOneAndUpdate(
          { name, accademic },
          {
            grades: {
              ...student.grades,
              [subName]: { grade: +grade, status, rate },
            },
          }
        );
      })
      .then(() => {
        mongoose.disconnect();
        resolve();
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};

const getGrade = (subName, studentName, accademic) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL)
      .then(() => {
        return Students.findOne({ accademic, name: studentName });
      })
      .then((student) => {
        mongoose.disconnect();
        resolve(student.grades[subName]);
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};

module.exports = {
  Students,
  addNewItem,
  getItems,
  getItemByName,
  setStudentAbsence,
  getAllStudent,
  setGrade,
  getGrade,
  deleteStudent,
};
