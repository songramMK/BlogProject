const express = require('express') ; 
const authMiddleware = require('../middleware/authMiddleware.middleware');
const { createComment, getPostComments, commentLike, editComment, deletedComment, getAllComments } = require('../Controllers/comment.controller');
const { route } = require('./user.route');
const router = express.Router() ; 

router.post('/create', authMiddleware , createComment) ; 
router.get("/getPostComments/:postId" , authMiddleware, getPostComments);
router.put("/likeComment/:commentId" , authMiddleware, commentLike);
router.put("/editComment/:commentId" , authMiddleware , editComment) ;
router.delete("/deleteComment/:commentId" , authMiddleware, deletedComment);
router.get("/getcomments", authMiddleware, getAllComments);

module.exports = route ; 
