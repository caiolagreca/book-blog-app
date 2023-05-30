const express = require("express");
const {
  createCategoryController,
} = require("../../controllers/category/categoryController");

const categoryRoute = express.Router();

categoryRoute.post("/", createCategoryController);

module.exports = categoryRoute;
