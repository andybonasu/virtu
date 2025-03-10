const express = require("express");
const { body, param, validationResult } = require("express-validator");
const { authenticateToken } = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");
const validate = require("../middleware/validate"); // ✅ Import validate middleware
const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

const router = express.Router();

// 📌 Get all courses
router.get("/", getAllCourses);

// 📌 Get a course by ID (Added validate middleware)
//router.get("/:id", [param("id").isUUID().withMessage("Valid course ID required"), validate], getCourseById);
//router.get("/:id", getCourseById);
router.get(
  "/:id",
  [
    param("id").isUUID().withMessage("Valid course ID required"),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ],
  getCourseById
);



// 📌 Create a new course (Only Trainers)
router.post(
  "/",
  authenticateToken,
  authorize("trainer"),
  validate([
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("price").isFloat({ gt: 0 }).withMessage("Price must be a positive number"),
    body("thumbnail").optional().isString().withMessage("Thumbnail URL must be a string"),
    body("duration").optional().isInt({ min: 1 }).withMessage("Duration must be positive"),
    body("level").isIn(["Beginner", "Intermediate", "Advanced"]).withMessage("Invalid level"),
    body("tags").optional().isArray().withMessage("Tags must be an array"),
    body("prerequisites").optional().isString(),
    body("objectives").optional().isString(),
    body("structure").optional().isObject().withMessage("Structure must be a JSON object"),
  ]),
  createCourse
);

// 📌 Update a course (Only Trainers who created it)
router.put(
  "/:id",
  authenticateToken,
  authorize("trainer"),
  validate([
    param("id").isUUID().withMessage("Valid course ID required"),
    body("title").optional().notEmpty(),
    body("description").optional().notEmpty(),
    body("price").optional().isFloat({ gt: 0 }),
    body("thumbnail").optional().isString(),
    body("duration").optional().isInt({ min: 1 }),
    body("level").optional().isIn(["Beginner", "Intermediate", "Advanced"]),
    body("tags").optional().isArray(),
    body("prerequisites").optional().isString(),
    body("objectives").optional().isString(),
    body("structure").optional().isObject(),
  ]),
  updateCourse // ✅ Ownership check should be handled inside controller
);

// 📌 Delete a course (Only Trainers who created it)
router.delete("/:id", authenticateToken, authorize("trainer"), validate([param("id").isUUID()]), deleteCourse);

module.exports = router;
