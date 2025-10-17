import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

let refreshTokens = [];

// Tạo transporter gửi mail
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: process.env.PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 chữ số
}

export const authController = {
  registerUser: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin." });
      }
      if (password.length < 8 || password.length > 16) {
        res.status(400).json({ message: "Mật khẩu phải dài 8-16 kí tự." });
      }
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(409).json({ message: "Email đã được đăng ký." });
      }

      // hask password
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);

      // create new User
      const newUser = await new User({ name, email, password: hashed });

      //save to DB
      const user = await newUser.save();
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  //Generate access token
  generateAccessToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        admin: user.admin,
      },
      process.env.MY_ACCESS_KEY,
      { expiresIn: "30m" }
    );
  },
  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        admin: user.admin,
      },
      process.env.MY_REFRESH_ACCESS_KEY,
      { expiresIn: "30d" }
    );
  },

  // LOGIN
  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ account: req.body.account });
      if (!user) {
        return res.status(404).json("Wrong account!");
      }
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        return res.status(404).json("Wrong password!");
      }
      if (user && validPassword) {
        const accessToken = authController.generateAccessToken(user);
        const refreshToken = authController.generateRefreshToken(user);
        refreshTokens.push(refreshToken);

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          path: "/",
          sameSite: "strict",
        });
        const { password, ...other } = user._doc;
        res.status(200).json({ ...other, accessToken });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  requestRefreshToken: async (req, res) => {
    //take refreshToken from user
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json("You're not authenticated");

    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json("Refesh is not valid");
    }
    jwt.verify(refreshToken, process.env.MY_REFRESH_ACCESS_KEY, (err, user) => {
      if (err) {
        console.log(err);
      }
      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

      //create new accessToken, refreshToken
      const newAccessToken = authController.generateAccessToken(user);
      const newRefreshToken = authController.generateRefreshToken(user);
      refreshTokens.push(newRefreshToken);

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });
      res.status(200).json({ accessToken: newAccessToken });
    });
  },

  logoutUser: async (req, res) => {
    try {
      res.clearCookie("refreshToken");
      refreshTokens = refreshTokens.filter(
        (token) => token !== req.cookies.refreshToken
      );
      res.status(200).json("Logged out !");
    } catch (err) {
      res.status(500).json({ message: "Logout failed", error: err.message });
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const { account } = req.body;
      const user = await User.findOne({ account });
      if (!user) {
        res.status(404).json({ message: "Account không tồn tại" });
      }

      // create OTP
      const otp = generateOTP();
      user.resetOtp = otp;
      user.resetOtpExpires = Date.now() + 5 * 60 * 1000; // 5 phút
      await user.save();

      // send email
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "OTP đặt lại mật khẩu",
        // text: `Mã OTP của bạn là: ${otp}. Hết hạn sau 5 phút.`,
        html: `<h2>Mã OTP của bạn là: ${otp}</h2>
                <h4>Mã OTP sẽ hết hạn sau 5 phút.</h4>`,
      });
      res.json("OTP đã được gửi vào email");
    } catch (error) {
      res
        .status(500)
        .json({ message: "forgotPassword failed", error: error.message });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { email, otp, newPassword } = req.body;
      const user = await User.findOne({ email });

      if (!user || user.resetOtp !== otp || Date.now() > user.resetOtpExpires) {
        return res
          .status(400)
          .json({ message: "OTP không hợp lệ hoặc đã hết hạn" });
      }

      // Băm mật khẩu mới
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;

      // Xoá OTP sau khi dùng
      user.resetOtp = undefined;
      user.resetOtpExpires = undefined;
      await user.save();

      res.json({ message: "Đặt lại mật khẩu thành công" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "resetPassword failed", error: error.message });
    }
  },
};
