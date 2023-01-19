const mongoose = require("mongoose");
// const {UserSchema} = require('./user');
// const { UserToFollowingSchema } = require("./tag");
// const { CommentSchema } = require("./comment");
const { ObjectId } = require("bson");

const UserToFollowingSchema = 
  new mongoose.Schema({
    tag: {type: String},
    following: {type: [ObjectId], default: []}
  });

const UserToFollowingModel = mongoose.model('UserToFollowing', UserToFollowingSchema);
exports.UserToFollowing = UserToFollowingModel;
exports.UserToFollowingSchema = UserToFollowingSchema;
