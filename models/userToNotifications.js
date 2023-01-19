const mongoose = require("mongoose");
// const {UserSchema} = require('./user');
// const { UserToNotificationsSchema } = require("./tag");
// const { CommentSchema } = require("./comment");
const { ObjectId } = require("bson");

const UserToNotificationsSchema = 
  new mongoose.Schema({
    tag: {type: String},
    posts: {type: [ObjectId], default: []}
  });

const UserToNotificationsModel = mongoose.model('UserToNotifications', UserToNotificationsSchema);
exports.UserToNotifications = UserToNotificationsModel;
exports.UserToNotificationsSchema = UserToNotificationsSchema;
