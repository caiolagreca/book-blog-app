const express = require("express");
const {
  createPostController,
  fetchPostsController,
  fetchPostController,
  updatePostController,
  deletePostController,
  addLikeToPostController,
} = require("../../controllers/posts/postController");
const authMiddleware = require("../../middlewares/auth/authMiddleware");
const {
  photoUpload,
  postImgResize,
} = require("../../middlewares/uploads/photoUpload");

const postRoute = express.Router();

postRoute.post(
  "/",
  authMiddleware,
  photoUpload.single("image"),
  postImgResize,
  createPostController
);

postRoute.put("/likes", authMiddleware, addLikeToPostController);

postRoute.get("/", fetchPostsController);
postRoute.get("/:id", fetchPostController);
postRoute.put("/:id", authMiddleware, updatePostController);
postRoute.delete("/:id", authMiddleware, deletePostController);



module.exports = postRoute;
