import app from "./express";
// import config from "../config/config.js";
import mongoose from "mongoose";
// import blockchainController from "./controllers/blockchain.controller.js"
// import tbookModel from "./models/tbook.model.js"

const config = {
  port: 8000,
  mongoUri: "mongodb://localhost:27017/tbook",
};

app.listen(config.port, () => {
  console.info("Init - Server started on port %s.", config.port);
});

mongoose.Promise = global.Promise;
mongoose
  .connect(config.mongoUri)
  .then(async () => {
    console.log("Init - MongoDB Connection Success.");
    // Sync the blockchain
    // let pubs = await tbookModel.find({ stage: "publish" }).exec();
    // blockchainController.updateFromDatabase(pubs);
  })
  .catch((error) => console.log(error));
