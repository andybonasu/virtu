const { PublicCourse } = require('../models');

// POST /publicCourses
exports.submitPublicCourse = async (req, res) => {
  const { base_course_id, title, description, price, image_url } = req.body;

  try {
    const entry = await PublicCourse.create({
      base_course_id,
      trainer_id: req.user.id,
      title,
      description,
      price,
      image_url,
      is_approved: false
    });

    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit public course' });
  }
};

// GET /publicCourses/:id
exports.getPublicCourseById = async (req, res) => {
  const { id } = req.params;

  const course = await PublicCourse.findOne({
    where: { id, is_approved: true }
  });

  if (!course) return res.status(404).json({ error: 'Public course not found' });

  res.json(course);
};

// GET /admin/publicCourses/pending
exports.getPendingPublicCourses = async (req, res) => {
  const pending = await PublicCourse.findAll({ where: { is_approved: false } });
  res.json(pending);
};

// PUT /admin/publicCourses/:id/approve
exports.approvePublicCourse = async (req, res) => {
  const { id } = req.params;

  const [count, [updated]] = await PublicCourse.update(
    { is_approved: true },
    { where: { id }, returning: true }
  );

  if (!count) return res.status(404).json({ error: 'Course not found' });
  res.json(updated);
};

// PUT /admin/publicCourses/:id/reject
exports.rejectPublicCourse = async (req, res) => {
  const { id } = req.params;

  const deleted = await PublicCourse.destroy({ where: { id } });

  if (!deleted) return res.status(404).json({ error: 'Course not found' });

  res.json({ message: 'Rejected and deleted' });
};

// GET /publicCourses/me
exports.getMyPublicCourse = async (req, res) => {
  const result = await PublicCourse.findAll({ where: { trainer_id: req.user.id } });
  res.json(result);
};
