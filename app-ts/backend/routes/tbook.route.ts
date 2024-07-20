// import express from "express";
// import {
//   update,
//   read,
//   deleteDraft,
//   list,
//   submitForReview,
//   publicList,
//   publicRead,
//   getFromUsername,
//   getFromTBSN
// } from "../controllers/tbook.controller";
// import { requireSignin, hasAuthorization } from "../controllers/tsalonuser.controller";
// import { getPrice } from "../controllers/blockchain.controller";

// const router = express.Router();

// router.route("/api/drafts").post(requireSignin, update);

// router
//   .route("/api/drafts/:tbsn")
//   .post(requireSignin, hasAuthorization, read)
//   .delete(deleteDraft);

// router.route("/api/:username/drafts").post(requireSignin, hasAuthorization, list);

// router.route("/api/submitReview").post(requireSignin, submitForReview);

// router.route("/api/publications").get(publicList);

// router.route("/api/publication/:tbsn").get(publicRead);

// router.route("/api/price/:tbsn").get(getPrice);

// router.param("username", getFromUsername);
// router.param("tbsn", getFromTBSN);

// export default router;