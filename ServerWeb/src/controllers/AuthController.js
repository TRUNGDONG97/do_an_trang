import AdminModel from "../models/AdminModel";
import { isNumeric, isEmpty } from "validator";
import md5 from "md5";
import Constants from "../util/contant";
import crypto from "crypto-js";
const login = async (req, res, next) => {
  res.render("LoginView");
};
const logout = async (req, res, next) => {
  var token = req.signedCookies.token;
  await AdminModel.update(
    {
      token: null,
    },
    {
      where: {
        token,
      },
    }
  );
  res.cookie("token", "");
  res.cookie("password", "");
  res.cookie("username", "");
  res.redirect("login");
};

const postLogin = async (req, res, ) => {
  console.log(req.body)
  var user_name = req.body.username.trim();
  var password = md5(req.body.password.trim());
  // console.log(req.body.password)
  // console.log(password,"oasasa")
  // console.log(user_name)
  // var hashPass = md5(123456)
  // console.log(hashPass)
  if (isEmpty(user_name)) {
    res.render("LoginView", {
      error: "Bạn chưa nhập tên đăng nhập",
      value: req.body,
    });
    return;
  }
  if (isEmpty(req.body.password.trim())) {
    res.render("LoginView", {
      error: "Bạn chưa nhập mật khẩu",
      values: req.body,
    });
    return;
  }
  try {
    const user = await AdminModel.findAll({
      where: {
        username: user_name,
        password,
      },
    });

    // console.log(isEmpty(password))
    if (user.length > 0) {
      // console.log()
      var timeNow = new Date().getTime();
      var token = crypto.AES.encrypt(timeNow.toString(), password).toString();
      // console.log(token);
      await AdminModel.update(
        {
          token,
        },
        {
          where: {
            id: user[0].id,
          },
        }
      );
      res.cookie("token", token, Constants.OPTION);
      // res.cookie('password', user[0].password, Constants.OPTION)
      res.cookie("username", user[0].username, Constants.OPTION);
      res.redirect("home");
      return;
    } else {
      console.log("tk ko tồn tại");
      res.render("LoginView", {
        error: "Bạn nhập sai tài khoản hoặc mật khẩu",
        values: req.body,
      });
      return;
    }
  } catch (error) {
    console.log(error, "error");
    res.render("ErrorView", {
      error: error,
    });
    return;
  }
};

export default {
  login,
  logout,
  postLogin,
};
