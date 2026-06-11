import 'dotenv/config';
import express from 'express';
import authRoutes from './routes/authorization.routes.js'; 
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.use('/auth', authRoutes);


app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

app.use(errorHandler);