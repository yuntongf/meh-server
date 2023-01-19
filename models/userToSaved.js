const mongoose = require("mongoose");
// const {UserSchema} = require('./user');
// const { UserToSavedSchema } = require("./tag");
// const { CommentSchema } = require("./comment");
const { ObjectId } = require("bson");

const UserToSavedSchema = 
  new mongoose.Schema({
    id: {type: ObjectId},
    saved: {type: [ObjectId], default: []}
  });

const UserToSavedModel = mongoose.model('UserToSaved', UserToSavedSchema);
exports.UserToSaved = UserToSavedModel;
exports.UserToSavedSchema = UserToSavedSchema;