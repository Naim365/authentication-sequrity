//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/authDB", {useNewUrlParser: true, useUnifiedTopology: true});


const authSchema = new mongoose.Schema( {
  email: String,
  password: String
});


authSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });


const Auth = mongoose.model("Auth", authSchema);

app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});


app.post("/register", function(req, res){
    

    const newAuth = new Auth({
        email: req.body.username,
        password: req.body.password
    });
    newAuth.save(function(err){
        if (err){
            console.log(err);
        } else{
            res.render("secrets");
        }
    });
});


app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    Auth.findOne({email:username}, function(err, foundAuth){

        if (err){
            console.log(err);
        } else{
            if (foundAuth) {
                if(foundAuth.password===password){
                    res.render("secrets");
                }
            }
            
        }
    });

});





app.listen(3000, function() {
    console.log("Server started on port 3000");
  });