const express = require("express");
const { body, param } = require("express-validator");
const { authenticateToken } = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");
const validate = require("../middleware/validate");
const {
  createCourseSettings,
  getCourseSettings,
  updateCourseSettings,
  deleteCourseSettings,
  getAllCourseSettings,
} = require("../controllers/courseSettingsController");

const router = express.Router();

// 📌 Create Course Settings (Only Trainers)
router.post(
  "/",
  authenticateToken,
  authorize("trainer"),
  validate([
    body("course_id").isUUID().withMessage("Valid course ID required"), // ✅ Use `course_id`
    body("configType").isIn(["day_plan", "reps_sets", "module_config", "custom"]).withMessage("Invalid config type"),
    body("configKey").notEmpty().withMessage("Config key is required"),
    body("configValue").isObject().withMessage("Config value must be a JSON object"),
  ]),
  createCourseSettings
);

// 📌 Get Course Settings by Course ID (Trainer & Clients)
router.get("/:course_id", getCourseSettings);

// 📌 Update a Specific Course Setting (Only Trainers)
router.put(
  "/:id",
  authenticateToken,
  authorize("trainer"),
  validate([
    param("id").isUUID().withMessage("Valid setting ID required"),
    body("configType").optional().isIn(["day_plan", "reps_sets", "module_config", "custom"]),
    body("configKey").optional().notEmpty(),
    body("configValue").optional().isObject(),
  ]),
  updateCourseSettings
);

// 📌 Delete a Specific Course Setting (Only Trainers)
router.delete("/:id", authenticateToken, authorize("trainer"), validate([param("id").isUUID()]), deleteCourseSettings);

// 📌 Get All Course Settings (Admin Only)
router.get("/", authenticateToken, authorize("admin"), getAllCourseSettings);

module.exports = router;
