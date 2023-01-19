const mongoose = require("mongoose");
// const {UserSchema} = require('./user');
// const { TagSchema } = require("./tag");
// const { CommentSchema } = require("./comment");
const { ObjectId } = require("bson");

const TagSchema = 
  new mongoose.Schema({
    tag: {type: String},
    posts: {type: [ObjectId]}
  });

const TagModel = mongoose.model('Tag', TagSchema);
exports.Tag = TagModel;
exports.TagSchema = TagSchema;
