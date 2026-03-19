// /backend/controllers/reportController.js
const Report = require("../models/Report");
const mongoose = require("mongoose");

/**
 * Get all reports (latest first)
 * Supports query params: month, year, worker, area, church, page, limit
 */
exports.getReports = async (req, res) => {
  try {
    const {
      month,
      year,
      worker,
      area,
      church,
      page = 1,
      limit = 50,
    } = req.query;

    const query = {};

    if (month) query.month = { $regex: month, $options: "i" };
    if (year) query.year = parseInt(year); // ✅ exact year match
    if (worker) query.worker = { $regex: worker, $options: "i" };
    if (area) query.areaAssignment = { $regex: area, $options: "i" };
    if (church) query.churchName = { $regex: church, $options: "i" };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Report.countDocuments(query);

    const reports = await Report.find(query)
      .sort({ year: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: reports.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
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
    const { month, year } = req.body;

    const existing = await Report.findOne({
      createdBy: req.user._id,
      month: {
        $regex: month.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        $options: "i",
      },
      year: year || new Date().getFullYear(),
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `You already have a report for ${month} ${year}. Please edit your existing report instead.`,
      });
    }

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

    if (
      req.user.role !== "admin" &&
      report.createdBy?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this report",
      });
    }

    const { createdBy, completed, ...allowedUpdates } = req.body;
    const updated = await Report.findByIdAndUpdate(
      req.params.id,
      allowedUpdates,
      { new: true, runValidators: true },
    );

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
