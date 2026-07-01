import 'dotenv/config';
import express from 'express';
import employeeRoutes from './routes/employeeRoutes.js';
import reportCategoryRoutes from './routes/reportCategoryRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import meetingRoutes from './routes/meetingRoutes.js';
import authorizedUserRoutes from './routes/authorizedUserRoutes.js';
import cors from 'cors'; 
const app = express();
const PORT = 5006;
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'] 
}));app.use(express.json());
app.use('/api/meetings', meetingRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/authorized-users', authorizedUserRoutes);
app.use('/api/report-categories', reportCategoryRoutes);
app.use('/api/employees', employeeRoutes);

console.log("Check Env:", {
    port: process.env.PORT,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_ANON_KEY
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

