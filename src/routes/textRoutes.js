const express = require("express");
const { getResponse, addTrainingData } = require("../controller/networkController");

const router = express.Router();

router.post("/ask", getResponse);
router.post("/train", addTrainingData);

module.exports = router;
