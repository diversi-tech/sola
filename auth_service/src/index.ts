import 'dotenv/config';

import express from 'express';
import authRoutes from './routes/authorization.routes.js'; 
import { errorHandler } from './middlewares/errorHandler.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.use('/auth', authRoutes);

console.log("Check Env:", {
    port: process.env.PORT,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_ANON_KEY
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

app.use(errorHandler);