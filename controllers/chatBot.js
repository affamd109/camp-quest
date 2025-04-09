const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

module.exports.getChatbotResponse = async (req, res) => {
  const { message } = req.body;
  
  try {
    // Get the model (gemini-pro for text)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Format the prompt with proper message structure
    const prompt = `You are the camping assistant of a website inspired from Yelp where there are campgrounds and a system of  dynamic reviews is available . Answer the following user's message :
    User question: ${message}
    Guidelines:
    - Be helpful and friendly
    - Keep responses under 2 sentences`


    // Generate content
    const result = await model.generateContent(prompt); // Just pass the string directly
    const response = await result.response;
    const text = response.text();
    
    res.json({ reply: text });
  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ 
      error: "AI is currently unavailable. Try again later!",
      details: err.message 
    });
  }
};