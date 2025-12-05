const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Get notifications' });
});

module.exports = router;
