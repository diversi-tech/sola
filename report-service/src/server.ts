import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import reportRoutes from './routes/report.routes.js';
import categoryRoutes from './routes/category.routes.js';   

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/reports', reportRoutes);

app.use('/api/categories', categoryRoutes);

const port = process.env.PORT || 5003;

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});