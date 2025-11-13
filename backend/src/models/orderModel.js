import mongoose, { Schema } from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    totalAmount: { type: Number, require: true },
    address: { type: String, require: true },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Shoes",
          require: true,
        },
        name: { type: String, require: true },
        color: { type: String, require: true },
        size: { type: String, require: true },
        quantity: { type: String, require: true },
        price: { type: Number, require: true },
        image: { type: String, require: true },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "CreditCard", "BankTransfer", "Paypal"],
      default: "COD",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Shipping", "Delivered", "Cancelled"],
      default: "Pending",
    },
    note: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
