const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

// Get all channels for the current user
router.get('/channels', authMiddleware, async (req, res) => {
  try {
    // For now, return all team channels + DMs where user is involved
    // This is a simplified query
    const result = await pool.query(`
      SELECT * FROM chat_channels 
      WHERE channel_type = 'team' 
      OR (channel_type = 'direct' AND id IN (
        SELECT channel_id FROM chat_messages WHERE sender_id = $1
        -- Note: This logic for DMs needs a join table or better structure in future
        -- For MVP, we'll assume 'team' channels are visible to everyone
      ))
      ORDER BY name ASC
    `, [req.user.id]);

    // If no team channels exist, create default ones
    if (result.rows.length === 0) {
      await pool.query(`
        INSERT INTO chat_channels (name, description, channel_type, created_by_id)
        VALUES 
        ('general', 'General team discussion', 'team', $1),
        ('hiring', 'Hiring updates and news', 'team', $1),
        ('random', 'Non-work banter', 'team', $1)
      `, [req.user.id]);

      const newChannels = await pool.query("SELECT * FROM chat_channels WHERE channel_type = 'team'");
      return res.json(newChannels.rows);
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create a new channel
router.post('/channels', authMiddleware, async (req, res) => {
  try {
    const { name, description, type } = req.body;
    const newChannel = await pool.query(
      'INSERT INTO chat_channels (name, description, channel_type, created_by_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, type || 'team', req.user.id]
    );
    res.json(newChannel.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get messages for a channel
router.get('/channels/:channelId/messages', authMiddleware, async (req, res) => {
  try {
    const { channelId } = req.params;
    const result = await pool.query(`
      SELECT m.*, u.name as sender_name, u.avatar_url as sender_avatar
      FROM chat_messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.channel_id = $1
      ORDER BY m.created_at ASC
      LIMIT 100
    `, [channelId]);

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Send a message (HTTP fallback or for initial implementation)
router.post('/channels/:channelId/messages', authMiddleware, async (req, res) => {
  try {
    const { channelId } = req.params;
    const { text, mentions, attachments } = req.body;

    const newMessage = await pool.query(
      `INSERT INTO chat_messages (channel_id, sender_id, message_text, mentions, attachments) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [channelId, req.user.id, text, mentions || [], attachments || []]
    );

    // Fetch sender details to return complete object
    const sender = await pool.query('SELECT name, avatar_url FROM users WHERE id = $1', [req.user.id]);
    const messageWithSender = {
      ...newMessage.rows[0],
      sender_name: sender.rows[0].name,
      sender_avatar: sender.rows[0].avatar_url
    };

    // Emit socket event if io is attached to req
    if (req.io) {
      req.io.emit('message-received', messageWithSender);
    }

    res.json(messageWithSender);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
