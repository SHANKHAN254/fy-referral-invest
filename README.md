
# FY'S Investment Bot

A WhatsApp connection system using whatsapp-web.js with both frontend and backend components.

## Prerequisites

- Node.js v18 or higher
- npm or yarn package manager
- A WhatsApp account

## Installation

### Backend Setup

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

1. Install frontend dependencies:
```bash
npm install
```

2. Start the frontend application:
```bash
npm run dev
```

## Deployment Options

### 1. GitHub Codespaces

1. Open the repository in GitHub Codespaces
2. Run the backend:
```bash
cd backend
npm install
node server.js
```
3. In a new terminal, run the frontend:
```bash
cd frontend
npm install
npm run dev
```

### 2. Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `npm install`
4. Set start command: `node server.js`
5. Add environment variables if needed

### 3. Replit

1. Create a new Repl, importing your GitHub repository
2. In the Repl's Shell, install dependencies:
```bash
npm install
```
3. Click "Run" to start the application

## Features

- QR Code scanning for WhatsApp Web connection
- Phone number pairing with code generation
- Real-time connection status updates
- Automatic session restoration
- Message handling and auto-replies
- Multiple authentication methods

## Important Notes

- The WhatsApp Web session will be stored in a .wwebjs_auth folder
- The server must be running for the WhatsApp connection to work
- You may need to scan the QR code or enter the pairing code again if your session expires
- Make sure to handle the deployment environment's requirements (like Puppeteer dependencies)

## License

This project is licensed under the MIT License.
