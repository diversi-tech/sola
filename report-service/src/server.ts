import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import reportRoutes from './routes/report.routes.js';
import categoryRoutes from './routes/category.routes.js'; 
import employeeRoutes from './routes/employee.routes.js';

const app = express();
app.use(cors({ origin: 'https://v2.dashboard-client-d7t.pages.dev' }));
app.use(express.json());

app.use('/api/reports', reportRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/employees', employeeRoutes);

const port = process.env.PORT || 5003;

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});