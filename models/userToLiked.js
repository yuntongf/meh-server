const mongoose = require("mongoose");
// const {UserSchema} = require('./user');
// const { UserToLikedSchema } = require("./tag");
// const { CommentSchema } = require("./comment");
const { ObjectId } = require("bson");

const UserToLikedSchema = 
  new mongoose.Schema({
    _id: {type: ObjectId},
    liked: {type: [ObjectId], default: []}
  });

const UserToLikedModel = mongoose.model('UserToLiked', UserToLikedSchema);
exports.UserToLiked = UserToLikedModel;
exports.UserToLikedSchema = UserToLikedSchema;
