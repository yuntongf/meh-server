const mongoose = require("mongoose");
// const {UserSchema} = require('./user');
// const { UserToPostsSchema } = require("./tag");
// const { CommentSchema } = require("./comment");
const { ObjectId } = require("bson");

const UserToPostsSchema = 
  new mongoose.Schema({
    id: {type: ObjectId},
    posts: {type: [ObjectId], default: []}
  });

const UserToPostsModel = mongoose.model('UserToPosts', UserToPostsSchema);
exports.UserToPosts = UserToPostsModel;
exports.UserToPostsSchema = UserToPostsSchema;