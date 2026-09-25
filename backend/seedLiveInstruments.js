const dns = require("node:dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config();
const mongoose = require("mongoose");
const axios = require("axios");

const MONGO_URL = process.env.MONGO_URL;

const stockSchema = new mongoose.Schema({
  symbol: String,
  name: String,
  token: String,
  price: Number,
  category: String,
  lotSize: Number,
  exchangeType: Number,
});

const Stock = mongoose.models.Stock || mongoose.model("Stock", stockSchema, "stocks");

async function seedInstruments() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB successfully.");

    console.log("Downloading Angel One Scrip Master JSON...");
    const response = await axios.get(
      "https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json",
      { timeout: 60000 }
    );
    const masterData = response.data;
    console.log(`Total instruments fetched: ${masterData.length}`);

    const instrumentsToInsert = [];

    // 1. SENSEX
    instrumentsToInsert.push({
      symbol: "SENSEX",
      name: "BSE Sensex Index",
      token: "99919000",
      price: 74900.00,
      category: "EQUITY",
      lotSize: 1,
      exchangeType: 3,
    });

    // 2. Mutual Funds / ETFs (NSE)
    const targetETFs = ["NIFTYBEES", "BANKBEES", "GOLDBEES", "SILVERBEES", "ITBEES", "JUNIORBEES", "CPSEETF", "LIQUIDBEES"];
    masterData.forEach((item) => {
      if (item.exch_seg === "NSE" && targetETFs.includes(item.name)) {
        instrumentsToInsert.push({
          symbol: item.name,
          name: item.symbol,
          token: String(item.token),
          price: 100,
          category: "MF",
          lotSize: Number(item.lotsize) || 1,
          exchangeType: 1,
        });
      }
    });

    // 3. Current Live Active F&O (Nearest Valid Expiry)
    const today = new Date();
    const futureOptions = masterData.filter(
      (item) =>
        item.exch_seg === "NFO" &&
        (item.name === "NIFTY" || item.name === "BANKNIFTY") &&
        item.instrumenttype === "OPTIDX" &&
        new Date(item.expiry) >= today
    );

    futureOptions.sort((a, b) => new Date(a.expiry) - new Date(b.expiry));
    const nearestExpiry = futureOptions[0]?.expiry;
    console.log("Current active expiry selected:", nearestExpiry);

    const activeContracts = futureOptions.filter((item) => item.expiry === nearestExpiry);

    // Filter ATM/OTM strikes (Clean sorted)
    const niftyStrikes = activeListSorter(activeContracts.filter((i) => i.name === "NIFTY"), 23100, 10);
    const bankNiftyStrikes = activeListSorter(activeContracts.filter((i) => i.name === "BANKNIFTY"), 55500, 10);

    function activeListSorter(arr, atmBase, count) {
      return arr
        .map((i) => ({ ...i, strikeNum: Number(i.strike) > 0 ? Number(i.strike) / 100 : 0 }))
        .sort((a, b) => Math.abs(a.strikeNum - atmBase) - Math.abs(b.strikeNum - atmBase))
        .slice(0, count);
    }

    [...niftyStrikes, ...bankNiftyStrikes].forEach((item) => {
      const type = item.symbol.slice(-2); // CE kinva PE
      // Clean display name: NIFTY 23100 CE (chitknaar nahi ata)
      const cleanSymbol = `${item.name} ${item.strikeNum} ${type}`;

      instrumentsToInsert.push({
        symbol: cleanSymbol,
        name: `${item.name} Expiry ${item.expiry}`,
        token: String(item.token),
        price: 120.0,
        category: "FO",
        lotSize: Number(item.lotsize) || (item.name === "NIFTY" ? 25 : 15),
        exchangeType: 2,
      });
    });

    // Clean old entries & Upsert fresh active ones
    await Stock.deleteMany({ symbol: "SENSEX" });
    await Stock.deleteMany({ category: "FO" });
    await Stock.deleteMany({ category: "MF" });

    console.log(`Inserting ${instrumentsToInsert.length} active contracts into database...`);
    for (const inst of instrumentsToInsert) {
      await Stock.findOneAndUpdate(
        { token: inst.token },
        { $set: inst },
        { upsert: true, returnDocument: "after" }
      );
    }

    console.log("Active instruments successfully seeded!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error.message);
    process.exit(1);
  }
}

seedInstruments();