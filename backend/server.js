import express from 'express';
import passport from 'passport';
import dotenv from 'dotenv';
import cors from 'cors';
// import dns from 'dns';
// dns.setServers(["8.8.8.8","1.1.1.1"]);

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import intelligenceRoutes from './routes/intelligenceRoutes.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/intelligence', intelligenceRoutes);

app.get('/', (req, res) => {
  res.send('DevMentor AI API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
