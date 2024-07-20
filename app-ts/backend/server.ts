/**
 * The main server file and entry point for the TSalon application.
 * This file initializes the server, connects to MongoDB, and starts the server on the specified port.
 */

import app from "./express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import TSalonUserModel from "./models/tsalonuser.model";

/**
 * The configuration object for the server.
 * @property {number} port - The port number on which the server will listen.
 * @property {string} mongoUri - The MongoDB connection URI.
 */
require('dotenv').config({ path: __dirname + '/../../.env' });
console.log('Init - Loading environment variables from %s.', __dirname + '/../.env');

const config = {
  port: process.env.PORT || 8000,
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/",
};

// Middleware
app.use(bodyParser.json());

/**
 * Starts the server and listens on the specified port.
 */
app.listen(config.port, () => {
  console.info('Init - Server started on port %s.', config.port);
});

mongoose.Promise = global.Promise;
// console.log('Init - Connecting to MongoDB at %s.', config.mongoUri);
mongoose
  .connect(config.mongoUri)
  .then(async () => {
      console.log('Init - MongoDB Connection Success.');
      // Sync the blockchain
      // let pubs = await tbookModel.find({ stage: 'publish' }).exec();
      // blockchainController.updateFromDatabase(pubs);
  })
  .catch((error: any) => console.log(error));

// Routes
app.post('/api/users', async (req, res) => {
  try {
      const newUser = new TSalonUserModel(req.body);
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
  } catch (error: any) {
      res.status(400).json({ message: error.message });
  }
});