const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.users;

const authenticate = async (req, res, next) => {
  try {
    const token = await req.header("Authorization");

    const user = jwt.verify(token, "SECRETKEY");

    await User.findByPk(user.userId).then((user) => {
      req.user = user;
      next();
    });
  } catch (err) {
    console.log(err, "auth error");
    return res.status(401).json({ success: false });
  }
};

module.exports = {
  authenticate,
};
