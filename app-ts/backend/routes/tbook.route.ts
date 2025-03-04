import express from "express";
import tbookController from "../controllers/tbook.controller";
import auth from "../controllers/tsalonuser.controller";
import blockchainController from "../controllers/blockchain.controller";
// import blockchainController from "../controllers/blockchain.controller";

const router = express.Router();

router
  .route("/api/drafts")
  .post(auth.requireSignin, tbookController.update);

router
  .route("/api/drafts/:tbsn")
  .post(auth.requireSignin, auth.hasAuthorization, tbookController.read)
  .delete(auth.requireSignin, auth.hasAuthorization, tbookController.deleteDraft);

router
  .route("/api/:username/drafts")
  .post(auth.requireSignin, auth.hasAuthorization, tbookController.list)

router
  .route("/api/submitReview")
  .post(auth.requireSignin, auth.hasAuthorization, tbookController.submitForReview);


router.route("/api/publications").get(tbookController.publicList);
router.route("/api/publication/:tbsn").get(tbookController.publicRead);

router.route("/api/nft/:tbsn").get(blockchainController.getTBookNFT);

router.route("/api/publishNFT").post(auth.requireSignin, auth.hasAuthorization, blockchainController.publishTBook);

router.route("/api/price/:tbsn").get(blockchainController.getPrice);

// router.route("/api/testPub").get(tbookController.create);

router.route("/api/registerStoryIP").post(blockchainController.registerStoryIP);

router.param("username", tbookController.getFromUsername);
router.param("tbsn", tbookController.getFromTBSN);


export default router;