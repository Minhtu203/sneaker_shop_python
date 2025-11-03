import Cart from "../models/cartModel.js";
import Shoes from "../models/shoesModel.js";
import User from "../models/userModel.js";

export const cartController = {
  // add shoes to cart
  addToCart: async (req, res) => {
    try {
      const { productId, color, size, quantity } = req.body;
      const userId = req.user.id;
      if (!size)
        return res
          .status(400)
          .json({
            success: false,
            message: "Please select a size to continue",
          });

      if (!productId || !quantity)
        return res
          .status(400)
          .json({ success: false, message: "Missing required field" });

      const product = await Shoes.findById(productId);
      if (!product)
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });

      let cart = await Cart.findOne({ userId });
      if (!cart) {
        cart = new Cart({ userId, items: [] });
      }
      const selectedColor = product?.colors?.find(
        (c) => c?.colorName === color
      );

      if (!selectedColor) {
        return res.status(400).json({
          success: false,
          message: "Selected color not found for this product",
        });
      }
      const existingItem = cart.items.find(
        (item) =>
          item.productId.toString() === productId &&
          item.size === size &&
          item.color.colorName === color
      );
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({
          productId,
          name: product.name,
          brand: product.brand,
          price: product.price,
          color: {
            colorName: selectedColor?.colorName || color,
            color: selectedColor?.color || "",
            img: selectedColor?.img || [],
          },
          size,
          quantity,
        });
      }
      const user = await User.findById(userId);
      if (!user)
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      if (!user.shopping_cart) {
        user.shopping_cart = cart._id;
        await user.save();
      }

      await cart.save();
      return res.status(200).json({
        success: true,
        message: "Added item to cart",
        cart,
      });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
  // get all items in cart
  getAllItemsInCart: async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).populate({
        path: "shopping_cart",
        populate: {
          path: "items.productId",
          model: "Shoes",
        },
      });
      if (!user)
        return res
          .status(404)
          .json({ success: false, message: "User not found" });

      const cartItems = user.shopping_cart;

      return res
        .status(200)
        .json({ success: true, cartItems, count: cartItems.length });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
  // remove items from cart
  deleteItem: async (req, res) => {
    try {
      const userId = req.user.id;
      const { productId, size, color } = req.body;
      if (!productId || !size || !color)
        return res
          .status(400)
          .json({ success: false, message: "Missing required field" });

      const cart = await Cart.findOne({ userId });
      if (!cart)
        return res
          .status(404)
          .json({ success: false, message: "Cart not found" });

      const user = await User.findById(userId);
      if (!user)
        return res
          .status(404)
          .json({ success: false, message: "User not found" });

      const result = await Cart.updateOne(
        { userId: userId },
        {
          $pull: {
            items: {
              productId: productId,
              size: size,
              "color.colorName": color,
            },
          },
        }
      );
      if (result.modifiedCount === 0)
        return res.status(404).json({
          success: false,
          message: "Item not found in cart with specified details",
        });

      const updateCart = await Cart.findOne({ userId }).populate(
        "items.productId"
      );
      return res.status(200).json({
        success: true,
        updateCart,
        message: "Remove item from cart successfully",
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
};
