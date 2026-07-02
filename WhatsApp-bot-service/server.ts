import express from 'express';
import dotenv from 'dotenv';
import webhookRoutes from './routes/webhook.routes';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

dotenv.config();

const app = express();
app.use(express.json());


const PORT = process.env.PORT || 5001;


app.use('/webhook', webhookRoutes);

app.listen(PORT, () => {
    console.log(`:rocket: Server is running on port ${PORT}`);
});
