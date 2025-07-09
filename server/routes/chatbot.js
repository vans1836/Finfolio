// server/routes/chatbot.js
const express = require("express");
const router = express.Router();
require("dotenv").config();

router.post("/", async (req, res) => {
  const { message } = req.body;
  console.log("Received chatbot message:", req.body);

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Valid message is required" });
  }

  try {
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: "You are a helpful assistant for a stock app called FinFolio." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await groqResponse.json();
    const reply = data.choices?.[0]?.message?.content;

    console.log("LLaMA 3 (Groq) reply:", reply);
    res.status(200).json({ reply });
  } catch (err) {
    console.error("Groq API Error:", err);
    res.status(500).json({ error: "Groq failed to respond" });
  }
});

module.exports = router;
