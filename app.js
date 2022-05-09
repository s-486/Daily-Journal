//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/blog", {useNewUrlParser: true});

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
const app = express();
let posts=[];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const blogSchema = new mongoose.Schema ({
  head: String,
  content: String
});

const post = mongoose.model("Post", blogSchema);

//for testing purpose
let count = 5;

//chained routing initialized but only for get
app.route("/")
  .get((req, res)=> {
    post.find((err, data)=> {
      console.log(data);
      if(err) {
        res.render(__dirname+"/views/home", {homeContent:homeStartingContent, post:err});
        count--;
        console.log(count);
      } else {
        res.render(__dirname+"/views/home", {homeContent:homeStartingContent, post:data});
        count = count + 2;
        console.log(count);
      }
    });
  });
app.get("/posts/:postID", (req, res)=> {

  post.findOne({_id:req.params.postID},(err, data)=> {
    if(err) {
      throw err;
    } else {
      res.render("post", {postTitle: data.head, postContent: data.content});
    }
  });

  // for(var i=0;i<posts.length; i++) {
  //   let requestedTitle = req.params.postName;
  //   if(_.lowerCase(requestedTitle) == _.lowerCase(posts[i].title)) {
  //     res.render("post", {postTitle:posts[i].title, postContent:posts[i].body});
  //   }
  // }
});

app.get("/about", (req, res)=> {
  res.render(__dirname+"/views/about", {about:aboutContent});
});

app.get("/contact", (req, res)=> {
  res.render(__dirname+"/views/contact", {contactContent:contactContent})
});

//Chained routing for get and post
app.route("/compose")
  .get((req, res)=> {
    res.render("compose");
  })
  .post((req, res)=> {

    var posted_post = new post({
      head: req.body.postTitle,
      content: req.body.postBody
    });
    posted_post.save();
    
    res.redirect("/");
  });







app.listen(3000, function() {
  console.log("Server started on port 3000");
});
