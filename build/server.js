//___________________
//Dependencies
//___________________
import express from "express";
import methodOverride from "method-override";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
var app = express();
var db = mongoose.connection;
//___________________
//Port
//___________________
// Allow use of Heroku's port or your own local port, depending on the environment
var PORT = process.env.PORT || 3003;
//___________________
//Database
//___________________
// How to connect to the database either via heroku or locally
var MONGODB_URI = process.env.MONGODB_URI;
// Connect to Mongo &
// Fix Depreciation Warnings from Mongoose
// May or may not need these depending on your Mongoose version
mongoose.connect(MONGODB_URI);
// Error / success
db.on("error", function (err) { return console.log(err.message + " is Mongod not running?"); });
db.on("connected", function () { return console.log("mongo connected: ", MONGODB_URI); });
db.on("disconnected", function () { return console.log("mongo disconnected"); });
//___________________
//Middleware
//___________________
//use public folder for static assets
app.use(express.static("public"));
// populates req.body with parsed info from forms - if no data from forms will return an empty object {}
app.use(express.urlencoded({ extended: false })); // extended: false - does not allow nested objects in query strings
app.use(express.json()); // returns middleware that only parses JSON - may or may not need it depending on your project
//use method override
app.use(methodOverride("_method")); // allow POST, PUT and DELETE from a form
//___________________
// Routes
//___________________
//localhost:3000
app.get("/", function (req, res) {
    res.send("Hello World!");
});
//___________________
//Listener
//___________________
app.listen(PORT, function () { return console.log("Listening on port:", PORT); });
