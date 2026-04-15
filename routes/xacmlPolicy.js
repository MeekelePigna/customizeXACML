const express = require("express");
const router = express.Router();

// Authentication service
const tryitService = require("../services/pdp");

router.post("/pdp", tryitService.postTryIt);

//EXPORT
module.exports = router;