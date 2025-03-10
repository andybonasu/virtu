const { Course } = require("../models");
const { validationResult } = require("express-validator");

// 📌 Create a new course (Only Trainers)
exports.createCourse = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { title, description, price, thumbnail, duration, level, tags, prerequisites, objectives, structure } = req.body;

    const newCourse = await Course.create({
      title,
      description,
      price,
      thumbnail,
      duration,
      level,
      tags,
      prerequisites,
      objectives,
      structure,
      trainer_id: req.user.id, // Trainer creating the course
    });

    res.status(201).json(newCourse);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// 📌 Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// 📌 Get a course by ID
exports.getCourseById = async (req, res) => {
  try {
    console.log("Fetching course with ID:", req.params.id);

    // Return a response if Sequelize query takes more than 3 seconds
    const timeout = setTimeout(() => {
      console.log("Timeout reached: Sequelize might be stuck.");
      res.status(500).json({ error: "Database timeout error." });
    }, 3000);

    const course = await Course.findByPk(req.params.id);

    clearTimeout(timeout); // Clear timeout if query succeeds

    if (!course) {
      console.log("Course not found.");
      return res.status(404).json({ error: "Course not found" });
    }
    res.json(course);
  } catch (err) {
    console.error("Error fetching course:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};



// 📌 Update a course (Only Trainer who created it)
exports.updateCourse = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });

    if (course.trainer_id !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized: You can only update your own courses." });
    }

    // ✅ Restrict updates to only modifiable fields
    const allowedFields = ["title", "description", "price", "thumbnail", "duration", "level", "tags", "prerequisites", "objectives", "structure"];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    await course.update(updates);
    res.json({ message: "Course updated successfully", course });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// 📌 Delete a course (Only Trainer who created it)
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });

    if (course.trainer_id !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized: You can only delete your own courses." });
    }

    await course.destroy();
    res.json({ message: "Course deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
