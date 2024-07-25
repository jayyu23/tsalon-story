import express from "express";
// import tsalonmessageController from "../controllers/tsalonmessage.controller";
import tsalonuserController from "../controllers/tsalonuser.controller";

const router = express.Router();

router.route("/api/signin").post(tsalonuserController.signin);

router.route("/api/getNonce").post(tsalonuserController.getNonce);

router
  .route("/api/auth")
  .post(
    tsalonuserController.requireSignin,
    tsalonuserController.hasAuthorization,
    tsalonuserController.passedAuthentication
  );
router.route("/api/userHolder").post(
    tsalonuserController.requireSignin,
    tsalonuserController.hasAuthorization,
    // tsalonuserController.userIsHolder
);

// router.route("/api/profile/:username").get(tsalonuserController.getCollection)
// router.route("/api/getGreenTokens").post(tsalonuserController.requireSignin, tsalonuserController.hasAuthorization, tsalonuserController.getGreenTokens);
// router.route("/api/messages/:username").post(tsalonuserController.requireSignin, tsalonuserController.hasAuthorization,
//   tsalonmessageController.getMessages)

// router.param("username", tsalonuserController.getAddressFromUsername);



export default router;
