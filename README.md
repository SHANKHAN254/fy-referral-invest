
# FY'S Investment Bot

A WhatsApp connection system for the FY'S Investment Bot using whatsapp-web.js.

## Setup Instructions

### Backend Setup (Required)

1. Install backend dependencies:

```bash
npm install express socket.io whatsapp-web.js qrcode
```

2. Start the backend server:

```bash
node server.js
```

The server will run on port 8000 by default.

### Frontend Setup

The frontend React application will connect to the backend server via WebSockets.

1. Start the frontend application:

```bash
npm run dev
```

## How It Works

This application uses whatsapp-web.js to connect to WhatsApp Web and provides two authentication methods:

1. QR Code scanning - Generates a QR code that can be scanned with your WhatsApp app
2. Phone number pairing - Generates a pairing code that you can enter in your WhatsApp app

The backend server handles the WhatsApp Web session and communicates with the frontend via WebSockets.

## Important Notes

- The WhatsApp Web session will be stored in a .wwebjs_auth folder in the backend server directory
- The server must be running for the WhatsApp connection to work
- You may need to scan the QR code or enter the pairing code again if your session expires
