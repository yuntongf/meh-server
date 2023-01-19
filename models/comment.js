const mongoose = require("mongoose");
// const {UserSchema} = require('./user');
// const { TagSchema } = require("./tag");
// const { CommentSchema } = require("./comment");
const { ObjectId } = require("bson");

const CommentSchema = 
  new mongoose.Schema({
    author: {type: ObjectId},
    content: {type: String},
    likes: {
      type: Number,
      default: 0
    }
  });

const CommentModel = mongoose.model('Comment', CommentSchema);
exports.Comments = CommentModel;
exports.CommentSchema = CommentSchema;
