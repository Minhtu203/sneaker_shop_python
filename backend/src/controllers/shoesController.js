import Shoes from "../models/shoesModel.js";
import { filterEmptyValues } from "../utils/filterEmptyValues.js";

export const shoesController = {
  // get all shoes
  getAllShoes: async (req, res) => {
    try {
      const shoes = await Shoes.find();
      res.status(200).json({ success: true, data: shoes });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message || error,
      });
    }
  },
  //get shoes by id
  getShoesById: async (req, res) => {
    try {
      const { id } = req.body;
      if (!id)
        return res
          .status(400)
          .json({ success: false, message: "Missing product ID" });
      const shoe = await Shoes.findById(id);
      if (!shoe)
        return res
          .status(404)
          .json({ success: false, message: "Can't found product" });

      res.status(200).json({ success: true, data: shoe });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message || error });
    }
  },
  // create shoes
  createShoes: async (req, res) => {
    try {
      const data = req.body;
      data.colors = data.colors.map((color) => ({
        ...color,
        sizes: color.sizes.sort((a, b) => a.size - b.size),
      }));

      const newShoe = new Shoes(data);
      const savedShoes = await newShoe.save();

      res.status(200).json({
        success: true,
        data: savedShoes,
        message: "Create item successfully",
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message || error });
    }
  },
  // update shoes
  updateShoes: async (req, res) => {
    try {
      const { images, ...otherData } = req.body;
      const filterOtherData = filterEmptyValues(otherData);

      let updateQuerry = {};

      if (Object.keys(filterOtherData).length > 0) {
        updateQuerry = { $set: filterOtherData };
      }
      if (images && images.length > 0)
        updateQuerry.$push = { img: { $each: images } };

      const updateShoes = await Shoes.findByIdAndUpdate(
        req.params.id,
        updateQuerry,
        { new: true, runValidators: true }
      );

      if (!updateShoes) {
        return res
          .status(404)
          .json({ success: false, message: "Can't found product" });
      }
      res.status(200).json({
        success: true,
        data: updateShoes,
        message: "Item updated successfully",
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message || error });
    }
  },
  // delete shoes
  deleteShoes: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id)
        return res.status(404).json({ error: "Missing product ID to delete" });
      const deleteShoes = await Shoes.findByIdAndDelete(id);
      if (!deleteShoes)
        return res.status(200).json({ message: "Can't found product" });
      res
        .status(200)
        .json({ success: true, message: "Delete product successfully" });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Xóa thất bại",
        error: error.message || error,
      });
    }
  },
  // get brand Jordan shoes
  getJordanShoes: async (req, res) => {
    try {
      const jordanShoes = await Shoes.find({ brand: "Jordan" });
      if (jordanShoes.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "No product found" });
      }
      res.status(200).json({ success: true, data: jordanShoes });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message || error,
      });
    }
  },
  // get brand Nike shoes
  getNikeShoes: async (req, res) => {
    try {
      const jordanShoes = await Shoes.find({ brand: "Nike" });
      if (jordanShoes.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "No product found" });
      }
      res.status(200).json({ success: true, data: jordanShoes });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message || error,
      });
    }
  },
  // get brand Airmax shoes
  getAirmaxShoes: async (req, res) => {
    try {
      const jordanShoes = await Shoes.find({ brand: "Airmax" });
      if (jordanShoes.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "No product found" });
      }
      res.status(200).json({ success: true, data: jordanShoes });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message || error,
      });
    }
  },
  // get is featured shoes
  getIsFeaturedShoes: async (req, res) => {
    try {
      const featuredShoes = await Shoes.find({ isFeatured: "true" });
      if (featuredShoes.length === 0)
        return res
          .status(404)
          .json({ success: false, message: "No product found" });
      res.status(200).json({ success: true, data: featuredShoes });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
  // get basketball shoes
  getBasketballShoes: async (req, res) => {
    try {
      const basketballShoes = await Shoes.find({ category: "Basketball" });
      if (basketballShoes.length === 0)
        return res
          .status(404)
          .json({ success: false, message: "No product found" });
      res.status(200).json({ success: true, data: basketballShoes });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
  // get football shoes
  getFootballShoes: async (req, res) => {
    try {
      const footballShoes = await Shoes.find({ category: "Football" });
      if (footballShoes.length === 0)
        return res
          .status(404)
          .json({ success: false, message: "No product found" });
      res.status(200).json({ success: true, data: footballShoes });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
  // get golf shoes
  getGolfShoes: async (req, res) => {
    try {
      const golfShoes = await Shoes.find({ category: "Golf" });
      if (golfShoes.length === 0)
        return res
          .status(404)
          .json({ success: false, message: "No product found" });
      res.status(200).json({ success: true, data: golfShoes });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
  // get tennis shoes
  getTennisShoes: async (req, res) => {
    try {
      const tennisShoes = await Shoes.find({ category: "Tennis" });
      if (tennisShoes.length === 0)
        return res
          .status(404)
          .json({ success: false, message: "No product found" });
      res.status(200).json({ success: true, data: tennisShoes });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
};
