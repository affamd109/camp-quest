const express = require('express');
const router = express.Router();
const chatBot = require("../controllers/chatBot");


router.post("/chatbot", chatBot.getChatbotResponse);

module.exports = router;
