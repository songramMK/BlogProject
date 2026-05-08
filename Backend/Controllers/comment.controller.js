const mongoose = require("mongoose");
const postModel = require("../models/post.model");
const response = require("../utils/response.utils");
const commentModels = require("../models/comment.model");
const User = require("../models/user.model");
const createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;
    const PostPresent = await postModel.findById(postId);
    if (req.user.userId !== userId) {
      return next(response(res, 400, "USER NOT PRESENT"));
    }
    if (!PostPresent) {
      return next(response(res, 400, "POST DOES NOT EXIST..."));
    }
    const NewCommentCreate = new commentModels({
      content,
      postId,
      userId,
    });
    await NewCommentCreate.save();
    return response(
      res,
      201,
      "COMMENT CREATED SUCCESSFULLy...",
      NewCommentCreate,
    );
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const editComment = async (req, res, next) => {
  try {
    const commentId = req.params.commentId;
    const FindComent = await commentModels.findById(commentId);
    
    if (!FindComent) {
      return next(response(res, 400, "COMMENT NOT FIND"));
    }
    if(req.user.userId !== FindComent.userId.toString()){
        return next(response(res, 403, "YOU CANT EDIT THIs COMMENT"));

    }
    await commentModels.findByIdAndUpdate(
      commentId,
      {
        content: req.body.content,
      },
      { new: true },
    );

    return response(res, 200, "COMMENT UPDATED SUCCESSFULLY");
  } catch (error) {
    next(error);
  }
};
const deletedComment = async (req, res, next) => {
  try {
    const commentId = req.params.commentId;
    const FindComent = await commentModels.findById(commentId);
    if (req.user.userId !== FindComent.userId.toString()) {
      return next(response(res, 403, "YOU CANT Deleted this comment"));
    }
    if (!FindComent) {
      return next(response(res, 400, "COMMENT NOT FIND"));
    }
    await commentModels.findByIdAndDelete(commentId);
    return response(res, 200, "COMMENT DELETED SUCCESSFULLY....");
  } catch (error) {
    next(error);
  }
};
const getPostComments = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const PostExist = await postModel.findById(postId);
    if (!PostExist) {
      return next(response(res, 400, "POST DOESNOT eXIST"));
    }
    const AllCommentsSpecifiedPost = await commentModels
      .find({ postId: postId })
      .sort({ createdAt: -1 });

    return response(
      res,
      200,
      "SUCCESSFULLY FETCH ALL COMMENT",
      AllCommentsSpecifiedPost,
    );
  } catch (error) {
    next(error);
  }
};
const getAllComments = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.index) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "desc" ? -1 : 1;

    const comment = await commentModels
      .find({ userId: req.user.userId })
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalComment = await commentModels.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate(),
    );
    const OneMonthAgoTotalComment = await commentModels.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    return response(res, 200, "All Comment", {
      comment,
      totalComment,
      OneMonthAgoTotalComment,
    });
  } catch (error) {
    next(error);
  }
};
const commentLike = async (req, res, next) => {
  try {
    const commentId = req.params.commentId;
    const CommentPresent = await commentModels.findById(commentId);
    if (!CommentPresent) {
      return next(response(res, 400, "COMMENT NOT PRESENT"));
    }
    const userPresent = await User.findById(req.user.userId);
    if (!userPresent) {
      return next(response(res, 400, "USER NOT PRESENT"));
    }
    const likesIndex = CommentPresent.likes.indexOf(req.user.userId);

    if (likesIndex === -1) {
      CommentPresent.numberOfLikes += 1;
      CommentPresent.likes.push(req.user.userId);
    } else {
      CommentPresent.numberOfLikes -= 1;
      CommentPresent.likes.splice(likesIndex, 1);
    }
    await CommentPresent.save();

    return response(res, 200, "Successfully done");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComment,
  getPostComments,
  deletedComment,
  editComment,
  getAllComments,
  commentLike,
};
