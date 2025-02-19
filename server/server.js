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
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Global WebSocket clients map with heartbeat tracking
const clients = new Map();

export const broadcast = (data) => {
  clients.forEach((client) => {
    if (client.ws.readyState === 1) {
      client.ws.send(JSON.stringify(data));
    }
  });
};

const heartbeat = (ws) => {
  const client = clients.get(ws);
  if (client) {
    client.isAlive = true;
  }
};

const checkConnections = () => {
  clients.forEach((client, ws) => {
    if (!client.isAlive) {
      clients.delete(ws);
      return ws.terminate();
    }
    client.isAlive = false;
    ws.ping();
  });
};

const startServer = async () => {
  try {
    await dbConnect();
    await initAdmin();
    
    const app = express();
    
    // Security middleware
    app.use(helmet({
      contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false
    }));
    
    app.use(express.json());
    app.use(cookieParser());
    
    // CORS configuration with more specific options
    app.use(cors({
      origin: (origin, callback) => {
        const allowedOrigins = [
          process.env.FRONTEND_URL,
          'http://localhost:5173',
          // Add other allowed origins as needed
        ];
        
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));
    
    // API routes
    app.use("/api/auth", authRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/orders", orderRoutes);
    
    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
      });
    });
    
    // Serve static files in production
    if (process.env.NODE_ENV === 'production') {
      const distPath = path.join(__dirname, '../dist'); // Path to the frontend build folder
      
      // Serve static files with caching headers
      app.use(express.static(distPath, {
        maxAge: '1d',
        etag: true
      }));
      
      // Fallback to index.html for client-side routing
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
    
    const PORT = process.env.PORT || 7001;
    const server = app.listen(PORT, () => {
      console.log(`Server is running at port ${PORT} in ${process.env.NODE_ENV} mode`);
    });

    // WebSocket server setup with heartbeat
    const wss = new WebSocketServer({ server });

    wss.on('connection', (ws, req) => {
      clients.set(ws, { 
        ws,
        isAlive: true,
        connectedAt: new Date()
      });
      
      console.log(`New WebSocket client connected from ${req.socket.remoteAddress}`);

      ws.on('pong', () => heartbeat(ws));
      
      ws.on('message', (data) => {
        try {
          // Handle incoming messages if needed
          const message = JSON.parse(data);
          console.log('Received message:', message);
        } catch (error) {
          console.error('Error processing message:', error);
        }
      });

      ws.on('close', () => {
        clients.delete(ws);
        console.log('Client disconnected');
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        clients.delete(ws);
      });
    });

    // Heartbeat interval
    const interval = setInterval(() => {
      checkConnections();
    }, 30000);

    wss.on('close', () => {
      clearInterval(interval);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});

startServer();