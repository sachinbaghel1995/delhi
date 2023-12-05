const { where } = require("sequelize");
const db = require("../models");
const bcrypt = require("bcrypt");
const User = db.users;
const jwt = require("jsonwebtoken");

function isstringinvalid(string) {
  if (string == undefined || string.length === 0) {
    return true;
  } else {
    return false;
  }
}

const addUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (
      isstringinvalid(name) ||
      isstringinvalid(email) ||
      isstringinvalid(password)
    ) {
      return res
        .status(400)
        .json({ err: "Bad parameters . Something is missing" });
    }
    const saltrounds = 10;
    bcrypt.hash(password, saltrounds, async (err, hash) => {
      console.log(err);
      await User.create({ name, email, password: hash }); // hash password
      res.status(201).json({ message: "Successfuly create new user" });
    });
  } catch (err) {
    res.status(500).json(err);
  }
};
function generateAccessToken(id, name, ispremiumuser) {
  return jwt.sign({ userId: id, name: name, ispremiumuser }, "SECRETKEY");
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (isstringinvalid(email) || isstringinvalid(password)) {
      return res
        .status(400)
        .json({ message: "Email or Password is missing", success: false });
    }
    console.log(password);

    const user = await User.findAll({ where: { email } });
    if (user.length > 0) {
      console.log(user);
      bcrypt.compare(password, user[0].password, (err, result) => {
        if (err) {
          res
            .status(500)
            .json({ success: false, message: "Something went wrong" });
        }
        if (result === true) {
          res
            .status(200)
            .json({
              success: true,
              message: "GOT PRIME USER",
              token: generateAccessToken(
                user[0].id,
                user[0].name,
                user[0].ispremiumuser
              ),
            });
        } else {
          return res
            .status(400)
            .json({ success: false, message: "Password Is Incorrect" });
        }
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "User Does Not Exist" });
    }
  } catch (err) {
    res.status(500).json({ message: err, success: false });
  }
};
// const getAllUsers = async (req, res) => {
//   let users = await User.findAll();
//   res.status(200).send(users);
// };
const getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  addUser,
  login,
  generateAccessToken,
  getUser,
};
