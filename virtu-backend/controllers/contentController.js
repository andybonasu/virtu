const { Section, Block } = require('../models');

// 1. POST /assignedCourses/:id/sections
exports.addSectionToAssignedCourse = async (req, res) => {
  const { id } = req.params; // assigned_course_id
  const { title, position } = req.body;

  try {
    const section = await Section.create({
      assigned_course_id: id,
      title,
      position
    });
    res.status(201).json(section);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create section' });
  }
};

// 2. GET /assignedCourses/:id/sections
exports.getSectionsForAssignedCourse = async (req, res) => {
  const { id } = req.params;

  try {
    const sections = await Section.findAll({
      where: { assigned_course_id: id },
      order: [['position', 'ASC']]
    });
    res.json(sections);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sections' });
  }
};

// 3. POST /sections/:id/blocks
exports.addBlockToSection = async (req, res) => {
  const { id } = req.params; // section_id
  const { text_content, media_url } = req.body;

  try {
    const block = await Block.create({
      section_id: id,
      text_content,
      media_url
    });
    res.status(201).json(block);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create block' });
  }
};

// 4. GET /sections/:id/blocks
exports.getBlocksForSection = async (req, res) => {
  const { id } = req.params;

  try {
    const blocks = await Block.findAll({
      where: { section_id: id },
      order: [['created_at', 'ASC']]
    });
    res.json(blocks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blocks' });
  }
};

// 5. PUT /blocks/:id
exports.updateBlock = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const [count, [updatedBlock]] = await Block.update(updates, {
      where: { id },
      returning: true
    });

    if (!count) return res.status(404).json({ error: 'Block not found' });
    res.json(updatedBlock);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update block' });
  }
};

// 6. DELETE /blocks/:id
exports.deleteBlock = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Block.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: 'Block not found' });
    res.json({ message: 'Block deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete block' });
  }
};
