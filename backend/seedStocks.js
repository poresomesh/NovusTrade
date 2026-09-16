const dns = require("node:dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config();
const mongoose = require("mongoose");
const axios = require("axios");

const MONGO_URL = process.env.MONGO_URL || process.env.MONGO_URI;

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("MongoDB Atlas Connected for 999 Active Stocks Seeding."))
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  });

const stockSchema = new mongoose.Schema({
  symbol: { type: String, unique: true },
  name: String,
  token: String,
  price: Number,
  category: String,
  lotSize: Number,
  exchangeType: Number,
});

const Stock = mongoose.model("Stock", stockSchema, "stocks");

// High-liquidity universe: daily most traded bluechips, IT, banks, consumer, defence & auto
const CORE_ACTIVE_STOCKS = [
  // 1. High Demand & Consumer Internet
  "SWIGGY", "ZOMATO", "PAYTM", "NYKAA", "POLICYBZR", "DELHIVERY", "MAPMYINDIA",

  // 2. All Major Private, Public Banks & NBFCs
  "HDFCBANK", "ICICIBANK", "SBIN", "KOTAKBANK", "AXISBANK", "INDUSINDBK", 
  "BANKBARODA", "PNB", "CANBK", "IDFCFIRSTB", "FEDERALBNK", "AUBANK", 
  "BANDHANBNK", "UNIONBANK", "BAJFINANCE", "BAJAJFINSV", "JIOFIN", "CHOLAFIN",
  "SHRIRAMFIN", "MUTHOOTFIN", "SBICARD", "HDFCLIFE", "SBILIFE", "ICICIPRULI",

  // 3. Complete IT Sector Giants
  "TCS", "INFY", "WIPRO", "HCLTECH", "TECHM", "LTIM", "PERSISTENT", 
  "COFORGE", "MPHASIS", "KPITTECH", "TATAELXSI", "LTTS",

  // 4. Heavyweights, Conglomerates & Energy
  "RELIANCE", "ONGC", "NTPC", "POWERGRID", "COALINDIA", "BPCL", "IOC", "GAIL",
  "ADANIENT", "ADANIPORTS", "ADANIPOWER", "ADANIGREEN", "ADANIENSOL",

  // 5. Automobile, EV & Mobility
  "TATAMOTORS", "M&M", "MARUTI", "BAJAJ-AUTO", "EICHERMOT", "HEROMOTOCO", 
  "TVSMOTOR", "ASHOKLEY", "MOTHERSON", "BHARATFORG",

  // 6. FMCG, Retail & Consumer
  "ITC", "HINDUNILVR", "NESTLEIND", "BRITANNIA", "TATACONSUM", "TITAN", 
  "TRENT", "DMART", "VBL", "DABUR", "MARICO", "GODREJCP", "COLPAL",

  // 7. Infra, Metals, Mining & Cement
  "LT", "TATASTEEL", "JSWSTEEL", "HINDALCO", "VEDL", "JINDALSTEL", "NMDC", "SAIL",
  "GRASIM", "ULTRACEMCO", "ABFRL", "AMBUJACEM", "ACC", "SHREECEM",

  // 8. Pharma, Diagnostics & Healthcare
  "SUNPHARMA", "CIPLA", "DRREDDY", "APOLLOHOSP", "DIVISLAB", "MANKIND", 
  "LUPIN", "AUROPHARMA", "TORNTPHARM", "ZYDUSLIFE",

  // 9. Defence, Aerospace, Railways & PSU
  "BEL", "HAL", "BDL", "MAZDOCK", "COCHINSHIP", "IRCTC", "RVNL", "IRFC", 
  "BHEL", "PFC", "RECLTD", "CONCOR"
];

const seed999Stocks = async () => {
  try {
    console.log("Angel One Scrip Master डाऊनलोड होत आहे...");
    const response = await axios.get(
      "https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json"
    );

    const masterData = response.data;
    console.log(`एकूण उपलब्ध इन्स्ट्रुमेंट्स: ${masterData.length}`);

    // Filter NSE Cash Equities (-EQ)
    const nseEquities = masterData.filter(
      (item) => item.exch_seg === "NSE" && item.symbol && item.symbol.endsWith("-EQ")
    );

    const symbolMap = new Map();
    for (const item of nseEquities) {
      const clean = item.symbol.replace("-EQ", "").trim();
      symbolMap.set(clean, item);
    }

    const seenTokens = new Set();
    const batchToInsert = [];

    // 1. Primary Indices (3 Slots)
    const indices = [
      { symbol: "NIFTY 50", name: "Nifty 50 Index", token: "99926000", price: 25000.0, category: "INDEX", lotSize: 25, exchangeType: 1 },
      { symbol: "BANKNIFTY", name: "Nifty Bank Index", token: "99926009", price: 51500.0, category: "INDEX", lotSize: 15, exchangeType: 1 },
      { symbol: "SENSEX", name: "BSE Sensex Index", token: "99919000", price: 81500.0, category: "INDEX", lotSize: 10, exchangeType: 3 }
    ];

    for (const idx of indices) {
      seenTokens.add(idx.token);
      batchToInsert.push(idx);
    }

    // 2. Add Top Traded Active Stocks First
    for (const sym of CORE_ACTIVE_STOCKS) {
      const item = symbolMap.get(sym);
      if (item && !seenTokens.has(String(item.token).trim())) {
        const token = String(item.token).trim();
        seenTokens.add(token);
        batchToInsert.push({
          symbol: sym,
          name: item.name.trim(),
          token: token,
          price: 500.0,
          category: "EQUITY",
          lotSize: Number(item.lotsize) || 1,
          exchangeType: 1,
        });
      }
    }
    console.log(`महत्त्वाचे Bluechips & IT स्टॉक्स जोडले: ${batchToInsert.length - 3}`);

    // 3. Fill strictly up to exactly 999 instruments
    const EXACT_LIMIT = 999;
    for (const item of nseEquities) {
      if (batchToInsert.length >= EXACT_LIMIT) break;

      const cleanSymbol = item.symbol.replace("-EQ", "").trim();
      const token = String(item.token).trim();

      if (!seenTokens.has(token)) {
        seenTokens.add(token);
        batchToInsert.push({
          symbol: cleanSymbol,
          name: item.name.trim(),
          token: token,
          price: 250.0,
          category: "EQUITY",
          lotSize: Number(item.lotsize) || 1,
          exchangeType: 1,
        });
      }
    }

    // Clean old data and insert curated 999 records
    await Stock.deleteMany({});
    await Stock.insertMany(batchToInsert);

    console.log("--------------------------------------------------");
    console.log(`अभिनंदन! जुना कचरा काढून अचूक ${batchToInsert.length} Most Active शेअर्स Atlas वर लोड झाले!`);
    console.log("--------------------------------------------------");
    process.exit(0);
  } catch (error) {
    console.error("Seeding Error:", error.message);
    process.exit(1);
  }
};

seed999Stocks();