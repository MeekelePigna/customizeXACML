const express = require("express");
const router = express.Router();

// Authentication service
const authService = require("../services/authClassic");
const authServiceGoogle = require("../services/authGoogle");
const authServiceGithub = require("../services/authGithub");

router.post("/classicLogin", authService.postLogin);
router.post("/authorizeUser", authService.postAuthorize);
router.get("/googleLogin", authServiceGoogle.postLogin);
router.post("/callbackGoogle", authServiceGoogle.postCallback);
router.get("/githubLogin", authServiceGithub.postLogin);

//EXPORT
module.exports = router;