const expressAsyncHandler = require("express-async-handler");
const Comment = require("../../model/comment/Comment");

const createCommentController = expressAsyncHandler(async (req, res) => {
  //1. Get the user
  const user = req.user;
  //2. Get the postId
  const { postId, description } = req.body;
  try {
    const comment = await Comment.create({
      post: postId,
      user,
      description,
    });
    res.json(comment);
  } catch (error) {
    res.json(error);
  }
});

const fetchAllComments = expressAsyncHandler(async (req, res) => {
  try {
    const comments = await Comment.find({}).sort("-created");
    res.json(comments);
  } catch (error) {}
  res.json(error);
});

const fetchCommentController = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await Comment.findById(id);
    res.json(comment);
  } catch (error) {
    res.json(error);
  }
});

const updateCommentController = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const update = await Comment.findByIdAndUpdate(
      id,
      {
        post: req.body?.postId,
        user: req?.user,
        description: req?.body?.description,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.json(update);
  } catch (error) {
    res.json(error);
  }
});

module.exports = {
  createCommentController,
  fetchAllComments,
  fetchCommentController,
  updateCommentController,
};
