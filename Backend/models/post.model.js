const mongoose = require('mongoose') ; 

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    imagePoster: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    imageContent: [
      {
        type: String,
      },
    ],
    numberOfLikes: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    views: {
      type: Number,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
); ; 

const postModel = mongoose.model("Posts" , PostSchema) ; 
module.exports = postModel ; 