import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import redisClient from "../config/redis.js";

// let refreshTokens = [];

// Tạo transporter gửi mail
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: process.env.PORT,
  // secure: false, // true for 465, false for other ports
  secure: true,
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
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        res
          .status(400)
          .json({ success: false, message: "Vui lòng nhập đầy đủ thông tin." });
      }
      if (password.length < 8 || password.length > 16) {
        res
          .status(400)
          .json({ success: false, message: "Mật khẩu phải dài 8-16 kí tự." });
      }
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        res
          .status(409)
          .json({ success: false, message: "Username đã được đăng ký." });
      }
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        res
          .status(409)
          .json({ success: false, message: "Email đã được đăng ký." });
      }
      // hask password
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);

      const newUser = await new User({ username, email, password: hashed });
      const user = await newUser.save();
      res.status(200).json({
        success: true,
        data: user,
        message: "Đăng ký tài khoản thành công",
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  //Generate access token
  generateAccessToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.MY_ACCESS_KEY,
      { expiresIn: "30d" }
    );
  },
  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.MY_REFRESH_ACCESS_KEY,
      { expiresIn: "365d" }
    );
  },

  // LOGIN
  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({
        username: req.body.username,
      });
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "Username is not valid!" });
      }
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        return res
          .status(404)
          .json({ success: false, message: "Wrong password!" });
      }
      if (user && validPassword) {
        const accessToken = authController.generateAccessToken(user);
        const refreshToken = authController.generateRefreshToken(user);
        // refreshTokens.push(refreshToken);
        const EXPIRY_SECONDS = 365 * 24 * 60 * 60; //365 days
        await redisClient.set(
          `refreshToken:${user._id}`,
          refreshToken,
          "EX",
          EXPIRY_SECONDS
        );

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          path: "/",
          // secure: false,
          // sameSite: "Strict",
          secure: true,
          sameSite: "None",
        });
        const { password, ...other } = user._doc;
        res
          .status(200)
          .json({ success: true, data: { ...other, accessToken } });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  requestRefreshToken: async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json("You're not authenticated");
    // if (!refreshTokens.includes(refreshToken)) {
    //   return res.status(403).json("Refesh is not valid");
    // }
    jwt.verify(
      refreshToken,
      process.env.MY_REFRESH_ACCESS_KEY,
      async (err, user) => {
        if (err) {
          console.error("Refresh Token Verification Error:", err);
          return res.status(403).json("Refresh Token is not valid or expired.");
        }
        const storedToken = await redisClient.get(`refreshToken:${user.id}`);
        if (!storedToken || storedToken !== refreshToken) {
          return res
            .status(403)
            .json("Refresh Token mismatch or already revoked.");
        }
        // refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

        //create new accessToken, refreshToken
        const newAccessToken = authController.generateAccessToken(user);
        const newRefreshToken = authController.generateRefreshToken(user);

        const EXPIRY_SECONDS = 365 * 24 * 60 * 60; // 365 ngày
        await redisClient.set(
          `refreshToken:${user.id}`,
          newRefreshToken,
          "EX",
          EXPIRY_SECONDS
        );

        // refreshTokens.push(newRefreshToken);

        res.cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          path: "/",
          // secure: false,
          // sameSite: "Strict",
          secure: true,
          sameSite: "None",
        });
        res.status(200).json({ accessToken: newAccessToken });
      }
    );
  },

  logoutUser: async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(400).json("No refresh token found");
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.MY_REFRESH_ACCESS_KEY
      );
      const userId = decoded.id;
      await redisClient.del(`refreshToken:${userId}`);
      res.clearCookie("refreshToken");

      res.status(200).json("Logged out !");
    } catch (err) {
      res.status(500).json({ message: "Logout failed", error: err.message });
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const { username } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
        res
          .status(404)
          .json({ success: false, message: "Username không tồn tại" });
      }

      // create OTP
      const otp = generateOTP();
      user.resetOtp = otp;
      user.resetOtpExpires = Date.now() + 5 * 60 * 1000; // 5 phút
      await user.save();

      // send email
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "OTP đặt lại mật khẩu - SneakerT",
        html: `<h2>Mã OTP của bạn là: ${otp}</h2>
                <h4>Mã OTP sẽ hết hạn sau 5 phút</h4>`,
      });
      res.status(200).json({
        success: true,
        message: `OTP đã được gửi vào email ${user.email}`,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "forgotPassword failed", error: error.message });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { username, otp, newPassword } = req.body;
      const user = await User.findOne({ username });

      if (!user)
        return res
          .status(404)
          .json({ success: false, message: "Username is not exists" });

      if (user.resetOtp !== otp)
        return res
          .status(404)
          .json({ success: false, message: "OTP không hợp lệ" });

      if (Date.now() > user.resetOtpExpires)
        return res
          .status(404)
          .json({ success: false, message: "OTP đã hết hạn" });

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;

      // Xoá OTP sau khi dùng
      user.resetOtp = undefined;
      user.resetOtpExpires = undefined;
      await user.save();

      res.json({ success: true, message: "Đặt lại mật khẩu thành công" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "resetPassword failed", error: error.message });
    }
  },
};
