const express = require('express') ; 
const { multerMiddleware } = require('../config/cloudinary.config');
const authMiddleware = require('../middleware/authMiddleware.middleware');
const { CreatePost, updatedPost, getPost, deletePost, uploadBlogImageFile } = require('../Controllers/post.controller');
const PostRouter = express.Router() ; 

PostRouter.post("/create"  ,multerMiddleware , authMiddleware, CreatePost) ; 

/*
আমি এখানে confused হয়ে গিয়েছিলাম আমি কি এখানে multerMiddleware দিবো কি দিবো না কারণ? 

অনেক সময় তো user image update নাও করতে চাইবে তাহলে সে যদি image নাইই দেয় তাহলে কি এরর আসবে? 

উত্তর -- আসবে না 
multerMiddleware .single("image") নামে কোন  image file  না পেলে তখন req.file = undefined পাঠাবে এখানে কোন error পাঠাবে না। 
*/
PostRouter.put("/updatepost/:postId/:userId" ,multerMiddleware,authMiddleware , updatedPost);

PostRouter.get("/getposts", getPost);
PostRouter.delete("/deletepost/:postId/:userId" , authMiddleware , deletePost);

PostRouter.post("/UploadPostImage", authMiddleware, uploadBlogImageFile); 

module.exports = PostRouter 