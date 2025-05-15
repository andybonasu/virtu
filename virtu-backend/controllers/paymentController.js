const { Payment } = require('../models');
const { v4: uuidv4 } = require('uuid');

// POST /payments/initiate
exports.initiatePayment = async (req, res) => {
  const { trainer_id, assigned_course_id, amount } = req.body;

  // Generate dummy payment link (placeholder)
  const mockPaymentLink = `https://payment.virtu.com/pay/${uuidv4()}`;

  // Record initiation (status: pending)
  const payment = await Payment.create({
    client_id: req.user.id,
    trainer_id,
    assigned_course_id,
    amount,
    status: 'pending'
  });

  res.status(201).json({
    payment_id: payment.id,
    payment_link: mockPaymentLink
  });
};

// POST /payments/confirm
exports.confirmPayment = async (req, res) => {
  const { payment_id } = req.body;

  const [count, [updated]] = await Payment.update(
    { status: 'paid' },
    { where: { id: payment_id }, returning: true }
  );

  if (!count) return res.status(404).json({ error: 'Payment not found' });

  res.json({ message: 'Payment confirmed', payment: updated });
};

// GET /payments/client/:id
exports.getClientPayments = async (req, res) => {
  const { id } = req.params;

  const result = await Payment.findAll({
    where: { client_id: id }
  });

  res.json(result);
};

// GET /payments/trainer/:id
exports.getTrainerPayments = async (req, res) => {
  const { id } = req.params;

  const result = await Payment.findAll({
    where: { trainer_id: id }
  });

  res.json(result);
};

// GET /admin/payments
exports.getAllPayments = async (req, res) => {
  const result = await Payment.findAll();
  res.json(result);
};
