const mongoose = require("mongoose");
const { subMaterial } = require("../controllers/docSub.controller");
const { Students } = require("./student.model");

const DB_URL = process.env.DB_URL;

const SubSchema = mongoose.Schema({
  subName: String,
  subCode: String,
  subDoc: String,
  deptName: String,
  subPrev: String,
  material: Array,
});

const SubjectItem = mongoose.model("Subject", SubSchema);

exports.addNewItem = (data) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL)
      .then(() => {
        return SubjectItem.findOne({ subName: data.subName });
      })
      .then((items) => {
        if (!items) {
          let item = new SubjectItem(data);
          return item.save();
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

exports.getDocSub = (docName) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL)
      .then(() => {
        return SubjectItem.find({ subDoc: docName });
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

exports.getItems = () => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL)
      .then(() => {
        return SubjectItem.find({}).sort({ subDoc: 1 });
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

exports.deleteItem = (id) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL)
      .then(() => SubjectItem.findByIdAndDelete(id))
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

exports.editItem = (data) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL)
      .then(() => {
        return SubjectItem.findByIdAndUpdate(data.id, data.data);
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

exports.getDocSubInfo = (subName) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL)
      .then(() => {
        return SubjectItem.findOne({ subName });
      })
      .then((sub) => {
        mongoose.disconnect();
        resolve(sub);
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};

exports.addPdfToSub = (data) => {
  const subName = data.subName;
  const subDoc = data.docName;
  const filename = data.filename;
  return new Promise((resolve, reject) => {
    /*
        1-  get sub
        2-  check if file exist
                reject
            else 
                add
        */
    mongoose
      .connect(DB_URL)
      .then(() => {
        return SubjectItem.findOne({ subName, subDoc });
      })
      .then((sub) => {
        if (sub.material.includes(filename)) {
          mongoose.disconnect();
          reject("هذا الملف موجود من قبل");
        } else {
          return SubjectItem.findOneAndUpdate(
            { subName, subDoc },
            { $push: { material: filename } }
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

exports.getAllPdf = (subName, subDoc) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL)
      .then(() => {
        return SubjectItem.findOne({ subName, subDoc });
      })
      .then((sub) => {
        mongoose.disconnect();
        resolve(sub.material);
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};

exports.deletePdfByName = (data) => {
  const subName = data.subName;
  const subDoc = data.docName;
  const filename = data.filename;
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL)
      .then(() => {
        return SubjectItem.findOneAndUpdate(
          { subName, subDoc },
          { $pull: { material: filename } }
        );
      })
      .then(() => {
        mongoose.disconnect();
        resolve("file deleted successfully");
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};

exports.getSubjectMaterial = (subName) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL)
      .then(() => {
        return SubjectItem.findOne({ subName });
      })
      .then((subject) => {
        mongoose.disconnect();
        resolve(subject.material);
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};
