const express = require('express');
const router = express.Router();
const {getChatbotResponse} = require("../controllers/chatBot");


router.post("/", getChatbotResponse);

module.exports = router;
