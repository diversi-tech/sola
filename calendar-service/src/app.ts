import 'dotenv/config';
import express from 'express';
import dns from 'dns';
import router from './routes/meeting.route.js';
import { supabase } from './config/supabase.js';
import calendarRoutes from './routes/calendar.route.js';
import calendarAuthRoutes from './routes/calendarAuth.route.js';
import errorHandler from './middleware/error.middleware.js';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
if (dns?.setDefaultResultOrder) dns.setDefaultResultOrder('ipv4first');

const app = express();
app.use(express.json());

app.use((req, res, next) => {
    console.log(`[DEBUG] Incoming Request: ${req.method} ${req.path}`);
    next();
});

app.get('/', (req, res) => res.send('Server is up and running!'));

app.use('/api/calendar/auth', calendarAuthRoutes); 
app.use('/api/calendar/auth', calendarRoutes);    
app.use('/api/calendar', calendarRoutes); 

async function testConnection() {
    const { error } = await supabase.from('Meeting').select('*');
    console.log(error ? ' Connection failed:' + error.message : 'Connection successful');
}

testConnection();

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(` Server is running on port ${PORT}`);
});

app.use((req, res) => {
    console.log(`[404] Route not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ error: `Cannot ${req.method} ${req.originalUrl}` });
});
export default app;