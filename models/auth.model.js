const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { logout } = require("../controllers/auth.controller");

const db_url = process.env.DB_URL;

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  accademic: {
    type: Number,
    default: 0,
  },
  prevSub: {
    type: String,
    default: "لايوجد",
  },
  image: {
    type: String,
    default: "user-image.jpg",
  },
  type: String,
});

const User = mongoose.model("user", userSchema);

exports.addToSignup = (username, type, password, accademic, prevSub) => {
  const addedSuccessfully = "تم اضافه مستخدم جديد";
  return new Promise((resolve, reject) => {
    mongoose
      .connect(db_url)
      .then(() => {
        return User.findOne({ username, accademic });
      })
      .then((user) => {
        if (user) {
          reject("الحساب موجود بالفعل");
          mongoose.disconnect();
        }
      })
      .then(() => {
        let user = new User({
          username: username,
          password: password,
          accademic: accademic,
          prevSub: prevSub,
          type: type,
        });
        return user.save();
      })
      .then(() => {
        mongoose.disconnect();
        resolve(addedSuccessfully);
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
      .connect(db_url)
      .then(() => {
        return User.find({});
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

exports.addToLogin = (username, password) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(db_url)
      .then(() => {
        return User.findOne({ username: username });
      })
      .then((user) => {
        if (!user) {
          mongoose.disconnect();
          reject("الاسم خطأ");
        } else {
          return User.findOne({ password: password }).then((same) => {
            if (!same) {
              mongoose.disconnect();
              reject("كلمه السر خطأ");
            } else {
              mongoose.disconnect();
              resolve({
                id: user._id,
                type: user.type,
                username: user.username,
                prevSub: user.prevSub,
                accademic: user.accademic,
                image: user.image,
              });
            }
          });
        }
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};

exports.deleteItem = (username, _id) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(db_url)
      .then(() => User.findOneAndDelete({ username, _id }))
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

exports.changePassword = (username, userId, newPassword, oldPassword) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(db_url)
      .then(() => {
        return User.findOne({ _id: userId, username });
      })
      .then((user) => {
        if (user.password == oldPassword) {
          return User.findOneAndUpdate(
            { _id: userId, username },
            { password: newPassword }
          );
        } else {
          mongoose.disconnect();
          reject("كلمه السر القديمه غير صحيحه");
        }
      })
      .then(() => {
        mongoose.disconnect();
        resolve("تم تغير كلمة المرور بنجاح");
      })
      .catch((err) => {
        mongoose.disconnect();
        resolve("حدث خطأ اثناء تغير كلمه المرور");
        console.log(err);
      });
  });
};

exports.editUser = (data) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(db_url)
      .then(() => {
        return User.findByIdAndUpdate(data.id, data.data);
      })
      .then(() => {
        mongoose.disconnect();
        resolve("تم التعديل علي المستخدم بنجاح");
      })
      .catch((err) => {
        mongoose.disconnect();
        resolve("حدث خطأ اثناء التعديل");
        console.log(err);
      });
  });
};

exports.changeImage = (username, userId, image) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(db_url)
      .then(() => {
        return User.findOneAndUpdate({ username, _id: userId }, { image });
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
