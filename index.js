'use strict';

require("dotenv").config();

// Start up DB Server
const server = require("./src/server.js");
const mongoose = require('mongoose');

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};
mongoose
  .connect(process.env.MONGODB_URI, options)
  .then(()=>{
    server.start(process.env.PORT);
  })
  .catch((e) => {
    console.log("__CONNECTION ERROR__", e.message);
  });









