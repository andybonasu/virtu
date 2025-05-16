const { BaseCourse, AssignedCourse, User } = require('../models');


// 1. Create base course (Trainer)
exports.createBaseCourse = async (req, res) => {
  if (req.user.role !== 'trainer') {
    return res.status(403).json({ error: 'Only trainers can create base courses' });
  }

  const { title, description } = req.body;

  try {
    const course = await BaseCourse.create({
      trainer_id: req.user.id,
      title,
      description
    });
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create course' });
  }
};

// 2. Get base course by ID
exports.getBaseCourseById = async (req, res) => {
  const { id } = req.params;
  const course = await BaseCourse.findByPk(id);
  if (!course) return res.status(404).json({ error: 'Course not found' });
  res.json(course);
};

// 3. Get all base courses for a trainer
exports.getTrainerCourses = async (req, res) => {
  const { trainerId } = req.params;
  const courses = await BaseCourse.findAll({ where: { trainer_id: trainerId } });
  res.json(courses);
};

// 4. Admin assigns a course to a client
exports.assignCourseToClient = async (req, res) => {
  const { base_course_id, trainer_id, client_id, is_paid } = req.body;

  try {
    const assigned = await AssignedCourse.create({
      base_course_id,
      trainer_id,
      client_id,
      is_paid: is_paid ?? false
    });
    res.status(201).json(assigned);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Assignment failed' });
  }
};

// 5. Get assigned course for a client
exports.getAssignedCourseByClientId = async (req, res) => {
  const { clientId } = req.params;

  try {
    const assigned = await AssignedCourse.findOne({
      where: { client_id: clientId },
      include: [
        {
          model: BaseCourse,
          attributes: ['title']
        }
      ]
    });

    if (!assigned) return res.status(404).json({ error: 'No course found for this client' });

    const result = assigned.toJSON();
    result.base_course_title = assigned.BaseCourse?.title || null;

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Fetch failed' });
  }
};


// 6. Update assigned course (Admin or Trainer)
exports.updateAssignedCourse = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const [count, [updated]] = await AssignedCourse.update(updates, {
      where: { id },
      returning: true
    });

    if (!count) return res.status(404).json({ error: 'Course not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
};



exports.getTrainerClients = async (req, res) => {
  if (req.user.role !== 'trainer') {
    return res.status(403).json({ error: 'Only trainers can access this' });
  }

  try {
    const assignments = await AssignedCourse.findAll({
      where: { trainer_id: req.user.id },
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['id', 'name', 'email']
        },
        {
          model: BaseCourse,
          attributes: ['title']
        }
      ]
    });

    const response = assignments.map(ac => ({
      client: ac.client,
      course_title: ac.BaseCourse.title,
      is_paid: ac.is_paid
    }));

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.getTrainerForClient = async (req, res) => {
  const { clientId } = req.params;

  try {
    const assignment = await AssignedCourse.findOne({
      where: { client_id: clientId },
      include: {
        model: User,
        as: 'trainer',
        attributes: [
          'id',
          'name',
          'email',
          'background_url',
          'bio',
          'instagram_handle',
          'youtube_link',
          'trainer_logo'
        ]
      }
    });

    if (!assignment || !assignment.trainer) {
      return res.status(404).json({ error: 'Trainer not found for this client' });
    }

    res.json(assignment.trainer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch trainer info' });
  }
};

