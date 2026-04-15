const express = require("express");
const router = express.Router();

// Authentication service
const e2eService = require("../services/e2e");

router.post("/e2e", e2eService.postE2E);

//EXPORT
module.exports = router;