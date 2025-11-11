import mongoose from "mongoose";

const shoesScheme = new mongoose.Schema(
  {
    name: { type: String, require: true, trim: true },
    // img: [{ type: String, require: true, trim: true }],
    brand: { type: String, require: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, require: true, min: 0 },
    colors: [
      {
        colorName: { type: String, require: true, trim: true },
        color: { type: String, require: true, trim: true },
        img: [{ type: String, require: true, trim: true }],
        sizes: [
          {
            size: { type: Number, require: true },
            stock: { type: Number, default: 0, min: 0 },
          },
          { _id: false },
        ],
      },
      { _id: false },
    ],
    category: { type: String, default: "Sneaker" },
    gender: {
      type: String,
      enum: ["Men", "Women", "Unisex"],
      default: "Unisex",
    },
    rating: {
      average: { type: String, default: 0 },
      count: { type: Number, default: 0 },
    },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Shoes", shoesScheme);
