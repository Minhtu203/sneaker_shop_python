import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
    },
    avatar: { type: String, trim: true },
    password: { type: String, required: true, trim: true },
    role: { type: String, default: "user" },

    shopping_cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      require: true,
    },
    fullName: { type: String, trim: true },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    avatar: { type: String, trim: true },
    resetOtp: { type: String },
    resetOtpExpires: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
