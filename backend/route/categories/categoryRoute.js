const express = require("express");
const {
  createCategoryController,
  fetchAllCategoriesController,
  fetchCategoryDetailsController,
  updateCategoryController,
  deleteCategoryController,
} = require("../../controllers/category/categoryController");
const authMiddleware = require("../../middlewares/auth/authMiddleware");

const categoryRoute = express.Router();

categoryRoute.post("/", authMiddleware, createCategoryController);
categoryRoute.get("/", authMiddleware, fetchAllCategoriesController);
categoryRoute.get("/:id", authMiddleware, fetchCategoryDetailsController);
categoryRoute.put("/:id", authMiddleware, updateCategoryController);
categoryRoute.delete("/:id", authMiddleware, deleteCategoryController);

module.exports = categoryRoute;
