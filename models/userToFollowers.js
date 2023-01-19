const mongoose = require("mongoose");
// const {UserSchema} = require('./user');
// const { UserToFollowersSchema } = require("./tag");
// const { CommentSchema } = require("./comment");
const { ObjectId } = require("bson");

const UserToFollowersSchema = 
  new mongoose.Schema({
    tag: {type: String},
    posts: {type: [ObjectId], default: []}
  });

const UserToFollowersModel = mongoose.model('UserToFollowers', UserToFollowersSchema);
exports.UserToFollowers = UserToFollowersModel;
exports.UserToFollowersSchema = UserToFollowersSchema;
