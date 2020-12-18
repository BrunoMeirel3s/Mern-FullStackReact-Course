//express instance
const express = require("express");
//instance that receive the connection method from db.js
const connectDB = require("./config/db");

//bodyparser is responsible for coping with data that we sent via post
const bodyParser = require("body-parser");

const path = require("path");

//app receive all the express methods
const app = express();

//Connecct database
connectDB();

//Init Middleware
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

//on this command we're sending to frontend the response "API Running" on the path '/'
/*app.get("/", (req, res) => {
  res.send("API Running");
});*/

//Define Routes
/**
 * Here we have the routes that can be call at the browser and the responses
 * example: the url /api/users call the response from users.js
 */
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

//Serve static assets in production

//Set static folder
app.use(express.static("client/build"));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(_dirname, "client", "build", "index.html"));
});

//this is the port where our serve is going to send data and listen
const PORT = process.env.PORT || 3000;

//initialize our server listenning on port 5000
app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
