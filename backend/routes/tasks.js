const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Get tasks' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create task' });
});

module.exports = router;
