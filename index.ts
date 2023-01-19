const {Post} = require("./models/post");
const {Comments} = require('./models/comment');
const { ObjectId } = require("bson");
const express = require("express");
const jwt = require("jsonwebtoken");
const config = require("config");
var bodyParser = require('body-parser');
const app = express();
const auth = require("./middleware/auth")
const {User} = require("./models/user");
const {Auth} = require('./models/auth');
const {Tag} = require('./models/tag');
const {Chat} = require('./models/chat');
const {UserToFollowers} = require('./models/userToFollowers')
const {UserToFollowing} = require('./models/userToFollowing')
const {UserToPosts} = require('./models/userToPosts');
const {UserToLiked} = require('./models/userToLiked');
const {UserToSaved} = require('./models/userToSaved');
const {UserToChats} = require('./models/userToChats');
var jsonParser = bodyParser.json();
require("./setup/cors")(app);
require("./setup/db")();

// auth

app.get("/api/auth/user", async (req, res) => {
  const user1 = new User({
    handle: "agosto",
    username: "August Fu",
    status: "testing"
  });
  const user = await user1.save();
  res.send(user);
});

app.post("/api/register", jsonParser, async (req, res) => {
  let user = await User.findOne({handle: req.body.handle});
  if (user) return res.status(401).send("Handle already exists")
  const newUser = new User({
    username : req.body.username,
    handle: req.body.handle,
    status: req.body.status,
    pic: req.body.pic
  });
  user = await newUser.save();

  // use newly created user id to create an id-password pair in Auth
  const newAuth = new Auth({
    _id: user._id,
    password: req.body.password
  })
  await newAuth.save();

  const newUserToPosts = new UserToPosts({
    _id: user._id,
    posts: []
  })
  await newUserToPosts.save();

  const newUserToFollowing = new UserToFollowing({
    _id: user._id,
    following: []
  })
  await newUserToFollowing.save();

  const newUserToLiked = new UserToLiked({
    _id: user._id,
    liked: []
  })
  await newUserToLiked.save();

  const newUserToSaved = new UserToSaved({
    _id: user._id,
    saved: []
  })
  await newUserToSaved.save();

  const newUserToChats = new UserToChats({
    _id: user._id,
    chats: []
  })
  await newUserToChats.save();

  const token = jwt.sign(user.toJSON(), "jwtPrivateKey");
  res
  .header('x-token', token)
  .header("access-control-expose-headers", "x-token")
  .send(newUser);
})

app.post("/api/login", jsonParser, async (req, res) => {
  let user = await User.findOne({handle:req.body.handle});
  if (!user) return res.status(400).send("Invalid username or password.") 
  else {
    const auth = await Auth.findById(user._id);
    if (auth.password !== req.body.password) return res.status(400).send("Invalid username or password.")
  }
  // remember to CHANGE jwt key here!!!!!
  const token = jwt.sign(user.toJSON(), "jwtPrivateKey");
  res.send(token);
})

//user
app.get("/api/user/:id", jsonParser, async (req, res) => {
  const id = req.params['id'];
  const user = await User.findById(new ObjectId(id));
  res.send(user);
});

// posts

app.get("/api/posts", async (req, res) => {
    let posts = await Post.find();
    res.send(posts.reverse());
});

app.post('/api/tag', jsonParser, async (req, res) => {
  let tag = await Tag.findOne({tag: req.body.tag});
  if (tag) {
    tag.posts = [...tag.posts, req.body.post_id];
    Tag.update({tag: req.body.tag}, {$set: { posts: tag.posts }}, {upsert: true});
  } else {
    const newTag = new Tag({
      tag: req.body.tag,
      posts: [req.body.post_id]
    });
    Tag.save(newTag);
  }
})

app.post('/api/post', jsonParser, async (req, res) => {
  const newPost = new Post({
    author: req.body.author,
    content: req.body.content,
    tags: req.body.tags,
    comments: [],
    likes: 0,
    saved: 0,
    remehs: 0
  });
  const postReturned = await newPost.save();

  // update userToPosts
    const userToPost = await UserToPosts.findById(req.body.author);
    userToPost.posts = [...userToPost.posts, postReturned._id];
    await userToPost.save();
  res.send(postReturned);
})

app.post('/api/post/comment/:id', jsonParser, async (req, res) => {
  const postId = req.params['id'];
  const post = await Post.findById(postId);
  const comment = new Comments({
    author: req.body.author,
    content: req.body.comment,
    likes: 0
  });
  const newComment = await comment.save();
  post.comments = [...post.comments, newComment._id];
  post.save();
  res.send(newComment);
})

app.get('/api/post/:id', async (req, res) => {
  const id = req.params['id'];
  const post =  await Post.findById(id);
  res.send(post);
})

app.get('/api/post/comments/:id', async (req, res) => {
  const id = req.params['id'];
  const post = await Post.findById(id);
  const comments = post.comments;
  Promise.all(comments.map(async (commentId) => await Comments.findById(commentId)))
    .then((comments) => res.send(comments));      
})


// profile
app.get('/api/user/liked/:id', async (req, res) => {
  const id = req.params['id'];
  const userToLiked = await UserToLiked.findById(id);
  res.send(userToLiked.liked);
});

app.post('/api/profile/edit', jsonParser, async (req, res) => {
  const user = await User.findById(req.body.userId);
  user.username = req.body.username;
  user.handle = req.body.handle;
  user.status = req.body.status;
  await user.save();
  const token = jwt.sign(user.toJSON(), "jwtPrivateKey");
  res
  .header('x-token', token)
  .header("access-control-expose-headers", "x-token")
  .send(user);
})

app.get('/api/user/liked/posts/:id', async (req, res) => {
  const id = req.params['id'];
  const userToLiked = await UserToLiked.findById(id);
  Promise.all(userToLiked.liked.map(async (postId)=> await Post.findById(postId))).then((posts) => res.send(posts));   
});

app.get('/api/user/saved/posts/:id', async (req, res) => {
  const id = req.params['id'];
  const userToSaved = await UserToSaved.findById(id);
  Promise.all(userToSaved.saved.map(async (postId)=> await Post.findById(postId))).then((posts) => res.send(posts));   
});

app.get('/api/user/saved/:id', async (req, res) => {
  const id = req.params['id'];
  const userToSaved = await UserToSaved.findById(id);
  res.send(userToSaved.saved);
});

app.get('/api/user/following/:id', async (req, res) => {
  const id = req.params['id'];
  const userToFollowing = await UserToFollowing.findById(id);
  res.send(userToFollowing.following);
});

app.get("/api/:id/posts", async (req, res) => {
    const id = req.params['id'];
    const userToPosts = await UserToPosts.findById(id);
    Promise.all(userToPosts.posts.map(async (postId)=> await Post.findById(postId))).then((posts) => res.send(posts));      
});




// message
app.get('/api/chats/:id', async (req, res) => {
  const id = req.params['id'];
  const userToChats = await UserToChats.findById(id);
  res.send(userToChats.chats);
})

app.get('/api/chats/messages/:id', async (req, res) => {
  const id = req.params['id'];
  const chat = await Chat.findById(id);
  
  res.send(chat);
})

app.post('/api/chat/messages', jsonParser, async (req, res) => {
  const chatExisting = await Chat.findOne({users: [req.body.receiverId, req.body.senderId]});
  if (chatExisting) res.send(chatExisting);
  else{
    const newChat = new Chat({
      users: [req.body.receiverId, req.body.senderId],
      messages: []
    })
    const chat = await newChat.save();

    // add new chat to user's chats
    const userToChats = await UserToChats.findById(req.body.senderId);
    userToChats.chats = [...userToChats.chats, chat._id];

    res.send(chat);    
  }
})
// get profiles for users and send back 
app.post('/api/chat/profiles', jsonParser, async (req, res) => {
  Promise.all(req.body.users.map(async (userId)=> await User.findById(userId))).then((users) => 
    res.send(users));   
})

app.post('/api/chat/send', jsonParser, async (req, res) => {
  const chat = await Chat.findById(req.body.chatId);

  const message = {
    sender: req.body.senderId,
    content: req.body.content
  }
  chat.messages = [...chat.messages, message];
  await chat.save();
  console.log(chat);
  res.send(chat);
})


// social 
app.post('/api/post/like/:id', jsonParser, async (req, res) => {
  const id = req.params['id'];
  const post =  await Post.findById(id);
  post.likes = req.body.likes;
  await post.save();

  // update userToSaved
  const userToLiked = await UserToLiked.findById(new ObjectId(req.body.user));
  userToLiked.liked = [id, ...(userToLiked.liked || [])];
  userToLiked.save();
});

app.post('/api/post/unlike/:id', jsonParser, async (req, res) => {
  const id = req.params['id'];
  const post =  await Post.findById(id);
  post.likes = req.body.likes;
  await post.save();

  // update userToSaved
  const userToLiked = await UserToLiked.findById(new ObjectId(req.body.user));
  userToLiked.liked = userToLiked.liked.filter(l => l === id);
  userToLiked.save();
});

app.post('/api/post/save/:id', jsonParser, async (req, res) => {
  const id = req.params['id'];
  const post =  await Post.findById(id);
  post.saved = req.body.saves;
  await post.save();

  // update userToLiked
  const userToSaved = await UserToSaved.findById(new ObjectId(req.body.user));
  userToSaved.saved = [id, ...(userToSaved.saved || [])];
  userToSaved.save();
});

app.post('/api/post/unsave/:id', jsonParser, async (req, res) => {
  const id = req.params['id'];
  const post =  await Post.findById(id);
  post.saved = req.body.saves;
  await post.save();

  // update userToLiked
  const userToSaved = await UserToSaved.findById(new ObjectId(req.body.user));
  userToSaved.saved = userToSaved.saved.filter(s => s === id);
  userToSaved.save();
});

app.post('/api/follow', jsonParser, async (req, res) => {
  // update userToFollowers
  const userToFollowing = await UserToFollowing.findById(req.body.followerId);
  userToFollowing.following = [...userToFollowing.following, req.body.followingId];
  await userToFollowing.save();
})

app.post('/api/follow?', jsonParser, async (req, res) => {
  // get userToFollowers
  const userToFollowing = await UserToFollowing.findById(req.body.followerId);
  const [following] = userToFollowing.following.filter( f => f === req.body.followingId);
  res.send(!!following);
})

const port = process.env.PORT || 3001;
//config.get("port");
const server = app.listen(port, () =>
  console.log(`Listening on port ${port}...`)
);

module.exports = server;
