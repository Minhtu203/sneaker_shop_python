import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shoes",
      required: true,
    },
    name: { type: String, require: true },
    brand: { type: String, require: true },
    price: { type: String, require: true },
    color: {
      colorName: { type: String, require: true },
      color: { type: String, require: true },
      img: [{ type: String, require: true }],
    },
    size: { type: Number, require: true },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
  },
  { _id: false, timestamps: true }
);

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
      unique: true,
    },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);
