const Account = require("../../DB/models/accountModel");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//AC0021,AC0022 login failed
//AC0031 auth failed


exports.post_register = (req, res, next) => {
  Account.find({ email: req.body.email })
    .exec()
    .then((accountRes) => {
      if (accountRes.length >= 1) {
        res.status(409).json({
          status: "Error",
          code: "AC0011",
        });
      } else {
        bcrypt.hash(req.body.password.trim(), 10).then((hash) => {
          const account = Account({
            _id: mongoose.Types.ObjectId(),
            name: req.body.name.trim(),
            email: req.body.email.trim(),
            password: hash,
          });

          account
            .save()
            .then(() => {
              return res.status(201).json({
                status: "Success",
                code: "AC00001",
              });
            })
            .catch((err) => {
              console.log(err);
              return res.status(500).json({
                status: "Error",
                code: "AC0012",
              });
            });
        });
      }
    })
    .catch();
};

exports.post_login = (req, res, next) => {

  const getData = (account) => {
    return {
      accountID: account._id,
      email: account.email,
      name: account.name,
      role: account.role,
    };
  };

  Account.find({ email: req.body.email })
    .exec()
    .then((accountRes) => {
      if (accountRes.length >= 1) {
        bcrypt.compare(
          req.body.password,
          accountRes[0].password,
          (err, result) => {
            if (result) {

              jwt.sign(
                getData(accountRes[0]),
                process.env.JWT_SECRET,
                { expiresIn: "3h" },
                (err, token) => {
                  req.session.user = getData(accountRes[0]);
                  req.session.cookie.maxAge = 3 * 60 * 60 * 1000;

                  console.log(req.session);
                  res.cookie("token", token, {
                    maxAge: 3 * 60 * 60 * 1000,
                    httpOnly: true,
                  });

                  return res
                    .status(200)
                    .json({
                      status: "Success",
                      account: getData(accountRes[0]),
                    })
                    .end();
                }
              );
            } else {
              return res.status(401).json({
                status: "Error",
                code: "AC0021",
              });
            }
          }
        );
      } else {
        res.status(401).json({
          status: "Error",
          code: "AC0022",
        });
      }
    })
    .catch();
};

exports.get_auth = (req,res,next) => {
  console.log(req.session);

  if(req.session.user){
    return res.status(200).json({
      status: "Success",
      account: req.session.user
    })
  } else {
    return res.status(401).json({
      status: "Error",
      code: "AC0031"
    })
  }
}

exports.get_logout = (req,res,next) => {
  if(req.session.user){
    req.session.destroy();
  }
  res.clearCookie();
  

  return res.status(200).json({
    status: "Success",
    message: "logouted"
  }).end();
}