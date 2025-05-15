const { Submission } = require('../models');

// POST /sections/:id/submit
exports.submitResponse = async (req, res) => {
  const { id } = req.params; // section_id
  const { text_response, media_url } = req.body;

  try {
    const existing = await Submission.findOne({
      where: { section_id: id, client_id: req.user.id }
    });

    if (existing) {
      return res.status(409).json({ error: 'Submission already exists' });
    }

    const submission = await Submission.create({
      section_id: id,
      client_id: req.user.id,
      text_response,
      media_url,
      submitted_at: new Date()
    });

    res.status(201).json(submission);
  } catch (err) {
    res.status(500).json({ error: 'Submission failed' });
  }
};

// GET /sections/:id/submission/:clientId
exports.getSubmission = async (req, res) => {
  const { id, clientId } = req.params;

  try {
    const submission = await Submission.findOne({
      where: { section_id: id, client_id: clientId }
    });

    if (!submission) return res.status(404).json({ error: 'No submission found' });

    res.json(submission);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching submission' });
  }
};

// PUT /submissions/:id
exports.updateSubmission = async (req, res) => {
  const { id } = req.params;
  const { text_response, media_url } = req.body;

  try {
    const [count, [updated]] = await Submission.update(
      { text_response, media_url },
      {
        where: { id },
        returning: true
      }
    );

    if (!count) return res.status(404).json({ error: 'Submission not found' });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Error updating submission' });
  }
};
