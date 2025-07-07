// server.js
/* import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors());

app.get('/api/stocks', async (req, res) => {
  const symbols = req.query.symbols;
  try {
    const response = await axios.get(`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Yahoo data" });
  }
});

app.listen(PORT, () => {
  console.log(` Backend proxy running at http://localhost:${PORT}`);
});

 */

// src/api/finnhub.js

export const fetchStockDetails = async (symbol) => {
  try {
    const response = await fetch(`http://localhost:3001/api/quote?symbol=${symbol}`);
    

    const data = await response.json();

    console.log(" Raw Yahoo data for", symbol, "→", data);

    return {
      symbol: data.symbol || symbol,
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
    console.error(` Error fetching ${symbol}:`, error);
    return null;
  }
};
