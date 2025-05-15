const { Conversation, Message, User } = require('../models');
const { Op } = require('sequelize');

// 1. GET /conversations/user/:id
exports.getUserConversations = async (req, res) => {
  const { id } = req.params;
  const conversations = await Conversation.findAll({
    where: {
      [Op.or]: [{ user1_id: id }, { user2_id: id }]
    },
    order: [['last_updated', 'DESC']]
  });
  res.json(conversations);
};

// 2. POST /conversations
exports.startConversation = async (req, res) => {
  const { user1_id, user2_id } = req.body;

  const existing = await Conversation.findOne({
    where: {
      [Op.or]: [
        { user1_id, user2_id },
        { user1_id: user2_id, user2_id: user1_id }
      ]
    }
  });

  if (existing) return res.status(200).json(existing);

  const convo = await Conversation.create({
    user1_id,
    user2_id,
    last_updated: new Date()
  });

  res.status(201).json(convo);
};

// 3. GET /messages/:conversationId
exports.getMessages = async (req, res) => {
  const { conversationId } = req.params;
  const messages = await Message.findAll({
    where: { conversation_id: conversationId },
    order: [['timestamp', 'ASC']]
  });
  res.json(messages);
};

// 4. POST /messages
exports.sendMessage = async (req, res) => {
  const { conversation_id, message } = req.body;
  const sender_id = req.user.id;

  const msg = await Message.create({
    conversation_id,
    sender_id,
    message,
    timestamp: new Date(),
    is_read: false
  });

  await Conversation.update(
    { last_updated: new Date() },
    { where: { id: conversation_id } }
  );

  res.status(201).json(msg);
};

// 5. PUT /messages/:id/read
exports.markMessageRead = async (req, res) => {
  const { id } = req.params;

  const [count, [updated]] = await Message.update(
    { is_read: true },
    { where: { id }, returning: true }
  );

  if (!count) return res.status(404).json({ error: 'Message not found' });
  res.json(updated);
};

// 6. GET /admin/conversations
exports.getAllConversations = async (req, res) => {
  const convos = await Conversation.findAll({ order: [['last_updated', 'DESC']] });
  res.json(convos);
};

// 7. GET /admin/messages/:userId
exports.getMessagesByUser = async (req, res) => {
  const { userId } = req.params;

  const convos = await Conversation.findAll({
    where: {
      [Op.or]: [{ user1_id: userId }, { user2_id: userId }]
    }
  });

  const messages = await Message.findAll({
    where: {
      [Op.or]: convos.map(c => ({ conversation_id: c.id }))
    },
    order: [['timestamp', 'ASC']]
  });

  res.json(messages);
};

// 8. GET /admin/users/search
exports.searchUsers = async (req, res) => {
  const { query } = req.query;

  const users = await User.findAll({
    where: {
      [Op.or]: [
        { name: { [Op.iLike]: `%${query}%` } },
        { email: { [Op.iLike]: `%${query}%` } }
      ]
    },
    limit: 10
  });

  res.json(users);
};

// 9. POST /admin/messages/start
exports.adminStartMessage = async (req, res) => {
  const { target_user_id, message } = req.body;

  let convo = await Conversation.findOne({
    where: {
      [Op.or]: [
        { user1_id: req.user.id, user2_id: target_user_id },
        { user1_id: target_user_id, user2_id: req.user.id }
      ]
    }
  });

  if (!convo) {
    convo = await Conversation.create({
      user1_id: req.user.id,
      user2_id: target_user_id,
      last_updated: new Date()
    });
  }

  const msg = await Message.create({
    conversation_id: convo.id,
    sender_id: req.user.id,
    message,
    timestamp: new Date(),
    is_read: false
  });

  await convo.update({ last_updated: new Date() });

  res.status(201).json({ conversation: convo, message: msg });
};
