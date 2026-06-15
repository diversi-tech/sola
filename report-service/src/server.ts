import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import employeeRoutes from './routes/employee.routes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/employees', employeeRoutes);

const port = process.env.PORT || 5003;

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
