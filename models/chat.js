const mongoose = require("mongoose");
// const {UserSchema} = require('./user');
// const { TagSchema } = require("./tag");
// const { CommentSchema } = require("./comment");
const { ObjectID, ObjectId } = require("bson");

const ChatSchema = 
  new mongoose.Schema({
    users: {type: [ObjectId]},
    messages: {
      type: [{
        sender: {type: ObjectId},
        content: {type: String}
      }]}
  });

const ChatModel = mongoose.model('Chat', ChatSchema);
exports.Chat = ChatModel;
exports.ChatSchema = ChatSchema;

