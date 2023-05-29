const expressAsyncHandler = require("express-async-handler");
const Post = require("../../model/post/Post");
const Filter = require("bad-words");
const fs = require("fs");
const validateMongoId = require("../../utils/validateMongoId");
const User = require("../../model/user/User");
const cloudinaryUploadImg = require("../../utils/cloudinary");

const createPostController = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  //   validateMongodbId(req.body.user);
  //Check for bad words
  const filter = new Filter();
  const isProfane = filter.isProfane(req.body.title, req.body.description);
  //Block user
  if (isProfane) {
    await User.findByIdAndUpdate(_id, {
      isBlocked: true,
    });
    throw new Error(
      "Creating Failed because it contains profane words and you have been blocked"
    );
  }

  //1. Get the oath to img
  const localPath = `public/images/posts/${req.file.filename}`;
  //2.Upload to cloudinary
  const imgUploaded = await cloudinaryUploadImg(localPath);
  try {
    // const post = await Post.create({
    //   ...req.body,
    //   image: imgUploaded?.url,
    //   user: _id,
    // });
    res.json(imgUploaded);
    //Remove uploaded img
    fs.unlinkSync(localPath);
  } catch (error) {
    res.json(error);
  }
});

const fetchPostsController = expressAsyncHandler(async (req, res) => {
  try {
    const posts = await Post.find({}).populate("user");
    res.json(posts);
  } catch (error) {}
});

const fetchPostController = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const post = await Post.findById(id)
      .populate("user")
      .populate("disLikes")
      .populate("likes");

    //Update number of views
    await Post.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      { new: true }
    );
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});

const updatePostController = expressAsyncHandler(async (req, res) => {
  console.log(req.user);
  const { id } = req.params;
  validateMongoId(id);
  try {
    const post = await Post.findByIdAndUpdate(
      id,
      {
        ...req.body,
        user: req.user?._id,
      },
      {
        new: true,
      }
    );
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});

const deletePostController = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const post = await Post.findOneAndDelete(id);
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});

const addLikeToPostController = expressAsyncHandler(async (req, res) => {
  //1. Find the post to be liked
  const { postId } = req.body;
  const post = await Post.findById(postId);
  //2. Find the login user
  const loginUserId = req?.user?._id;
  //3. Check if this user has liked this post
  const isLiked = post?.isLiked;
  //4. Find if this user has dislike this post
  const alreadyDisliked = post?.disLikes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );
  //5 Remove the user from dislikes array if exists
  if (alreadyDisliked) {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { disLikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
    res.json(post);
  }
  //6 Remove the user if he has liked the post
  if (isLiked) {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(post);
  } else {
    //Add to likes
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      { new: true }
    );
    res.json(post);
  }
});

const addDislikeToPostController = expressAsyncHandler(async (req, res) => {
  //1. Find the post to be disliked
  const { postId } = req.body;
  const post = await Post.findById(postId);
  //2. Find the login user
  const loginUserId = req?.user?._id;
  //3. Check if this user has disliked this post
  const isDisliked = post?.isDisliked;
  //4. Find if this user has liked this post
  const alreadyLiked = post?.likes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );
  //5 Remove the user from likes array if exists
  if (alreadyLiked) {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(post);
  }
  //6 Remove the user if he has disliked the post
  if (isDisliked) {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { disLikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
    res.json(post);
  } else {
    //Add to disLikes
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { disLikes: loginUserId },
        isDisliked: true,
      },
      { new: true }
    );
    res.json(post);
  }
});

module.exports = {
  createPostController,
  fetchPostsController,
  fetchPostController,
  updatePostController,
  deletePostController,
  addLikeToPostController,
  addDislikeToPostController,
};
