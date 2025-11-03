import User from "../models/userModel.js";
import { filterEmptyValues } from "../utils/filterEmptyValues.js";

export const userController = {
  deleteUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Người dùng không tồn tại",
          deletedUser: user,
        });
      }
      res.status(200).json({
        success: true,
        message: "Xóa người dùng thành công",
        deletedUser: user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Lỗi khi xóa người dùng",
        error: error.message,
      });
    }
  },
  getUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId).select("-password");
      if (!user) {
        res.status(400).json({
          success: false,
          message: "Người dùng không tồn tại",
        });
      }
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      if (error.kind === "ObjectId") {
        return res.status(400).json({
          success: false,
          message: "ID người dùng không hợp lệ",
        });
      }

      res.status(500).json({
        success: false,
        message: "Lỗi khi tải người dùng",
        error: error.message,
      });
    }
  },
  // get all users
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find();
      const data = users.map((u) => ({
        _id: u._id,
        username: u.username,
        email: u.email,
        role: u.role,
        avatar: u.avatar,
      }));
      res.status(200).json({ success: true, data: data });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
  //update user info
  updateUser: async (req, res) => {
    const userId = req.user.id;
    const updateData = filterEmptyValues(req.body);

    delete updateData.role;
    delete updateData.shopping_cart;
    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        {
          new: true,
          runValidators: true,
        }
      );
      if (!updatedUser)
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      const userResponse = updatedUser.toObject();
      delete userResponse.password;

      return res.status(200).json({
        success: true,
        user: userResponse,
        message:
          "Please log in again to see all updated changes across the application.",
        life: 8000,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
};
