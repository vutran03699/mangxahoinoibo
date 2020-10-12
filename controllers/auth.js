const jwt = require("jsonwebtoken");
require("dotenv").config();
const expressJwt = require("express-jwt");
const User = require("../models/user");
const _ = require("lodash");
const { OAuth2Client } = require("google-auth-library");
const { sendEmail } = require("../helpers");

exports.signup = async (req, res) => {
  const userExists = await User.findOne({ email: req.body.email });
  if (userExists)
    return res.status(403).json({
      error: "Email đã được thực hiện!",
    });
  const user = await new User(req.body);
  await user.save();
  res
    .status(200)
    .json({ message: "Đăng ký thành công! Xin vui lòng đăng nhập." });
};

exports.signin = (req, res) => {
  // tìm người dùng dựa trên email
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    // nếu có lỗi hoặc không có người dùng
    if (err || !user) {
      return res.status(401).json({
        error: "User with that email does not exist. Please signup.",
      });
    }
    // nếu người dùng được tìm thấy, đảm bảo email và mật khẩu khớp
    // tạo phương thức xác thực trong mô hình và sử dụng ở đây
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password do not match",
      });
    }
    //tạo mã thông báo với id người dùng và bí mật
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET
    );
    // duy trì mã thông báo là 't' trong cookie có thời hạn sử dụng
    res.cookie("t", token, { expire: new Date() + 9999 });
    // truy xuất phản hồi với người dùng và mã thông báo cho khách hàng frontend
    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, email, name, role } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("t");
  return res.json({ message: "Đăng xuất thành công!" });
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  userProperty: "auth",
});

exports.forgotPassword = (req, res) => {
  if (!req.body)
    return res.status(400).json({ message: "Không có yêu cầu cơ thể" });
  if (!req.body.email)
    return res
      .status(400)
      .json({ message: "Không có email trong cơ thể yêu cầu" });

  console.log("quên mật khẩu tìm người dùng với email đó");
  const { email } = req.body;
  console.log("đăng nhập req.body", email);
  // tìm người dùng dựa trên email
  User.findOne({ email }, (err, user) => {
    // nếu có lỗi hoặc không có người dùng
    if (err || !user)
      return res.status("401").json({
        error: "Người dùng với email đó không tồn tại!",
      });

    // generate a token with user id and secret
    const token = jwt.sign(
      { _id: user._id, iss: process.env.APP_NAME },
      process.env.JWT_SECRET
    );

    // email data
    const emailData = {
      from: "noreply@node-react.com",
      to: email,
      subject: "Hướng dẫn đặt lại mật khẩu",
      text: `Vui lòng sử dụng liên kết sau để đặt lại mật khẩu của bạn: ${process.env.CLIENT_URL}/reset-password/${token}`,
      html: `<p>Vui lòng sử dụng liên kết sau để đặt lại mật khẩu của bạn:</p> <p>${process.env.CLIENT_URL}/reset-password/${token}</p>`,
    };

    return user.updateOne({ resetPasswordLink: token }, (err, success) => {
      if (err) {
        return res.json({ message: err });
      } else {
        sendEmail(emailData);
        return res.status(200).json({
          message: `Email đã được gửi tới ${email}. Làm theo hướng dẫn để đặt lại mật khẩu của bạn.`,
        });
      }
    });
  });
};

// để cho phép người dùng đặt lại mật khẩu
// trước tiên, bạn sẽ tìm thấy người dùng trong cơ sở dữ liệu với resetPasswordLink của người dùng
// giá trị resetPasswordLink của mô hình người dùng phải khớp với mã thông báo
// nếu người dùng resetPasswordLink (mã thông báo) khớp với req.body.resetPasswordLink (mã thông báo)
// sau đó chúng tôi có đúng người dùng

exports.resetPassword = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  User.findOne({ resetPasswordLink }, (err, user) => {
    // if err or no user
    if (err || !user)
      return res.status("401").json({
        error: "Liên kết không hợp lệ!",
      });

    const updatedFields = {
      password: newPassword,
      resetPasswordLink: "",
    };

    user = _.extend(user, updatedFields);
    user.updated = Date.now();

    user.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      res.json({
        message: `Tuyệt quá! Bây giờ bạn có thể đăng nhập bằng mật khẩu mới của bạn.`,
      });
    });
  });
};

const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

exports.socialLogin = async (req, res) => {
  const idToken = req.body.tokenId;
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.REACT_APP_GOOGLE_CLIENT_ID,
  });
  // console.log('ticket', ticket);
  const {
    email_verified,
    email,
    name,
    picture,
    sub: googleid,
  } = ticket.getPayload();

  if (email_verified) {
    console.log(`email_verified > ${email_verified}`);

    const newUser = { email, name, password: googleid };
    // try signup by finding user with req.email
    let user = User.findOne({ email }, (err, user) => {
      if (err || !user) {
        // create a new user and login
        user = new User(newUser);
        req.profile = user;
        user.save();
        // generate a token with user id and secret
        const token = jwt.sign(
          { _id: user._id, iss: process.env.APP_NAME },
          process.env.JWT_SECRET
        );
        res.cookie("t", token, { expire: new Date() + 9999 });
        // return response with user and token to frontend client
        const { _id, name, email } = user;
        return res.json({ token, user: { _id, name, email } });
      } else {
        // update existing user with new social info and login
        req.profile = user;
        user = _.extend(user, newUser);
        user.updated = Date.now();
        user.save();
        // generate a token with user id and secret
        const token = jwt.sign(
          { _id: user._id, iss: process.env.APP_NAME },
          process.env.JWT_SECRET
        );
        res.cookie("t", token, { expire: new Date() + 9999 });
        //trả lời phản hồi với người dùng và mã thông báo cho khách hàng frontend
        const { _id, name, email } = user;
        return res.json({ token, user: { _id, name, email } });
      }
    });
  }
};
