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

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB first, then start Server
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

// 1. Signup Route
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
    console.error("Signup error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// 2. Login Route
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
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// --- TRADING / DASHBOARD ROUTES ---

// 3. User Holdings (Auto-resolve user to avoid empty array)
app.get("/allHoldings", async (req, res) => {
  try {
    let { userId, email } = req.query;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      const user = email
        ? await UserModel.findOne({ email })
        : await UserModel.findOne();
      if (user) userId = user._id;
    }

    const query = userId && mongoose.Types.ObjectId.isValid(userId) ? { userId } : {};
    const userHoldings = await HoldingsModel.find(query);
    return res.status(200).json(userHoldings);
  } catch (error) {
    console.error("Error fetching holdings:", error);
    return res.status(500).json({ message: "Failed to fetch holdings" });
  }
});

// 4. User Positions (Auto-resolve user to avoid empty array)
app.get("/allPositions", async (req, res) => {
  try {
    let { userId, email } = req.query;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      const user = email
        ? await UserModel.findOne({ email })
        : await UserModel.findOne();
      if (user) userId = user._id;
    }

    const query = userId && mongoose.Types.ObjectId.isValid(userId) ? { userId } : {};
    const userPositions = await PositionsModel.find(query);
    return res.status(200).json(userPositions);
  } catch (error) {
    console.error("Error fetching positions:", error);
    return res.status(500).json({ message: "Failed to fetch positions" });
  }
});
// 5. User Orders (Fixed 500 CastError)
app.get("/allOrders", async (req, res) => {
  try {
    let { userId, email } = req.query;

    // जर userId नसेल किंवा इनव्हॅलिड असेल, तर युझर शोधा
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      const user = email 
        ? await UserModel.findOne({ email }) 
        : await UserModel.findOne();
      if (user) userId = user._id;
    }

    const query = userId ? { userId } : {};
    const userOrders = await OrdersModel.find(query).sort({ createdAt: -1 });
    return res.status(200).json(userOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
});

/// 6. Create New Order (Clean & Robust)
app.post("/newOrder", async (req, res) => {
  try {
    let { name, qty, price, mode, userId, email, product } = req.body;

    // युझर शोधणे (जर आयडी नसेल तर ईमेलवरून किंवा पहिला युझर)
    let user = null;
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      user = await UserModel.findById(userId);
    }
    if (!user && email) {
      user = await UserModel.findOne({ email });
    }
    if (!user) {
      user = await UserModel.findOne();
    }

    const validUserId = user ? user._id : new mongoose.Types.ObjectId();

    const orderQty = Number(qty) || 1;
    const orderPrice = Number(price) || 100;
    const orderMode = (mode || "BUY").toUpperCase();

    // 1. Orders Collection मध्ये सेव्ह करा
    const newOrder = new OrdersModel({
      name,
      qty: orderQty,
      price: orderPrice,
      mode: orderMode,
      userId: validUserId,
      product: product || "CNC",
    });
    await newOrder.save();

    // 2. BUY Logic (Holdings & Positions)
    if (orderMode === "BUY") {
      try {
        // Holdings Update
        let holding = await HoldingsModel.findOne({ userId: validUserId, name });
        if (holding) {
          const totalQty = Number(holding.qty) + orderQty;
          holding.avg = ((Number(holding.qty) * Number(holding.avg)) + (orderQty * orderPrice)) / totalQty;
          holding.qty = totalQty;
          holding.price = orderPrice;
          await holding.save();
        } else {
          await HoldingsModel.create({
            userId: validUserId,
            name,
            qty: orderQty,
            avg: orderPrice,
            price: orderPrice,
            net: 0,
            day: 0,
          });
        }

        // Positions Update
        let position = await PositionsModel.findOne({ userId: validUserId, name });
        if (position) {
          const totalQty = Number(position.qty) + orderQty;
          position.avg = ((Number(position.qty) * Number(position.avg)) + (orderQty * orderPrice)) / totalQty;
          position.qty = totalQty;
          position.price = orderPrice;
          await position.save();
        } else {
          await PositionsModel.create({
            userId: validUserId,
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
      } catch (subErr) {
        console.warn("Holdings/Positions update warning:", subErr.message);
      }
    }

    return res.status(201).json({
      success: true,
      message: `Order executed successfully for ${orderMode} ${orderQty} ${name}`,
      order: newOrder,
    });
  } catch (error) {
    console.error("Order execution error:", error);
    return res.status(500).json({ message: "Failed to process order", error: error.message });
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

const Stock = mongoose.models.Stock || mongoose.model("Stock", stockSchema , "stocks");

let liveStocksCache = [];

const loadInitialStocks = async () => {
  try {
    const dbStocks = await Stock.find({});
    liveStocksCache = dbStocks.map((stock) => ({
      symbol: stock.symbol,
      token: String(stock.token).trim(),
      name: stock.name,
      price: stock.price,
      closePrice: stock.price,
      category: stock.category || "EQUITY",
      lotSize: stock.lotSize || 1,
      exchangeType: stock.exchangeType || 1,
      change: 0,
      percentChange: 0,
      isLoss: false,
    }));
    console.log(`Loaded ${liveStocksCache.length} instruments into Live Engine.`);
    initAngelOneEngine();
  } catch (err) {
    console.error("Failed to load stocks:", err);
  }
};

// --- ANGEL ONE SMARTAPI LIVE WEBSOCKET ENGINE ---
const initAngelOneEngine = async () => {
  try {
    const smart_api = new SmartAPI({
      api_key: process.env.ANGEL_API_KEY,
    });

    // Auto-generate TOTP using Secret Key
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

    const webSocket = new WebSocketV2({
      jwttoken: jwtToken,
      apikey: process.env.ANGEL_API_KEY,
      clientcode: process.env.ANGEL_CLIENT_ID,
      feedtype: feedToken,
    });

    // Central function to parse and update incoming ticks
    const handleIncomingTick = (data) => {
      if (!data) return;

      let rawToken = data.token || (data.tk ? String(data.tk) : null);
      if (!rawToken) return;

      const cleanToken = String(rawToken).replace(/"/g, "").trim();
      const rawPrice = Number(data.last_traded_price || data.ltp);

      if (cleanToken && !isNaN(rawPrice)) {
        const matchingIndex = liveStocksCache.findIndex(
          (s) => String(s.token).trim() === cleanToken
        );

        if (matchingIndex !== -1) {
          // Convert price from paise to rupees
          const newPrice = Number((rawPrice / 100).toFixed(2));
          const stock = liveStocksCache[matchingIndex];

          // Extract previous close price if available in packet
          let closePrice = stock.closePrice;
          if (data.close_price || data.c) {
            closePrice = Number((Number(data.close_price || data.c) / 100).toFixed(2));
            stock.closePrice = closePrice;
          }

          const referencePrice = closePrice && closePrice > 0 ? closePrice : stock.price;
          const changeFromClose = Number((newPrice - referencePrice).toFixed(2));
          const percentChange = Number(((changeFromClose / referencePrice) * 100).toFixed(2));
          const isLoss = changeFromClose < 0;

          liveStocksCache[matchingIndex] = {
            ...stock,
            price: newPrice,
            change: changeFromClose,
            percentChange: percentChange,
            isLoss: isLoss,
          };

          io.emit("market-tick", liveStocksCache);
        }
      }
    };

    // Attach WebSocket listeners
    webSocket.customdata = (data) => handleIncomingTick(data);
    webSocket.on("tick", (data) => handleIncomingTick(data));
    webSocket.on("data", (data) => handleIncomingTick(data));
    webSocket.on("error", (error) => console.error("SmartAPI WebSocket Error:", error));
    webSocket.on("close", () => console.log("SmartAPI WebSocket disconnected."));

    // Connect & Subscribe to tokens
   // Connect & Subscribe to tokens
    webSocket
      .connect()
      .then(() => {
        console.log("Angel One Live WebSocket connected!");

        const nseTokens = liveStocksCache
          .filter((s) => s.exchangeType === 1 || !s.exchangeType)
          .map((s) => String(s.token));

        const bseTokens = liveStocksCache
          .filter((s) => s.exchangeType === 3)
          .map((s) => String(s.token));

        // Subscribe NSE tokens in safe batches of 50
        const chunkSize = 50;
        for (let i = 0; i < nseTokens.length; i += chunkSize) {
          const chunk = nseTokens.slice(i, i + chunkSize);
          webSocket.fetchData({
            correlationID: `novus_nse_${i}`,
            action: 1,
            mode: 2, // Quote Mode
            exchangeType: 1, // Root level exchangeType required by WebSocketV2
            tokens: chunk,
          });
        }

        // Subscribe BSE tokens (Sensex)
        if (bseTokens.length > 0) {
          webSocket.fetchData({
            correlationID: "novus_bse_sensex",
            action: 1,
            mode: 2,
            exchangeType: 3, // Root level exchangeType for BSE
            tokens: bseTokens,
          });
        }

        console.log(`Subscribed to all ${liveStocksCache.length} instruments successfully.`);
      })
      .catch((err) => {
        console.error("Socket connection error:", err);
      });
  } catch (error) {
    console.error("Angel One Engine Error:", error);
  }
};

// Initial stocks API for WatchList hydration
app.get("/api/stocks", (req, res) => {
  res.json(liveStocksCache);
});

// Initialize stock loading and WebSocket engine
loadInitialStocks();

// Client connection handler
io.on("connection", (socket) => {
  console.log(`Trader connected to live stream: ${socket.id}`);
  if (liveStocksCache.length > 0) {
    socket.emit("market-tick", liveStocksCache);
  }

  socket.on("disconnect", () => {
    console.log(`Trader disconnected: ${socket.id}`);
  });
});

// --- LIVE MARKET HOURS & TICK SYNC ENGINE ---
const isIndianMarketOpen = () => {
  const now = new Date();
  // भारतीय प्रमाणवेळेनुसार (IST) रूपांतर
  const istTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const day = istTime.getDay(); // 0 = Sunday, 6 = Saturday
  const hours = istTime.getHours();
  const minutes = istTime.getMinutes();
  const currentTime = hours * 60 + minutes;

  // सोमवार ते शुक्रवार (Day 1 to 5) आणि वेळ 9:15 AM (555 min) ते 3:30 PM (930 min)
  const isWeekday = day >= 1 && day <= 5;
  const isMarketHours = currentTime >= 555 && currentTime <= 930;

  return isWeekday && isMarketHours;
};

// दर १ सेकंदाला कॅशे सिंक ठेवणे
setInterval(() => {
  // बाजार चालू असेल तरच किंवा कॅशेमध्ये बदल झाल्यास टिक पाठवणे
  if (isIndianMarketOpen() && liveStocksCache.length > 0) {
    io.emit("market-tick", liveStocksCache);
  }
}, 1000);

