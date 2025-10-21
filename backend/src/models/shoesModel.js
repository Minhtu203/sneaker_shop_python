import mongoose from "mongoose";

const shoesScheme = new mongoose.Schema(
  {
    name: { type: String, require: true, trim: true },
    img: [{ type: String, require: true, trim: true }],
    brand: { type: String, require: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, require: true, min: 0 },
    sizes: [
      {
        size: { type: Number, require: true },
        stock: { type: Number, default: 0, min: 0 },
      },
    ],
    colors: [{ colorName: { type: String, require: true }, color: [String] }],
    category: { type: String, default: "Sneaker" },
    gender: {
      type: String,
      enum: ["men", "women", "unisex"],
      default: "unisex",
    },
    rating: {
      average: { type: String, default: 0 },
      count: { type: Number, default: 0 },
    },
    isFeatured: { type: Boolean, default: false },
    createAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Shoes", shoesScheme);
