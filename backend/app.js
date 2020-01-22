const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://aayush9507:aayush9507@cluster0-kvia0.mongodb.net/node-angular?retryWrites=true&w=majority")
.then( ()=> {
  console.log('Connected to MongoDB database!!;)');
})
.catch( ()=> {
  console.log('Connection failed!!');
})


const Post = require('./models/post');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use((req, res, next) => {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS,PUT");

  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  // Saving our Post in MongoDB
  post.save();
  res.status(201).json({
    message:'post added bro'
  });
});

app.get('/api/posts' , (req, res, next) => {

  Post.find().then(documents => {
    res.status(200).json({
      message: 'Posts fetched success',
      posts: documents
    });
  });
})

app.delete("/api/posts/:id", (req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then( result => {
    console.log(result);
    res.status(200).json({message: "Post deleted"});
});
});


module.exports = app;
