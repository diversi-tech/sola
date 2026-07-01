import 'dotenv/config';
import express from 'express';
import dns from 'dns';
import router from './routes/meeting.route.js';
import { supabase } from './config/supabase.js';
import calendarRoutes from './routes/calendar.route.js';
import calendarAuthRoutes from './routes/calendarAuth.route.js';
import errorHandler from './middleware/error.middleware.js';
import cors from 'cors'

if (dns?.setDefaultResultOrder) dns.setDefaultResultOrder('ipv4first');

const app = express();
app.use(express.json());

const corsOptions = {
  origin: ['http://localhost:5173','https://YOUR_DASHBOARD_URL.onrender.com'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));
app.get('/', (req, res) => res.send('Server is up and running!'));

app.use('/api/calendar/auth', calendarAuthRoutes);
app.use('/auth', calendarRoutes);
app.use('/api/meetings', router);
app.use(errorHandler);

app.use((req, res) => {
    console.log(`[404] Route not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ error: `Cannot ${req.method} ${req.originalUrl}` });
});


async function testConnection() {
    const { error } = await supabase.from('Meeting').select('*');
    console.log(error ? ' Connection failed:' + error.message : 'Connection successful');
}

testConnection();

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(` Server is running on port ${PORT}`);
});


export default app;