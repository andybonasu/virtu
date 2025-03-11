const { CourseSetting, Course } = require("../models");
const { validationResult } = require("express-validator");

// 📌 Create Course Settings (Only Trainers)
exports.createCourseSettings = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { course_id, configType, configKey, configValue } = req.body;

    // Ensure the course exists and the trainer owns it
    const course = await Course.findByPk(course_id);
    if (!course) return res.status(404).json({ error: "Course not found" });
    if (course.trainer_id !== req.user.id) return res.status(403).json({ error: "Unauthorized" });

    const newSetting = await CourseSetting.create({
      course_id, // ✅ Using `course_id` to match the database schema
      configType,
      configKey,
      configValue,
    });

    res.status(201).json({ message: "Course setting created successfully", setting: newSetting });
  } catch (error) {
    console.error("🔥 Error creating course setting:", error.message);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// 📌 Get Course Settings by Course ID (Trainer & Clients)
exports.getCourseSettings = async (req, res) => {
  try {
    console.log("Fetching settings for course ID:", req.params.course_id); // Debugging Log

    const settings = await CourseSetting.findAll({ where: { course_id: req.params.course_id } });

    if (!settings.length) {
      console.log("❌ No settings found for this course.");
      return res.status(404).json({ error: "No settings found for this course" });
    }

    console.log("✅ Settings retrieved successfully:", settings);
    res.json(settings);
  } catch (error) {
    console.error("🔥 Error fetching course settings:", error.message);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// 📌 Update Course Setting (Only Trainers)
exports.updateCourseSettings = async (req, res) => {
  console.log("🚀 Update Course Setting API Hit");
  console.log("🔹 Setting ID:", req.params.id);
  console.log("🔹 Request Body:", req.body);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("❌ Validation Failed:", errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const updates = req.body;

    // Find the specific setting
    const setting = await CourseSetting.findByPk(id);
    if (!setting) {
      console.log("❌ Course setting not found");
      return res.status(404).json({ error: "Course setting not found" });
    }

    // Ensure the trainer owns the course related to the setting
    const course = await Course.findByPk(setting.course_id);
    if (!course || course.trainer_id !== req.user.id) {
      console.log("❌ Unauthorized Access");
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Update setting
    await setting.update(updates);
    console.log("✅ Course setting updated successfully", setting);

    res.json({ message: "Course setting updated successfully", setting });
  } catch (error) {
    console.error("🔥 Server Error:", error.message);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// 📌 Delete Course Setting (Only Trainers)
exports.deleteCourseSettings = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the specific setting
    const setting = await CourseSetting.findByPk(id);
    if (!setting) return res.status(404).json({ error: "Course setting not found" });

    // Ensure the trainer owns the course related to the setting
    const course = await Course.findByPk(setting.course_id);
    if (!course) return res.status(404).json({ error: "Course not found" });
    if (course.trainer_id !== req.user.id) return res.status(403).json({ error: "Unauthorized" });

    // Delete setting
    await setting.destroy();
    res.json({ message: "Course setting deleted successfully." });
  } catch (error) {
    console.error("🔥 Server Error:", error.message);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// 📌 Get All Course Settings (Admin Only)
exports.getAllCourseSettings = async (req, res) => {
  try {
    const settings = await CourseSetting.findAll();
    if (!settings.length) return res.status(404).json({ error: "No course settings found" });

    res.json(settings);
  } catch (error) {
    console.error("🔥 Server Error:", error.message);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
