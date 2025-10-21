import Shoes from "../models/shoesModel.js";

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
          .json({ success: false, message: "Thiếu ID sản phẩm" });
      const shoe = await Shoes.findById(id);
      if (!shoe)
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy sản phẩm" });

      res.status(200).json({ success: true, data: shoe });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message || error });
    }
  },
  // create shoes
  createShoes: async (req, res) => {
    try {
      const newShoe = new Shoes(req.body);
      const savedShoes = await newShoe.save();
      res.status(200).json({ success: true, data: savedShoes });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message || error });
    }
  },
  // update shoes
  updateShoes: async (req, res) => {
    try {
      const { images, ...otherData } = req.body;
      const updateQuerry = { ...otherData };
      if (images && images.length > 0) {
        updateQuerry.$push = { img: { $each: images } };
      }
      const updateShoes = await Shoes.findByIdAndUpdate(
        req.params.id,
        updateQuerry,
        { new: true, runValidators: true }
      );

      if (!updateShoes) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }
      res.status(200).json({ success: true, data: updateShoes });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message || error });
    }
  },
  // delete
  deleteShoes: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id)
        return res.status(404).json({ error: "Thiếu ID sản phẩm muốn xóa" });
      const deleteShoes = await Shoes.findByIdAndDelete(id);
      if (!deleteShoes)
        return res.status(200).json({ message: "Không tìm thấy sản phẩm" });
      res
        .status(200)
        .json({ success: true, message: "Xóa sản phẩm thành công" });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Xóa thất bại",
        error: error.message || error,
      });
    }
  },
};
