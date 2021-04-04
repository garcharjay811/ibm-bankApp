const path = require("path");
const cors = require('cors');
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport 	= require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require("jsonwebtoken");
const url = require("url");
require('./controller/user');

const appRoutes = require("./routes/routes");

// const eventsRoutes = require("./routes/events");
// const userRoutes = require("./routes/user");

const app = express();
app.use(cors());
app.options('*', cors());

mongoose
  .connect(
    "mongodb+srv://jay_garchar:DMaKZqVfHc932Lpy@cluster0.qfs3b.mongodb.net/bankAppDatabase?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to database!");
  })
  .catch((err) => {
    console.log(err);
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/user", appRoutes);

app.use(passport.initialize());

app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}) 
);

app.get('/auth/google/callback', function(req, res, next){
  passport.authenticate('google', function(err, user, info){
    fetchedUser = user
    const token = jwt.sign(
      { email: fetchedUser.email, firstName: fetchedUser.firstName, lastName: fetchedUser.lastName, userId: fetchedUser._id },
      "jay_garchar",
      { expiresIn: "1h" }
    );
    let responseData = {
      'token': token,
      'userId': fetchedUser._id,
      'expiresIn': 3600
    }
    responseData = JSON.stringify(responseData)
    res.cookie('responseData', responseData);
      console.log(url.format({
        pathname: 'http://localhost:4200/auth/oauth',
        query: {
          'token': responseData
        }   
      }));
      console.log("id: " + fetchedUser._id);
      res.redirect(url.format({
        pathname: 'http://localhost:4200/auth/oauth',
        query: {
          'token':responseData 
        }     
      }));
    })(req, res, next);
});

module.exports = app;