const mongoose = require("mongoose");
const User = require("../models/user.model");
const PartnerApplication = require("../models/partnerApplication.model");

exports.applyPartner = async (req, res, next) => {
  try {
    const user = req.user;
    const { businessName, businessType, phone, address, documents } = req.body;

    if (!businessName || !businessType || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: "businessName, businessType, phone and address are required",
      });
    }

    if (user.partnerStatus === "PENDING") {
      return res.status(400).json({
        success: false,
        message: "You already have a pending application",
      });
    }

    if (user.partnerStatus === "APPROVED" || user.role === "PARTNER") {
      return res.status(400).json({
        success: false,
        message: "You are already a partner",
      });
    }

    // ✅ Create separate PartnerApplication document
    const application = await PartnerApplication.create({
      user: user._id,
      businessName: businessName.trim().toUpperCase(),
      businessType: businessType.trim(),
      phone: phone.trim(),
      address,
      documents: documents || [],
    });

    // ✅ Keep User.partnerStatus in sync
    await User.findByIdAndUpdate(user._id, { partnerStatus: "PENDING" });

    return res.status(201).json({
      success: true,
      message: "Application submitted. You will be notified once reviewed.",
      application: {
        id: application._id,
        status: application.status,
      },
    });
  } catch (error) {
    // ✅ Handle duplicate application at DB level (unique index on user)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted an application",
      });
    }
    next(error);
  }
};


exports.getAllApplications = async (req, res, next) => {
  try {
    const { status = "PENDING", page = 1, limit = 20 } = req.query;

    // ✅ Query PartnerApplication collection, not User
    const applications = await PartnerApplication.find({
      status: status.toUpperCase(),
    })
      .populate("user", "name email createdAt")       // ✅ join user info
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await PartnerApplication.countDocuments({
      status: status.toUpperCase(),
    });

    return res.json({
      success: true,
      total,
      page: Number(page),
      applications,
    });
  } catch (error) {
    next(error);
  }
};


exports.getApplicationById = async (req, res, next) => {
  try {
    // ✅ Query PartnerApplication, populate user
    const application = await PartnerApplication.findById(req.params.id)
      .populate("user", "name email createdAt")
      .populate("reviewedBy", "name email");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    return res.json({ success: true, application });
  } catch (error) {
    next(error);
  }
};


exports.reviewApplication = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { action, rejectionReason } = req.body;
    const adminId = req.user._id;

    if (!["APPROVED", "REJECTED"].includes(action)) {
      throw new Error("Invalid action");
    }

    const application = await PartnerApplication
      .findById(id)
      .session(session);

    if (!application) {
      throw new Error("Application not found");
    }

    if (application.status !== "PENDING") {
      throw new Error("Application already reviewed");
    }

    const user = await User
      .findById(application.user)
      .session(session);

    if (!user) {
      throw new Error("User not found");
    }

    if (action === "APPROVED") {

      // 1️⃣ Update application
      application.status = "APPROVED";
      application.reviewedBy = adminId;
      application.reviewedAt = new Date();
      await application.save({ session });

      // 2️⃣ Upgrade user role
      user.role = "PARTNER";
      user.partnerStatus = "APPROVED";
      await user.save({ session });

    }

    if (action === "REJECTED") {

      if (!rejectionReason) {
        throw new Error("Rejection reason required");
      }

      application.status = "REJECTED";
      application.rejectionReason = rejectionReason;
      application.reviewedBy = adminId;
      application.reviewedAt = new Date();
      await application.save({ session });

      user.partnerStatus = "REJECTED";
      await user.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    return res.json({
      success: true,
      message: `Application ${action.toLowerCase()} successfully`
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};