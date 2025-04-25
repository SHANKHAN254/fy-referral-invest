
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(express.json());

// Store active chats and admin status
const activeChats = new Map();
let adminOnline = false;

io.on('connection', (socket) => {
  console.log('Client connected');

  // Handle user registration
  socket.on('register', (userData) => {
    activeChats.set(socket.id, {
      ...userData,
      messages: [],
      isAdmin: false
    });
    socket.emit('registered');
    io.emit('updateUserList', Array.from(activeChats.values()));
  });

  // Handle admin login
  socket.on('adminLogin', () => {
    socket.isAdmin = true;
    adminOnline = true;
    io.emit('adminStatus', { online: true });
  });

  // Handle messages
  socket.on('message', (message) => {
    const user = activeChats.get(socket.id);
    if (user || socket.isAdmin) {
      io.emit('message', {
        text: message.text,
        isAdmin: socket.isAdmin,
        userId: message.userId,
        timestamp: new Date()
      });
    }
  });

  // Handle typing status
  socket.on('typing', ({ isTyping, userId }) => {
    io.emit('userTyping', { isTyping, userId });
  });

  socket.on('disconnect', () => {
    if (socket.isAdmin) {
      adminOnline = false;
      io.emit('adminStatus', { online: false });
    } else {
      activeChats.delete(socket.id);
      io.emit('updateUserList', Array.from(activeChats.values()));
    }
  });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
