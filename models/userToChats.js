const mongoose = require("mongoose");
// const {UserSchema} = require('./user');
// const { UserToChatsSchema } = require("./tag");
// const { CommentSchema } = require("./comment");
const { ObjectId } = require("bson");

const UserToChatsSchema = 
  new mongoose.Schema({
    id: {type: ObjectId},
    chats: {type: [ObjectId], default: []}
  });

const UserToChatsModel = mongoose.model('UserToChats', UserToChatsSchema);
exports.UserToChats = UserToChatsModel;
exports.UserToChatsSchema = UserToChatsSchema;