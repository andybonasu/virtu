const { Section, Block } = require('../models');

// 1. POST /assignedCourses/:id/sections
exports.addSectionToAssignedCourse = async (req, res) => {
  const { id } = req.params; // assigned_course_id
  const { title, position } = req.body;

  try {
    const section = await Section.create({
      assigned_course_id: id,
      title,
      position,
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
      order: [['position', 'ASC']],
    });
    res.json(sections);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sections' });
  }
};

// 3. PUT /sections/:id
exports.updateSection = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const [count, [updatedSection]] = await Section.update(updates, {
      where: { id },
      returning: true,
    });

    if (!count) return res.status(404).json({ error: 'Section not found' });
    res.json(updatedSection);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update section' });
  }
};

// 4. PUT /assignedCourses/:id/sections/reorder
exports.reorderSections = async (req, res) => {
  const { id } = req.params;
  const { order } = req.body; // [{ id: sectionId, position: newPosition }, ...]

  if (!Array.isArray(order)) {
    return res.status(400).json({ error: 'Invalid input format' });
  }

  const transaction = await Section.sequelize.transaction();
  try {
    for (const item of order) {
      await Section.update(
        { position: item.position },
        {
          where: {
            id: item.id,
            assigned_course_id: id,
          },
          transaction,
        }
      );
    }

    await transaction.commit();
    res.json({ message: 'Sections reordered successfully' });
  } catch (err) {
    await transaction.rollback();
    console.error(err);
    res.status(500).json({ error: 'Failed to reorder sections' });
  }
};

// 5. DELETE /sections/:id
exports.deleteSection = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Section.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: 'Section not found' });
    res.json({ message: 'Section deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete section' });
  }
};

// 6. POST /sections/:id/blocks
exports.addBlockToSection = async (req, res) => {
  const { id } = req.params;
  const { text_content, media_url } = req.body;

  try {
    const block = await Block.create({
      section_id: id,
      text_content,
      media_url,
    });
    res.status(201).json(block);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create block' });
  }
};

// 7. GET /sections/:id/blocks
exports.getBlocksForSection = async (req, res) => {
  const { id } = req.params;

  try {
    const blocks = await Block.findAll({
      where: { section_id: id },
      order: [['created_at', 'ASC']],
    });
    res.json(blocks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blocks' });
  }
};

// 8. PUT /blocks/:id
exports.updateBlock = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const [count, [updatedBlock]] = await Block.update(updates, {
      where: { id },
      returning: true,
    });

    if (!count) return res.status(404).json({ error: 'Block not found' });
    res.json(updatedBlock);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update block' });
  }
};

// 9. DELETE /blocks/:id
exports.deleteBlock = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Block.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: 'Block not found' });
    res.json({ message: 'Block deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete block' });
  }
};
