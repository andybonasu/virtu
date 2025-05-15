const { User } = require('../models');
const bcrypt = require('bcrypt');

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Basic validation
    if (!name || !email || !password || !['trainer', 'client'].includes(role)) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    // Check duplicate
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password_hash: hashedPassword,
      role,
      is_approved: false
    });

    return res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      is_approved: newUser.is_approved
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  if (user.role !== 'admin' && !user.is_approved) {
    return res.status(403).json({ error: 'Trainer not approved yet' });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.json({ token });
};

exports.logout = async (req, res) => {
    // Client deletes token on logout
    return res.json({ message: 'Logged out successfully (client must delete token)' });
  };

  exports.getMe = async (req, res) => {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'role', 'is_approved', 'background_url']
    });
  
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
  
    return res.json(user);
  };

  exports.addAdmin = async (req, res) => {
    const { name, email, password, secret } = req.body;
  
    if (secret !== process.env.ADMIN_CREATION_SECRET) {
      return res.status(403).json({ error: 'Invalid secret key' });
    }
  
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already in use' });
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const newAdmin = await User.create({
      name,
      email,
      password_hash: hashedPassword,
      role: 'admin',
      is_approved: true
    });
  
    return res.status(201).json({
      id: newAdmin.id,
      name: newAdmin.name,
      email: newAdmin.email,
      role: newAdmin.role
    });
  };
  
  exports.updateUser = async (req, res) => {
    const { id } = req.params;
  
    if (req.user.id !== id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
  
    const updates = {};
  
    if (req.body.name) updates.name = req.body.name;
    if (req.body.background_url && req.user.role === 'trainer') {
      updates.background_url = req.body.background_url;
    }
  
    const [rows, [updatedUser]] = await User.update(updates, {
      where: { id },
      returning: true
    });
  
    res.json(updatedUser);
  };
  