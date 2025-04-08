// routes/profile.js
const express = require("express");
const router = express.Router();
const { createProfile, extractTags } = require("../services/openaiService.cjs");

// Define your routes on this router
router.post("/create-profile", createProfile);

router.post("/find-tags", extractTags);
// Export the router (NOT an object with { createProfile })
module.exports = router;
