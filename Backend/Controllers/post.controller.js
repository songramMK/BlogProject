const { uploadFileToCloudinary } = require('../config/cloudinary.config');
const postModel = require('../models/post.model');
const { errorMessage } = require('../utils/error.utils');
const response = require('../utils/response.utils');
const CreatePost = async(req,res,next)=>{
    try{
        if(!req.body.title || !req.body.content || !req.file){
            return next(response(res,400 , "Please Provide All Required Field")) ; 
        }
        const slug = req.body.title.split(" ").join("").toLowerCase().replace(/[^a-zA-Z0-9-]/g , "") ; 
        let UploadPosterImage = ""; 
        
        if(req.file){
            UploadPosterImage = await uploadFileToCloudinary(req.file) ; 
        }
        const newPost = new postModel({
            ...req.body , 
            imagePoster : UploadPosterImage?.secure_url,
            slug , 
            userId : req.user.userId
        })
        const savePost = await newPost.save() ; 
        return response(res , 201 , "Post Created Successfully" , newPost);
    }catch(error){
        next(error) ; 
    }
}

const getPost = async(req, res, next )=>{
    try{
        const startIndex = parseInt(req.query.startIndex) || 0 ; 
        const limit = parseInt(req.query.limit) || 9 ; 

        const sortDirection =  req.query.sort === "asc" ? 1 : -1 ; 

        const posts = await postModel.find({
            ...(req.query.postId && {_id : req.query.postId}) , 
            ...(req.query.userId && {userId : req.query.userId}) , 
            ...(req.query.category && {category : req.query.category}) ,
            ...(req.query.slug && {slug : req.query.slug}),
            ...(req.query.searchTerm && {
                $or : [
                    {title : {$regex : req.query.searchTerm, $options : 'i'}}, 
                    {content : {$regex : req.query.searchTerm , $options : 'i'}}
                ]
            }),
        })
        .sort({updatedAt : sortDirection})
        .skip(startIndex)
        .limit(limit)

        const totalPost = await postModel.countDocuments(); 
        const now = new Date() ; 
        const oneMonthAgo = new Date(
            now.getFullYear() , 
            now.getMonth() - 1 , 
            now.getDate() 
        )

        const lastMonthPosts = await postModel.countDocuments({
            createdAt : {$gte : oneMonthAgo}
        })

        return response(res, 200 , "Result Here" , {posts,totalPost,lastMonthPosts})
    }catch(error){
        next(error) ;
    }
}

const deletePost = async(req,res,next)=>{
    try{
        if(req.user.userId !== req.params.userId ){
            return next(response(res, 403 , "You Are Not Authorized to delete this post")) ; 
        }
        const postId = req.params.postId ; 
        await postModel.findByIdAndDelete(postId) ; 
        return response(res, 200 , "POST Has BEEN DELETED SUCCESSFULLY...") ; 

    }catch(error){
        next(error); 
    }
}

const updatedPost = async(req,res,next)=>{
    try{
        if(req.user.userId !== req.params.userId){
            return next(response(res, 403 , "You Are Not Authorized to Updated This post")) ; 
        }
        const updatedPost = {} ; 

        if(req.body.title){
            if(req.body.title.length <= 2 ){
                return next(response(res, 400 , "Title Length must be greater than atleast 2 ")) ; 
            }
            updatedPost.title = req.body.title ; 
        }
        if(req.body.category){
            updatedPost.category = req.body.category; 
        }
        if(req.body.content){
            updatedPost.content = req.body.content;
        }
        if(req.file){
            const uploadUpdateImageTitle = await uploadFileToCloudinary(req.file);
            if(uploadBlogImageFile){
                updatedPost.imagePoster = uploadUpdateImageTitle?.secure_url;
            }
        }

        const UpdatedPost = await postModel.findByIdAndUpdate(req.params.postId , {
            $set : updatedPost 
        } , {new : true} )

        return response(res, 200 , "POST UPDATED SUCCESSFULLY..." , UpdatedPost) ; 


    }catch(error){
        next(error) ; 
    }
}

const uploadBlogImageFile = async(req,res,next)=>{
    try{
        const file = req.file ; 
        
        if(file){
            const UploadFile = await uploadFileToCloudinary(file) ; 
            if(UploadFile){
                return response(res, 200, "Uploaded", {
                  secure_url: UploadFile.secure_url,
                });
            }
        }else{
            return response(res,400, "PLEASE SEND FILE" ) ; 
        }
    }catch(error){
        next(error) ; 
    }
}
module.exports = {uploadBlogImageFile , CreatePost , updatedPost , getPost , deletePost} ; 