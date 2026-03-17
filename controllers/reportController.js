// /backend/controllers/reportController.js
const Report = require("../models/Report");
const mongoose = require("mongoose");

/**
 * Get all reports (latest first)
 */
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Get single report
 */
exports.getSingleReport = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid report ID",
      });
    }

    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    res.status(200).json({ success: true, data: report });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Create report — lahat ng naka-login
 */
exports.createReport = async (req, res) => {
  try {
    const { month } = req.body;

    // ✅ check kung may existing na report ang worker para sa month na ito
    const existing = await Report.findOne({
      createdBy: req.user._id,
      month: { $regex: new RegExp(month, "i") }, // case-insensitive
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `You already have a report for ${month}. Please edit your existing report instead.`,
      });
    }

    // ✅ i-attach kung sino ang gumawa
    const report = await Report.create({
      ...req.body,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, data: report });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: "Failed to create report",
      error: error.message,
    });
  }
};

/**
 * Update report
 * User — sarili lang niya
 * Admin — lahat
 */
exports.updateReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    // ✅ ownership check
    if (
      req.user.role !== "admin" &&
      report.createdBy?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this report",
      });
    }

    const updated = await Report.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: "Failed to update report",
      error: error.message,
    });
  }
};

/**
 * Delete report
 * User — sarili lang niya
 * Admin — lahat
 */
exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    // ✅ ownership check
    if (
      req.user.role !== "admin" &&
      report.createdBy?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this report",
      });
    }

    await Report.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Report deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete report",
    });
  }
};

/**
 * Toggle report completion — admin only
 */
exports.toggleComplete = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    const updated = await Report.findByIdAndUpdate(
      req.params.id,
      { completed: !report.completed },
      { new: true },
    );

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update report status",
    });
  }
};
