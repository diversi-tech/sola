import express from 'express';
import dotenv from 'dotenv';
import webhookRoutes from './routes/webhook.routes';
import messageRoutes from './routes/message.routes';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/messages', messageRoutes);

const PORT = process.env.PORT || 5001;

app.use('/webhook', webhookRoutes);

app.listen(PORT, () => {
    console.log(`:rocket: Server is running on port ${PORT}`);
});