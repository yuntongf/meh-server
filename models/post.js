const mongoose = require("mongoose");
// const {UserSchema} = require('./user');
// const { TagSchema } = require("./tag");
// const { CommentSchema } = require("./comment");
const { ObjectID, ObjectId } = require("bson");

const PostSchema = 
  new mongoose.Schema({
    author: {type: ObjectId},
    content: {type: String},
    comments: {
      type: [ObjectId], 
      default: []
    },
    tags: {
      type: [String],
      default: []
    },
    likes: {
      type: Number,
      default: 0
    },
    saved: {
      type: Number,
      default: 0
    },
    remehs: {
      type: Number,
      default: 0
    },
    time: {
      type: Date,
      default: Date.now()
    }
  });

const PostModel = mongoose.model('Post', PostSchema);
exports.Post = PostModel;
exports.PostSchema = PostSchema;
