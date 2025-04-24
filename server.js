
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(express.json());

// Create a WhatsApp client
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('Client connected');
  
  // If client is ready, let the frontend know
  if (client.info) {
    socket.emit('ready', { 
      name: client.info.pushname, 
      phone: client.info.wid.user 
    });
  }
  
  // Listen for pairing code request
  socket.on('requestPairingCode', async (data) => {
    try {
      console.log('Pairing code requested for:', data.phoneNumber);
      const code = await client.requestPairingCode(data.phoneNumber);
      socket.emit('pairingCode', { code });
    } catch (error) {
      console.error('Error generating pairing code:', error);
      socket.emit('error', { message: 'Failed to generate pairing code' });
    }
  });
  
  // Listen for disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// WhatsApp client events
client.on('qr', (qr) => {
  console.log('QR RECEIVED');
  qrcode.toDataURL(qr, (err, url) => {
    if (err) return console.log('Error generating QR code:', err);
    io.emit('qr', { url });
  });
});

client.on('ready', () => {
  console.log('Client is ready!');
  io.emit('ready', { 
    name: client.info.pushname, 
    phone: client.info.wid.user 
  });
});

client.on('authenticated', () => {
  console.log('AUTHENTICATED');
  io.emit('authenticated');
});

client.on('auth_failure', (msg) => {
  console.error('AUTHENTICATION FAILURE', msg);
  io.emit('auth_failure', { message: msg });
});

client.on('disconnected', (reason) => {
  console.log('Client was disconnected:', reason);
  io.emit('disconnected', { reason });
});

// Initialize the WhatsApp client
client.initialize().catch(err => {
  console.error('Error initializing WhatsApp client:', err);
});

// Start the server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
