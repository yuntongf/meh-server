const mongoose = require("mongoose");
// const {UserSchema} = require('./user');
// const { TagSchema } = require("./tag");
// const { CommentSchema } = require("./comment");
const { ObjectId } = require("bson");

const UserSchema = 
  new mongoose.Schema({
    username: {
      type: String,
      trim:true
    },
    handle: {
      type: String,
      trim: true
      //unique: true
    },
    status: {
      type: String
    },
    pic:  {
      type: String,
      default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png"
    },
    followed: {
      type: Number,
      default: -1
    }
  });

const UserModel = mongoose.model('User', UserSchema);
exports.User = UserModel;
exports.UserSchema = UserSchema;



// //user
// app.get("/api/user/:loggedInId/:otherId", jsonParser, async (req, res) => {
//   const loggedInId = req.params['loggedInId'];
//   const otherId = req.params['otherId'];
//   const user = await User.findById(otherId);
  
//   // check if current user is follower of other user through userToFollowers
//   const userToFollowing = await UserToFollowing.findById(loggedInId);
//   try {
//     const [following] = userToFollowing.following.filter( f => f === otherId);
//     user.followed = !!following ? 1 : 0;
//   } catch {
//     user.followed = 1;
//   }
//   res.send(user);
// });
