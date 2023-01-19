const mongoose = require("mongoose");
// const {UserSchema} = require('./user');
// const { TagSchema } = require("./tag");
// const { AuthSchema } = require("./comment");
const { ObjectId } = require("bson");

const AuthSchema = 
  new mongoose.Schema({
    _id: {type: ObjectId},
    password: {type: String}
  });

const AuthModel = mongoose.model('Auth', AuthSchema);
exports.Auth = AuthModel;
exports.AuthSchema = AuthSchema;
