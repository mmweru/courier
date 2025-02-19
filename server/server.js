import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { WebSocketServer } from 'ws';
import dbConnect from './config/dbConnect.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { initAdmin } from './scripts/initAdmin.js';

// Load environment variables first
dotenv.config();

// Global WebSocket clients set
const clients = new Set();

// Broadcast function for real-time updates
export const broadcast = (data) => {
  clients.forEach((client) => {
    if (client.readyState === 1) { // WebSocket.OPEN
      client.send(JSON.stringify(data));
    }
  });
};

// Connect to database and start server
const startServer = async () => {
  try {
    // Connect to database
    await dbConnect();
    
    // Initialize admin user after successful database connection
    await initAdmin();
    
    const app = express();
    
    // Middleware
    app.use(express.json());
    app.use(cors());
    app.use(cookieParser());
    
    // Routes
    app.use("/api/auth", authRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/orders", orderRoutes);
    
    // Start the HTTP server
    const PORT = process.env.PORT || 7001;
    const server = app.listen(PORT, () => {
      console.log(`Server is running at port ${PORT}`);
    });

    // Initialize WebSocket server
    const wss = new WebSocketServer({ server });

    wss.on('connection', (ws) => {
      clients.add(ws);
      console.log('New WebSocket client connected');

      ws.on('close', () => {
        clients.delete(ws);
        console.log('Client disconnected');
      });
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();