const { AdminAction, User } = require('../models');

exports.getPendingTrainers = async (req, res) => {
  try {
    const trainers = await User.findAll({
      where: { role: 'trainer', is_approved: false },
      attributes: ['id', 'name', 'email', 'created_at']
    });
    res.json(trainers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};



exports.approveTrainer = async (req, res) => {
  try {
    const { id } = req.params;

    const trainer = await User.findOne({ where: { id, role: 'trainer' } });
    if (!trainer) return res.status(404).json({ error: 'Trainer not found' });

    trainer.is_approved = true;
    await trainer.save();

    await AdminAction.create({
      admin_id: req.user.id,
      action_type: 'approve_trainer',
      target_id: trainer.id,
      created_at: new Date()
    });

    res.json({ message: 'Trainer approved', trainer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};


// GET /admin/users
exports.getAllUsers = async (req, res) => {
  const users = await User.findAll({
    attributes: ['id', 'name', 'email', 'role', 'is_approved']
  });
  res.json(users);
};

// PUT /admin/users/:id/disable
exports.disableUser = async (req, res) => {
  const { id } = req.params;

  const [count, [updated]] = await User.update(
    { is_approved: false },
    { where: { id }, returning: true }
  );

  if (!count) return res.status(404).json({ error: 'User not found' });
  res.json(updated);
};

// DELETE /admin/users/:id
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  const deleted = await User.destroy({ where: { id } });

  if (!deleted) return res.status(404).json({ error: 'User not found' });
  res.json({ message: 'User deleted' });
};

