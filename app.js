//intialize packages
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


//initialize DB name
mongoose.connect('mongodb://localhost:27017/wikiDB');

const articleSchema = {
  title: String,
  content: String
}

const Article = mongoose.model("Article", articleSchema);

app.get("/", function(req, res) {
  res.send("Hello mom c:");
});

////////Requests Targeting a All Article//////////////////

app.route("/articles")
  .get(function(req, res) {
    Article.find(function(err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        console.log(err);
      }
    });
  })
  .post(function(req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function(err) {
      if (!err) {
        res.send("Successfully added a new article!");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (!err) {
        res.send("Successfully deleted articles");
      } else {
        res.send("err");
      }
    });
  });

////////Requests Targeting a Specific Article//////////////////

app.route("/articles/:articleTitle")
  .get(function(req, res) {
    Article.findOne({
      title: req.params.articleTitle
    }, function(err, foundArticle) {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        console.log("No article found");
      }
    });
  })
  .put(function(req, res) {
    Article.replaceOne({
        title: req.params.articleTitle
      }, {
        title: req.body.title,
        content: req.body.content
      },
      function(err) {
        if (!err) {
          res.send("Successfully updated the article!");
        }
      }
    );
  })
  .patch(function(req, res) {
    Article.updateOne({
        title: req.params.articleTitle
      },
      req.body,
      function(err) {
        if (!err) {
          res.send("Successfully updated article.");
        } else {
          res.send(err)
        }
      }
    )
  });


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
