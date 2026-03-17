const router = require("express").Router();

const {
  getReports,
  createReport,
  updateReport,
  deleteReport,
  toggleComplete,
  getSingleReport,
} = require("../controllers/reportController");

router.get("/", getReports);
router.post("/", createReport);
router.put("/:id", updateReport);
router.delete("/:id", deleteReport);
router.patch("/:id/complete", toggleComplete);
router.get("/:id", getSingleReport);

module.exports = router;
