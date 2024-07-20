import express from "express";
import tbookvoteController from "../controllers/tbookvote.controller";
import auth from "../controllers/tsalonuser.controller";

const router = express.Router();

router
  .route("/api/getReview")
  .post(
    auth.requireSignin,
    auth.hasAuthorization,
    tbookvoteController.getReview
  );

// Submit the votes
router.route("/api/submitVote").post(auth.requireSignin, auth.hasAuthorization, tbookvoteController.submitVote)

export default router;