//mongoose is a library for mongodb that manages relationships between data, provides schema validations and other things
const mongoose = require("mongoose");

//config allow us to use global variables, so we can call mongoURI that is defined in other document
const config = require("config");

//db receive the value 'MongoURI' that is defined in default.json, MongoURI has the connection with our cluster in mongodb.com
const db = config.get("mongoURI");

/**
 * The connectDB method will be used to establish a connection with our database, noticed that
 * we're using the async method because the process of establish a connection can take a while
 * so we've to wait until then
 */
const connectDB = async () => {
  /**
   * since we're using async we've to use try and catch because we can not be able
   * to establish the connection with the database
   */
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);

    //Exit proccess with failure
    process.exit(1);
  }
};

//export the connecDB allowing that we call it in other documents
module.exports = connectDB;
