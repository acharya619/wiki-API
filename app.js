//include required modules
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const _ = require("lodash");
const app = express();
const dbURI = "mongodb://localhost:27017/wikiDB";
//connect to database
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true});
//set and use 
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded(
    { extended: true }
));
app.use(express.static("public"));
//main code

//create schemas
const articleSchema = {
    title: String,
    content: String
};

//create models
const Article = mongoose.model("Article", articleSchema);

//routes
app.route("/articles")
    .get(function (req, res){
        Article.find({}, function (err, artileList){
            if(!err){
                res.send(artileList);
            }else console.log(err);
        })
    })
    .post(function(req, res){
        Article.findOne({title: req.body.title}, function (err, exist){
            if(!err){
                if(!exist){
                    const article = new Article({
                        title: req.body.title,
                        content: req.body.content
                    });
                    article.save(function(err){
                        if(err){
                            res.send(err);
                        }else res.send("Successfully added.");
                    });
                }else res.send("Article already exists");
            }else res.send(err);
        });
    })
    .delete(function (req, res){
        Article.deleteMany(function (err){
            if(err){
                res.send(err);
            }else res.send("Successfully delated all records.");
        });
    });

app.route("/articles/:articletitle")
    .get(function(req, res){
        Article.findOne({title: req.params.articletitle}, function(err, result){
            if (!err){
                if(result)
                    res.send(result);
                else res.send("No result found");
            }else res.send(err);
        });
    })
    .put(function (req, res){
        Article.updateOne(
            {title: req.params.articletitle}, 
            {title: req.body.title, content: req.body.content},
            {overwrite: true},
            function (err){
                if(err) res.send(err);
                else res.send("Successfully updated.");
            }
        );
    })
    .patch(function (req, res){
        Article.updateOne(
            {title: req.params.articletitle},
            {$set: req.body},
            function(err){
                if (err){
                    res.send(err)
                }else res.send("Successfully updated");
            })
    })
    .delete(function (req, res){
        Article.deleteOne({title: req.params.articletitle}, function(err, exist){
            if(err) res.send(err);
            else{
                if (exist){
                    res.send("Successfully deleted")
                } else res.send("Not exists");
            } 
        });
    });
//server listener
let port = process.env.PORT;
if(port==null) port = 3000; 
app.listen(port, function (){
    console.log("Server started listening on port no "+port);
});