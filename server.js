
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
      id: socket.id,
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
    
    // Send the current user list to the newly logged in admin
    io.to(socket.id).emit('updateUserList', Array.from(activeChats.values()));
  });

  // Handle messages
  socket.on('message', (message) => {
    const timestamp = new Date();
    
    if (socket.isAdmin && message.userId) {
      // Admin sending message to specific user
      io.emit('message', {
        text: message.text,
        isAdmin: true,
        userId: message.userId,
        timestamp: timestamp
      });
    } else {
      // Regular user sending message
      const user = activeChats.get(socket.id);
      if (user) {
        io.emit('message', {
          text: message.text,
          isAdmin: false,
          userId: socket.id,
          timestamp: timestamp
        });
      }
    }
  });

  // Handle typing status
  socket.on('typing', ({ isTyping, userId, isAdmin }) => {
    if (socket.isAdmin) {
      // Admin is typing - notify all users
      io.emit('userTyping', { isTyping, isAdmin: true });
    } else {
      // User is typing - notify admin
      io.emit('userTyping', { isTyping, userId: socket.id });
    }
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
