const express = require("express");
const { chatdata } = require("../controller/transformer");
const router = express.Router();

router.post("/generate", chatdata);

module.exports = router;
