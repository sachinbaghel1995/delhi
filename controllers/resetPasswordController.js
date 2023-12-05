const { where } = require("sequelize");
const db = require("../models");
const sequelize = db.sequelize;
const ResetPassword = db.resetpassword;
const User = db.users;
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const Sib = require("sib-api-v3-sdk");

const forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (user) {
      const id = uuid.v4();
      user.createForgotpassword({ id, active: true }).catch((err) => {
        throw new Error(err);
      });

      const client = Sib.ApiClient.instance;
      const apiKey = client.authentications["api-key"];
      apiKey.apiKey = process.env.SEND_API_KEY;
      const transEmailApi = new Sib.TransactionalEmailsApi();

      const sender = {
        email: "baghel.sachin1995@gmail.com",
        name: "Sachin",
      };
      const receivers = [
        {
          email: email,
        },
      ];
      const emailResponse = await transEmailApi.sendTransacEmail({
        sender,
        To: receivers,
        subject: "Expense Tracker Reset Password",
        textContent: "Link Below",
        htmlContent: `<h3>Hi! We got the request from you for reset the password. Here is the link below >>></h3>
                    <a href="http://localhost:3000/api/password/resetpassword/${id}">Reset password</a>`,
        params: {
          requestId: requestId,
        },
      });
      return res.status(200).json({
        message:
          "Link for reset the password is successfully send on your Mail Id!",
      });
    }
  } catch (error) {
    console.log("error");
    return res.status(409).json({ message: "failed changing password" });
  }
};

const resetpassword = (req, res) => {
  const id = req.params.id;
  ResetPassword.findOne({ where: { id } }).then((forgotpasswordrequest) => {
    if (forgotpasswordrequest) {
      forgotpasswordrequest.update({ active: false });
      res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>

                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`);
      res.end();
    }
  });
};
const updatepassword = (req, res) => {
  try {
    const { newpassword } = req.query;
    const { resetpasswordid } = req.params;
    ResetPassword.findOne({ where: { id: resetpasswordid } }).then(
      (resetpasswordrequest) => {
        User.findOne({ where: { id: resetpasswordrequest.userId } }).then(
          (user) => {
            if (user) {
              const saltRounds = 10;
              bcrypt.genSalt(saltRounds, function (err, salt) {
                if (err) {
                  console.log(err);
                  throw new Error(err);
                }
                bcrypt.hash(newpassword, salt, function (err, hash) {
                  if (err) {
                    console.log(err);
                    throw new Error(err);
                  }
                  user.update({ password: hash }).then(() => {
                    res
                      .status(201)
                      .json({ message: "Successfuly update the new password" });
                  });
                });
              });
            } else {
              return res
                .status(404)
                .json({ error: "No user Exists", success: false });
            }
          }
        );
      }
    );
  } catch (error) {
    return res.status(403).json({ error, success: false });
  }
};

module.exports = {
  forgotpassword,
  resetpassword,
  updatepassword,
};
