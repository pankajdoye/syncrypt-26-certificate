import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import certificateRoutes from './routes/certificateRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting for security
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many verification attempts from this IP, please try again after 15 minutes.'
  }
});

// Serve assets (e.g. logo)
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Apply rate limiting to certificate API
app.use('/api/certificate', apiLimiter, certificateRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', event: 'SYNCRYPT’26 Certificate Portal API' });
});

// Serve frontend dist static files if built
const frontendDistPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
  console.log(`[SYNCRYPT’26 Server] Serving frontend dist from ${frontendDistPath}`);
}

// Start Server
app.listen(PORT, () => {
  console.log(`[SYNCRYPT’26 Server] Running on http://localhost:${PORT}`);
});
