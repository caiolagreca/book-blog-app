const express = require("express");
const {
  createCommentController,
  fetchAllComments,
  fetchCommentController,
  updateCommentController,
  deleteCommentController,
} = require("../../controllers/comments/commentController");
const authMiddleware = require("../../middlewares/auth/authMiddleware");

const commentRoute = express.Router();

commentRoute.post("/", authMiddleware, createCommentController);
commentRoute.get("/", authMiddleware, fetchAllComments);
commentRoute.get("/:id", authMiddleware, fetchCommentController);
commentRoute.put("/:id", authMiddleware, updateCommentController);
commentRoute.delete("/:id", authMiddleware, deleteCommentController);

module.exports = commentRoute;
