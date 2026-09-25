const dns = require("node:dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { SmartAPI, WebSocketV2 } = require("smartapi-javascript");
const speakeasy = require("speakeasy");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Models
const { UserModel } = require("./models/UserModel");
const { HoldingsModel } = require("./models/HoldingsModel");
const { PositionsModel } = require("./models/PositionsModel");
const { OrdersModel } = require("./models/OrdersModel");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3002;
const MONGO_URL = process.env.MONGO_URL;
const JWT_SECRET = process.env.JWT_SECRET || "YOUR_SECRET_KEY";

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors({
  origin: "*", // Testing sathi sarv allow kara, kiva tujhe Vercel frontend URLs dya
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("MongoDB connected successfully.");
    server.listen(PORT, () => {
      console.log(`NovusTrade Engine & API running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// --- AUTHENTICATION ROUTES ---
app.post("/signup", async (req, res) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists with this email" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await UserModel.create({
      email,
      username,
      password: hashedPassword,
      funds: 50000,
    });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "3d" });
    res.cookie("token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    return res.status(201).json({
      success: true,
      message: "User signed up successfully",
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "3d" });
    res.cookie("token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  return res.status(200).json({ success: true, message: "Logged out successfully" });
});

// --- TRADING / PORTFOLIO ROUTES ---
app.get("/allHoldings", async (req, res) => {
  try {
    let { userId, email } = req.query;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      const user = email ? await UserModel.findOne({ email }) : await UserModel.findOne();
      if (user) userId = user._id;
    }
    const query = userId && mongoose.Types.ObjectId.isValid(userId) ? { userId } : {};
    const userHoldings = await HoldingsModel.find(query);
    return res.status(200).json(userHoldings);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch holdings" });
  }
});

app.get("/allPositions", async (req, res) => {
  try {
    let { userId, email } = req.query;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      const user = email ? await UserModel.findOne({ email }) : await UserModel.findOne();
      if (user) userId = user._id;
    }
    const query = userId && mongoose.Types.ObjectId.isValid(userId) ? { userId } : {};
    const userPositions = await PositionsModel.find(query);
    return res.status(200).json(userPositions);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch positions" });
  }
});

app.get("/allOrders", async (req, res) => {
  try {
    let { userId, email } = req.query;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      const user = email ? await UserModel.findOne({ email }) : await UserModel.findOne();
      if (user) userId = user._id;
    }
    const query = userId ? { userId } : {};
    const userOrders = await OrdersModel.find(query).sort({ createdAt: -1 });
    return res.status(200).json(userOrders);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// --- NEW ORDER EXECUTION WITH TOAST-FRIENDLY VALIDATION ---
app.post("/newOrder", async (req, res) => {
  try {
    let { name, qty, price, mode, userId, email, product } = req.body;
    let user = null;
    if (userId && mongoose.Types.ObjectId.isValid(userId)) user = await UserModel.findById(userId);
    if (!user && email) user = await UserModel.findOne({ email });
    if (!user) user = await UserModel.findOne();
    if (!user) {
      return res.status(404).json({ success: false, message: "User account not found!" });
    }

    if (user.funds === undefined || user.funds === null) user.funds = 50000;

    const orderQty = Number(qty);
    const orderPrice = Number(price) || 100;
    const orderMode = (mode || "BUY").toUpperCase();

    if (!orderQty || isNaN(orderQty) || orderQty <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid quantity! Quantity must be at least 1.",
      });
    }

    const totalOrderAmount = orderQty * orderPrice;

    if (orderMode === "BUY") {
      if (user.funds < totalOrderAmount) {
        return res.status(400).json({
          success: false,
          message: `Insufficient balance! Required: ₹${totalOrderAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}, Available: ₹${Number(user.funds).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
        });
      }

      user.funds -= totalOrderAmount;
      await user.save();

      let holding = await HoldingsModel.findOne({ userId: user._id, name });
      if (holding) {
        const totalQty = Number(holding.qty) + orderQty;
        holding.avg = ((Number(holding.qty) * Number(holding.avg)) + totalOrderAmount) / totalQty;
        holding.qty = totalQty;
        holding.price = orderPrice;
        await holding.save();
      } else {
        await HoldingsModel.create({
          userId: user._id,
          name,
          qty: orderQty,
          avg: orderPrice,
          price: orderPrice,
          net: 0,
          day: 0,
        });
      }

      let position = await PositionsModel.findOne({ userId: user._id, name });
      if (position) {
        const totalQty = Number(position.qty) + orderQty;
        position.avg = ((Number(position.qty) * Number(position.avg)) + totalOrderAmount) / totalQty;
        position.qty = totalQty;
        position.price = orderPrice;
        await position.save();
      } else {
        await PositionsModel.create({
          userId: user._id,
          product: product || "CNC",
          name,
          qty: orderQty,
          avg: orderPrice,
          price: orderPrice,
          net: 0,
          day: 0,
          isLoss: false,
        });
      }
    }

    if (orderMode === "SELL") {
      let holding = await HoldingsModel.findOne({ userId: user._id, name });
      let position = await PositionsModel.findOne({ userId: user._id, name });

      const availableQty = holding ? Number(holding.qty) : (position ? Number(position.qty) : 0);

      if (availableQty <= 0) {
        return res.status(400).json({
          success: false,
          message: `You don't have enough shares! You own 0 shares of ${name}.`,
        });
      }

      if (orderQty > availableQty) {
        return res.status(400).json({
          success: false,
          message: `You don't have enough shares! You own only ${availableQty} shares of ${name}, but trying to sell ${orderQty}.`,
        });
      }

      user.funds += totalOrderAmount;
      await user.save();

      if (holding) {
        const currentQty = Number(holding.qty);
        if (currentQty <= orderQty) {
          await HoldingsModel.deleteOne({ _id: holding._id });
        } else {
          holding.qty = currentQty - orderQty;
          await holding.save();
        }
      }

      if (position) {
        const currentPosQty = Number(position.qty);
        if (currentPosQty <= orderQty) {
          await PositionsModel.deleteOne({ _id: position._id });
        } else {
          position.qty = currentPosQty - orderQty;
          await position.save();
        }
      }
    }

    const newOrder = new OrdersModel({
      name,
      qty: orderQty,
      price: orderPrice,
      mode: orderMode,
      userId: user._id,
      product: product || "CNC",
      createdAt: new Date(),
    });
    await newOrder.save();

    return res.status(201).json({
      success: true,
      message: `Order executed: ${orderMode} ${orderQty} ${name}`,
      updatedFunds: user.funds,
      order: newOrder,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Order failed", error: error.message });
  }
});

app.get("/userFunds", async (req, res) => {
  try {
    let { userId, email } = req.query;
    let user = null;
    if (userId && mongoose.Types.ObjectId.isValid(userId)) user = await UserModel.findById(userId);
    if (!user && email) user = await UserModel.findOne({ email });
    if (!user) user = await UserModel.findOne();
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.funds === undefined || user.funds === null) {
      user.funds = 50000;
      await user.save();
    }
    return res.status(200).json({ funds: user.funds });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch funds" });
  }
});

// --- STOCK SCHEMA & CACHE ---
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

let liveStocksCache = [];

const loadInitialStocks = async () => {
  try {
    const dbStocks = await Stock.find({});
    liveStocksCache = dbStocks.map((stock) => ({
      symbol: stock.symbol,
      token: String(stock.token).trim(),
      name: stock.name,
      price: stock.price || 100,
      closePrice: stock.price || 100,
      category: stock.category || "EQUITY",
      lotSize: stock.lotSize || 1,
      exchangeType: stock.exchangeType || 1,
      change: 0,
      percentChange: 0,
      isLoss: false,
    }));

    let snx = liveStocksCache.find((s) => s.symbol === "SENSEX");
    const sensexObj = {
      symbol: "SENSEX",
      name: "BSE SENSEX",
      token: "99919000",
      price: 73556.00,
      closePrice: 73556.00,
      category: "EQUITY",
      lotSize: 1,
      exchangeType: 3,
      change: 0.00,
      percentChange: 0.00,
      isLoss: false,
    };

    if (!snx) {
      const bnfIdx = liveStocksCache.findIndex((s) => s.symbol === "BANKNIFTY");
      if (bnfIdx !== -1) {
        liveStocksCache.splice(bnfIdx + 1, 0, sensexObj);
      } else {
        liveStocksCache.unshift(sensexObj);
      }
    } else {
      snx.token = "99919000";
      snx.price = 73556.00;
      snx.closePrice = 73556.00;
    }

    console.log(`Loaded ${liveStocksCache.length} instruments into Live Engine.`);
    initAngelOneEngine();
  } catch (err) {
    console.error("Failed to load stocks:", err);
  }
};

// --- ANGEL ONE ENGINE ---
const initAngelOneEngine = async () => {
  try {
    const smart_api = new SmartAPI({
      api_key: process.env.ANGEL_API_KEY,
    });

    const totp = speakeasy.totp({
      secret: process.env.ANGEL_TOTP_SECRET,
      encoding: "base32",
    });

    console.log("Authenticating with Angel One SmartAPI...");
    const sessionData = await smart_api.generateSession(
      process.env.ANGEL_CLIENT_ID,
      process.env.ANGEL_MPIN,
      totp
    );

    if (!sessionData.status) {
      console.error("Angel One Login Failed:", sessionData.message);
      return;
    }

    console.log("Angel One Login successful!");
    const feedToken = sessionData.data.feedToken;
    const jwtToken = sessionData.data.jwtToken;

    // --- EXACT OFFICIAL SENSEX TICK (100% MATCH WITH ANGEL ONE LIVE) ---
    const fetchExactSensexLive = async () => {
      try {
        let ltp = null;
        let close = null;

        // Try Angel One SmartAPI direct LTP
        try {
          const res = await smart_api.getLTP({
            exchange: "BSE",
            tradingsymbol: "SENSEX",
            symboltoken: "99919000",
          });
          if (res?.data?.ltp && Number(res.data.ltp) > 0) {
            ltp = Number(res.data.ltp);
            close = Number(res.data.close || res.data.prevClose || ltp);
          }
        } catch (e) {
          // ignore
        }

        // Secondary Exact Live Feed backup jar SmartAPI Index restrict asel
        if (!ltp || isNaN(ltp)) {
          const feedRes = await fetch("https://query1.finance.yahoo.com/v8/finance/chart/%5EBSESN?interval=1m");
          const feedData = await feedRes.json();
          const meta = feedData?.chart?.result?.[0]?.meta;
          if (meta?.regularMarketPrice) {
            ltp = Number(meta.regularMarketPrice);
            close = Number(meta.chartPreviousClose || meta.previousClose || ltp);
          }
        }

        if (ltp && !isNaN(ltp)) {
          const snxIndex = liveStocksCache.findIndex((s) => s.symbol === "SENSEX");
          if (snxIndex !== -1) {
            const actualClose = close && close > 0 ? close : liveStocksCache[snxIndex].closePrice;
            const actualChange = Number((ltp - actualClose).toFixed(2));
            const actualPct = actualClose > 0 ? Number(((actualChange / actualClose) * 100).toFixed(2)) : 0;

            liveStocksCache[snxIndex].price = ltp;
            liveStocksCache[snxIndex].closePrice = actualClose;
            liveStocksCache[snxIndex].change = actualChange;
            liveStocksCache[snxIndex].percentChange = actualPct;
            liveStocksCache[snxIndex].isLoss = actualChange < 0;

            io.emit("market-tick", liveStocksCache);
          }
        }
      } catch (err) {
        // error handled
      }
    };

    // Live exact rate fetch every 1 second
    fetchExactSensexLive();
    setInterval(fetchExactSensexLive, 1000);

    const webSocket = new WebSocketV2({
      jwttoken: jwtToken,
      apikey: process.env.ANGEL_API_KEY,
      clientcode: process.env.ANGEL_CLIENT_ID,
      feedtype: feedToken,
    });

    const handleIncomingTick = (data) => {
      if (!data) return;

      let rawToken = data.token || (data.tk ? String(data.tk) : null);
      if (!rawToken) return;

      const cleanToken = String(rawToken).replace(/"/g, "").trim();
      const rawPrice = Number(data.last_traded_price || data.ltp);

      if (cleanToken && !isNaN(rawPrice) && rawPrice > 0) {
        const matchingIndices = [];
        liveStocksCache.forEach((s, idx) => {
          if (String(s.token).trim() === cleanToken) {
            matchingIndices.push(idx);
          }
        });

        if (matchingIndices.length > 0) {
          const newPrice = Number((rawPrice / 100).toFixed(2));

          matchingIndices.forEach((matchingIndex) => {
            const stock = liveStocksCache[matchingIndex];

            let closePrice = stock.closePrice;
            if (data.close_price || data.c) {
              closePrice = Number((Number(data.close_price || data.c) / 100).toFixed(2));
              stock.closePrice = closePrice;
            }

            const referencePrice = closePrice && closePrice > 0 ? closePrice : stock.price;
            const changeFromClose = Number((newPrice - referencePrice).toFixed(2));
            const percentChange = Number(((changeFromClose / referencePrice) * 100).toFixed(2));

            liveStocksCache[matchingIndex] = {
              ...stock,
              price: newPrice,
              change: changeFromClose,
              percentChange: percentChange,
              isLoss: changeFromClose < 0,
            };
          });

          // ETITHE TO CHUKICHA 3.195 MULTIPLIER FORMULA KADHUN TAKLA AHE!
          // SENSEX ata direct Angel One chya live bhavavr ch chalel, overwrite honar nahi.

          io.emit("market-tick", liveStocksCache);
        }
      }
    };

    webSocket.customdata = (data) => handleIncomingTick(data);
    webSocket.on("tick", (data) => handleIncomingTick(data));
    webSocket.on("data", (data) => handleIncomingTick(data));
    webSocket.on("error", (error) => console.error("SmartAPI WebSocket Error:", error));
    webSocket.on("close", () => console.log("SmartAPI WebSocket disconnected."));

    webSocket
      .connect()
      .then(() => {
        console.log("Angel One Live WebSocket connected!");

        const nseTokens = liveStocksCache
          .filter((s) => s.exchangeType === 1 || !s.exchangeType)
          .map((s) => String(s.token).trim());

        const nfoTokens = liveStocksCache
          .filter((s) => s.exchangeType === 2)
          .map((s) => String(s.token).trim());

        const bseTokens = Array.from(
          new Set([
            ...liveStocksCache
              .filter((s) => s.exchangeType === 3)
              .map((s) => String(s.token).trim()),
            "99919000",
            "1",
          ])
        );

        const subscribeBatch = (tokens, exchangeType, correlationPrefix) => {
          const chunkSize = 50;
          for (let i = 0; i < tokens.length; i += chunkSize) {
            const chunk = tokens.slice(i, i + chunkSize);
            webSocket.fetchData({
              correlationID: `${correlationPrefix}_${i}`,
              action: 1,
              mode: 2,
              exchangeType: exchangeType,
              tokens: chunk,
            });
          }
        };

        if (nseTokens.length > 0) subscribeBatch(nseTokens, 1, "novus_nse");
        if (nfoTokens.length > 0) subscribeBatch(nfoTokens, 2, "novus_nfo");
        if (bseTokens.length > 0) subscribeBatch(bseTokens, 3, "novus_bse");
      })
      .catch((err) => {
        console.error("Socket connection error:", err);
      });
  } catch (error) {
    console.error("Angel One Engine Error:", error);
  }
};

app.get("/api/stocks", (req, res) => {
  res.json(liveStocksCache);
});

loadInitialStocks();

io.on("connection", (socket) => {
  if (liveStocksCache.length > 0) {
    socket.emit("market-tick", liveStocksCache);
  }
});