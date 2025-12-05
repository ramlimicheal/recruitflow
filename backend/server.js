const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const authRoutes = require('./routes/auth');
const candidateRoutes = require('./routes/candidates');
const taskRoutes = require('./routes/tasks');
const chatRoutes = require('./routes/chat');
const notificationRoutes = require('./routes/notifications');
const activityRoutes = require('./routes/activities');
const userRoutes = require('./routes/users');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running', timestamp: new Date() });
});

// Socket.io event handlers
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('user-online', (userId) => {
    connectedUsers.set(userId, socket.id);
    console.log(`User ${userId} marked online`);
  });

  socket.on('join-channel', (channelId) => {
    socket.join(`channel-${channelId}`);
    console.log(`User ${socket.id} joined channel ${channelId}`);
  });

  socket.on('leave-channel', (channelId) => {
    socket.leave(`channel-${channelId}`);
    console.log(`User ${socket.id} left channel ${channelId}`);
  });

  socket.on('send-message', (messageData) => {
    console.log('Message received:', messageData);
    // If channelId is present, emit to that room
    if (messageData.channel_id) {
      io.to(`channel-${messageData.channel_id}`).emit('message-received', messageData);
    } else {
      // Fallback to global emit (or handle error)
      io.emit('message-received', messageData);
    }
  });

  socket.on('send-notification', (notificationData) => {
    console.log('Notification sent:', notificationData);
    if (notificationData.userId) {
      const userSocket = connectedUsers.get(notificationData.userId);
      if (userSocket) {
        io.to(userSocket).emit('notification-received', notificationData);
      }
    } else {
      io.emit('notification-received', notificationData);
    }
  });

  socket.on('activity-log', (activityData) => {
    console.log('Activity logged:', activityData);
    io.emit('activity-created', activityData);
  });

  socket.on('candidate-stage-changed', (stageData) => {
    console.log('Candidate stage changed:', stageData);
    io.emit('stage-updated', stageData);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    for (let [userId, socketId] of connectedUsers) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        break;
      }
    }
  });
});

// Pass io to routes
app.use((req, res, next) => {
  req.io = io;
  req.connectedUsers = connectedUsers;
  next();
});

const PORT = process.env.PORT || 5000;

// Try to load automation engine (optional, won't crash if not found)
let automationEngine = null;
try {
  const AutomationEngine = require('./services/automationEngine');
  automationEngine = new AutomationEngine(io);
  automationEngine.start();
  console.log('✅ Automation Engine: ACTIVE');
} catch (err) {
  console.log('⚠️  Automation Engine not available:', err.message);
}

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Shutting down gracefully...');
  if (automationEngine) automationEngine.stop();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = { app, io, server };
