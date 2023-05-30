const expressAsyncHandler = require("express-async-handler");
const Category = require("../../model/category/Category");

const createCategoryController = expressAsyncHandler(async (req, res) => {
  res.json("created");
});

module.exports = { createCategoryController };
