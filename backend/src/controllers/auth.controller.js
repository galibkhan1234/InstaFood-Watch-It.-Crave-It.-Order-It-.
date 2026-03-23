const User = require("../models/user.model");
const Restaurant = require("../models/restaurant.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, restaurantName, phone, cuisineTypes, address } = req.body;

    // 1. Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // 2. Check duplicate email
    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Default to USER, but if restaurantName is provided, register as PARTNER
    const isPartner = !!restaurantName;
    const role = isPartner ? "PARTNER" : "USER";
    const partnerStatus = isPartner ? "APPROVED" : "NONE";

    // 4. Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role,
      partnerStatus
    });

    // 5. Automatically create a restaurant profile if they registered as a partner
    if (isPartner) {
      await Restaurant.create({
        owner: user._id,
        name: restaurantName.trim(),
        phone: phone || "",
        cuisineTags: Array.isArray(cuisineTypes) ? cuisineTypes : [],
        location: {
          type: "Point",
          coordinates: [77.5946, 12.9716], // Default dummy coordinates
          address: address?.street || "Pending Address",
          city: address?.city || "Default City",
          state: address?.state || "",
          pincode: address?.pincode || ""
        }
      });
    }

    // 5. Generate tokens — pass full user object (needed for role + tokenVersion)
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // 6. Respond — never return the password
    return res.status(201).json({
      success: true,
      message: "Registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        partnerStatus: user.partnerStatus,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};


exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    
    const user = await User.findOne({
      email: email.toLowerCase().trim(), 
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // 2. Check if blocked
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Account has been blocked. Contact support.",
      });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // 4. Update lastLoginAt — use updateOne to avoid triggering any pre-save hooks
    await User.updateOne({ _id: user._id }, { lastLoginAt: new Date() });

    // 5. Generate tokens — pass full user object
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        partnerStatus: user.partnerStatus,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};


exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token required",
      });
    }

    // 1. Verify token — wrap in try/catch so expired tokens return 401 not 500
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }

    // 2. Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // 3. Check token version — invalidated on logout or password change
    if (decoded.tokenVersion !== user.refreshTokenVersion) {
      return res.status(401).json({
        success: false,
        message: "Token has been invalidated. Please log in again.",
      });
    }

    // 4. Issue new access token only (refresh token stays the same until logout)
    const newAccessToken = generateAccessToken(user);

    return res.json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    next(error);
  }
};


exports.logout = async (req, res, next) => {
  try {
    // Increment tokenVersion — all existing refresh tokens become invalid
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { refreshTokenVersion: 1 },
    });

    return res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};