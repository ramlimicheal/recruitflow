const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Get candidates' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create candidate' });
});

module.exports = router;
