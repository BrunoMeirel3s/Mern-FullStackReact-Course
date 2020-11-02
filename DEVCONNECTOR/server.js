//express instance
const express = require("express");

//app receive all the express methods
const app = express();

//on this command we're sending to frontend the response "API Running" on the path '/'
app.get("/", (req, res) => {
  res.send("API Running");
});

//this is the port where our serve is going to send data and listen
const PORT = process.env.PORT || 5000;

//initialize our server listenning on port 5000
app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
