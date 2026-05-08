const mongoose =require('mongoose') ; 
const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Posts",
    },
    content : {
        type : String ,
        required : true 
    }, 
    numberOfLikes : {
        type : Number , 
        default : 0 
    }, 
    likes : [
        {
            type: mongoose.Schema.Types.ObjectId , 
            ref : "User"
        }
    ]
  },
  { timestamps : true },
); ; 
const commentModels = mongoose.model("comments", commentSchema); ; 
module.exports = commentModels;