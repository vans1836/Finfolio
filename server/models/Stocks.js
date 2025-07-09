// server/models/Stocks.js
const mongoose = require("mongoose");

const StockSchema = new mongoose.Schema({
  symbol: String,
  price: Number,
  time: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Stock", StockSchema);
