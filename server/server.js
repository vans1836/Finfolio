const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const yahooFinance = require("yahoo-finance2").default;

const app = express();
const PORT = 3001;

// MongoDB direct connection (local)
mongoose.connect("mongodb://localhost:27017/finfolio", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error(" MongoDB connection error:", err));

yahooFinance.suppressNotices(["yahooSurvey"]);

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send(" Yahoo Finance Proxy is running");
});

app.get("/check", (req, res) => {
  res.send(" Backend is live");
});

// Single quote route (symbol excluded)
app.get("/api/quote", async (req, res) => {
  const symbol = req.query.symbol;
  if (!symbol) return res.status(400).json({ error: "Missing symbol" });

  try {
    const result = await yahooFinance.quote(symbol);
    const { symbol: _, ...rest } = result; // remove symbol
    const patched = {
      ...rest,
      regularMarketTime: result.regularMarketTime || Math.floor(Date.now() / 1000),
    };
    res.json(patched);
  } catch (err) {
    console.error(" Error fetching single quote:", err.message);
    res.status(500).json({ error: "Yahoo Finance quote failed" });
  }
});

// Multiple quotes route (symbol excluded)
app.get("/api/quotes", async (req, res) => {
  const symbols = req.query.symbols?.split(",") || [];
  if (!symbols.length) {
    return res.status(400).json({ error: "Missing symbols query" });
  }

  try {
    const results = await Promise.all(
      symbols.map(async (symbol) => {
        const result = await yahooFinance.quote(symbol);
        const { symbol: _, ...rest } = result; // remove symbol
        return {
          ...rest,
          regularMarketTime: result.regularMarketTime || Math.floor(Date.now() / 1000),
        };
      })
    );
    res.json(results);
  } catch (err) {
    console.error(" Error fetching multiple quotes:", err.message);
    res.status(500).json({ error: "Yahoo Finance bulk fetch failed" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(` Proxy running at http://localhost:${PORT}`);
});
