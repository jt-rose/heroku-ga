//___________________
//Dependencies
//___________________
import express from "express";
import methodOverride from "method-override";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { router as authRouter } from "./controllers/auth";
import { router as userRouter } from "./controllers/user";

const main = async () => {
  await dotenv.config();
  const app = express();
  const db = mongoose.connection;
  //___________________
  //Port
  //___________________
  // Allow use of Heroku's port or your own local port, depending on the environment
  const PORT = process.env.PORT || 3003;

  //___________________
  //Database
  //___________________
  // How to connect to the database either via heroku or locally
  const MONGODB_URI = process.env.MONGODB_URI;

  // Connect to Mongo
  mongoose.connect(MONGODB_URI as string);

  // Error / success
  db.on("error", (err) => console.log(err.message + " is Mongod not running?"));
  db.on("connected", () => console.log("mongo connected: ", MONGODB_URI));
  db.on("disconnected", () => console.log("mongo disconnected"));

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
  app.get("/", (_req, res) => {
    res.send("Hello World!");
  });

  app.use("/auth", authRouter);
  app.use("/user", userRouter);

  //___________________
  //Listener
  //___________________
  app.listen(PORT, () => console.log("Listening on port:", PORT));
};

main().catch((err) => console.log(err));
