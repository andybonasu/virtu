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
