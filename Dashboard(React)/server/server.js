const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const yahooFinance = require("yahoo-finance2").default;

yahooFinance.suppressNotices(["yahooSurvey"]);

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json()); // for parsing JSON bodies in POST requests

// --- MongoDB Connect ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// --- Routes ---
// Auth routes (login/signup)
app.use("/api/auth", require("./routes/auth"));

// Health check
app.get("/check", (req, res) => {
  res.send("✅ Correct backend is running");
});

// Default route
app.get("/", (req, res) => {
  res.send("📈 Yahoo Finance Proxy is running");
});

// Single stock quote
app.get("/api/quote", async (req, res) => {
  const symbol = req.query.symbol;
  if (!symbol) return res.status(400).json({ error: "Missing symbol" });

  try {
    const result = await yahooFinance.quote(symbol);
    res.json({
      ...result,
      regularMarketTime: result.regularMarketTime || Math.floor(Date.now() / 1000),
    });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: "Yahoo Finance quote failed" });
  }
});

// Multiple stock quotes
app.get("/api/quotes", async (req, res) => {
  const symbols = req.query.symbols?.split(",") || [];
  if (!symbols.length) return res.status(400).json({ error: "Missing symbols query" });

  try {
    const results = await Promise.all(
      symbols.map(async (symbol) => {
        const result = await yahooFinance.quote(symbol);
        return {
          symbol,
          ...result,
          regularMarketTime: result.regularMarketTime || Math.floor(Date.now() / 1000),
        };
      })
    );
    res.json(results);
  } catch (err) {
    console.error("Bulk quote fetch failed:", err.message);
    res.status(500).json({ error: "Yahoo Finance bulk fetch failed" });
  }
});

// --- Start Server ---
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Proxy + Auth API running at http://localhost:${PORT}`);
});
