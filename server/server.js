/* export const fetchStockDetails = async (symbol) => {
  try {
    const response = await fetch(`http://localhost:3001/api/quote/${symbol}`);
    const data = await response.json();

    return {
      symbol: data.symbol,
      name: data.longName || "-",
      sector: data.sector || "-",
      price: data.regularMarketPrice || 0,
      prevClose: data.regularMarketPreviousClose || 0,
      open: data.regularMarketOpen || 0,
      high: data.regularMarketDayHigh || 0,
      low: data.regularMarketDayLow || 0,
      change: data.regularMarketChange || 0,
      changePercent: data.regularMarketChangePercent || 0,
    };
  } catch (error) {
    console.error(`Error fetching ${symbol} from Yahoo:`, error);
    return null;
  }
};
 */
/* app.get("/api/quote", async (req, res) => {
  const symbol = req.query.symbol;
  if (!symbol) return res.status(400).json({ error: "Missing symbol" });

  try {
    const result = await yahooFinance.quote(symbol);

    const patched = {
      ...result,
      regularMarketTime: result.regularMarketTime || Math.floor(Date.now() / 1000),
    };

    res.json(patched);
  } catch (err) {
    console.error(" YahooFinance2 Error:", err.message);
    res.status(500).json({ error: "Yahoo Finance quote failed" });
  }
});
 */
/* app.get("/api/quotes", async (req, res) => {
  const symbols = req.query.symbols?.split(",") || [];

  if (symbols.length === 0) {
    return res.status(400).json({ error: "Missing symbols query" });
  }

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
    console.error(" Yahoo batch fetch error:", err.message);
    res.status(500).json({ error: "Yahoo Finance bulk fetch failed" });
  }
});

 */

// Imports
/* const express = require("express");
const cors = require("cors");
const yahooFinance = require("yahoo-finance2").default; */

// Create app
/* const app = express();
app.use(cors()) */;

// Root check
/* app.get("/", (req, res) => {
  res.send(" Yahoo Finance Proxy is running");
});
 */
// Single stock route
/* app.get("/api/quote", async (req, res) => {
  const symbol = req.query.symbol;
  if (!symbol) return res.status(400).json({ error: "Missing symbol" });

  try {
    const result = await yahooFinance.quote(symbol);
    const patched = {
      ...result,
      regularMarketTime: result.regularMarketTime || Math.floor(Date.now() / 1000),
    };
    res.json(patched);
  } catch (err) {
    console.error(" Error:", err.message);
    res.status(500).json({ error: "Yahoo Finance quote failed" });
  }
}); */

//  Batch stock route (must be after app is defined)
/* app.get("/api/quotes", async (req, res) => {
  const symbols = req.query.symbols?.split(",") || [];
  if (symbols.length === 0) {
    return res.status(400).json({ error: "Missing symbols query" });
  }

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
    console.error(" Bulk fetch error:", err.message);
    res.status(500).json({ error: "Yahoo Finance bulk fetch failed" });
  }
}); */
/* app.get("/api/quotes", async (req, res) => {
  const symbols = req.query.symbols?.split(",") || [];
  if (!symbols.length) {
    return res.status(400).json({ error: "Missing symbols query" });
  }

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



const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Proxy running at http://localhost:${PORT}`);
});
 */
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const yahooFinance = require("yahoo-finance2").default;

const app = express();
const PORT = 3001;

//  MongoDB direct connection (local)
mongoose.connect("mongodb://localhost:27017/finfolio", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error(" MongoDB connection error:", err));

yahooFinance.suppressNotices(["yahooSurvey"]);

app.use(cors());
app.use(express.json());

//  Health check
app.get("/", (req, res) => {
  res.send(" Yahoo Finance Proxy is running");
});

app.get("/check", (req, res) => {
  res.send(" Backend is live");
});

//  Single quote route (symbol excluded)
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
