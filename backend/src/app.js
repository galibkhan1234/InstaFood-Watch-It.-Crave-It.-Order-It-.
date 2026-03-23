const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth.routes");
const feedRoutes = require("./routes/feed.routes");
const reelRoutes = require("./routes/reel.routes");
const partnerRoutes = require("./routes/partner.routes");
const restaurantRoutes = require("./routes/restaurant.routes");
const orderRoutes = require("./routes/order.routes");
const followRoutes = require("./routes/follow.route"); 

const app = express();

// Security
app.use(helmet());
app.use(cors({
  origin: [
    "http://localhost:5173", 
    "http://localhost:5174",
    "http://localhost:5175",
    process.env.CLIENT_URL
  ].filter(Boolean),
  credentials: true
}));

// Rate limiting on auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 attempts per window
  message: { success: false, message: "Too many attempts, please try again later" }
});

// Logging
app.use(morgan("dev"));

// Body parser & cookies
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/reels", reelRoutes);
app.use("/api/partner", partnerRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/orders", orderRoutes);            
app.use("/api/follow", followRoutes);           

// Health check
app.get("/health", (req, res) => res.json({ status: "OK" }));

// Global error handler
app.use(require("./middlewares/error.middleware"));

module.exports = app;