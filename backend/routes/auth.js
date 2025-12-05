const express = require('express');
const router = express.Router();

// Demo credentials map
const demoUsers = {
  'ceo@recruitflow.com': { name: 'CEO User', role: 'CEO' },
  'manager@recruitflow.com': { name: 'Manager User', role: 'Manager' },
  'recruiter@recruitflow.com': { name: 'Recruiter User', role: 'Recruiter' }
};

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const user = demoUsers[email];
  if (!user || password !== 'password123') {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = 'demo-token-' + Date.now();
  res.json({
    message: 'Login successful',
    user: {
      id: email.split('@')[0],
      email,
      name: user.name,
      role: user.role
    },
    token
  });
});

router.post('/register', (req, res) => {
  const { email, name, password, role } = req.body;
  const token = 'demo-token-' + Date.now();
  res.json({
    message: 'Register successful',
    user: { id: Math.random(), email, name, role },
    token
  });
});

router.get('/me', (req, res) => {
  res.json({ message: 'Get user endpoint' });
});

module.exports = router;
