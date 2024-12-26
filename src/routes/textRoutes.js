const express = require("express");
const { generateText } = require("../controller/textController");
const validateInput = require("../middlewares/validateInput");

const router = express.Router();

// POST /api/text/generate
router.post("/generate", validateInput, generateText);

module.exports = router;
