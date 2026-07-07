import 'dotenv/config';
import express from 'express';
import authRoutes from './routes/authorization.routes.js';
import adminRoutes from './routes/admin.routes.js';
import cors from 'cors'; 

import { errorHandler } from './middlewares/errorHandler.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
const PORT = process.env.PORT;

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
console.log("Check Env:", {
    port: process.env.PORT,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_ANON_KEY
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

app.use(errorHandler);

