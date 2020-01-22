const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://aayush9507:aayush9507@cluster0-kvia0.mongodb.net/test?retryWrites=true&w=majority")
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
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-with, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET","POST","PATCH","DELETE","OPTIONS","PUT");

  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });

  res.status(201).json({
    message:'post added bro'
  });
});

app.get('/api/posts' , (req, res, next) => {
  const posts = [
  {
      id: 'dkxcvm3',
    title:'first post',
    content:'from server'
  },
  {
    id: 'sd344',
  title:'second post',
  content:'from server'
}
];

  res.status(200).json({
    message: 'Posts fetched success',
    posts: posts
  });

})

module.exports = app;
