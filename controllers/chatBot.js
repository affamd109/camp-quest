const { GoogleGenerativeAI } = require("@google/generative-ai");
const redisClient = require('../utils/redisClient');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Session timeout (24 hours)
const SESSION_TIMEOUT = 86400; 



module.exports.getChatbotResponse = async (req, res) => {
  console.log(req.body);
  const { message, sessionId } = req.body;
  
  try {
    // Get or initialize chat history from Redis
    const historyKey = `chat:${sessionId}`;
    let chatHistory = [];

    try {
      const storedHistory = await redisClient.get(historyKey);
      if (storedHistory) {
        chatHistory = JSON.parse(storedHistory);
      }
    } catch (redisErr) {
      console.error('Redis read error:', redisErr);
    }

    // Initialize model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Build conversation context with proper format
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "You are a camping assistant for a Yelp-like campground review website. Be friendly, helpful, and keep responses concise (1-2 sentences). Focus on camping-related questions but be polite with off-topic queries." }]
        },
        {
          role: "model",
          parts: [{ text: "Understood! I'm ready to help with campground recommendations, camping gear advice, and general outdoor tips. How can I assist you today?" }]
        },
        ...chatHistory
      ]
    });

    // Generate response
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = await response.text();

    // Update chat history (keep last 6 exchanges)
    const updatedHistory = [
      ...chatHistory.slice(-10), // Keep last 5 exchanges (10 messages)
      { role: "user", parts: [{ text: message }] },
      { role: "model", parts: [{ text: text }] }
    ];

    // Store in Redis with expiration
    await redisClient.setEx(historyKey, SESSION_TIMEOUT, JSON.stringify(updatedHistory));

    res.json({ reply: text });
  } catch (err) {
    console.error("Chatbot error:", err);
    res.status(500).json({ 
      error: "Our camping assistant is taking a break. Try again later!",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};