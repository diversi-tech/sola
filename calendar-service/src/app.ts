import 'dotenv/config';
import express from 'express';
import dns from 'dns';

import calendarRoutes from './routes/meeting.route.js';
import calendarAuthRoutes from './routes/calendarAuth.route.js';

import { supabase } from './config/supabase.js';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
if (dns?.setDefaultResultOrder) dns.setDefaultResultOrder('ipv4first');

const app = express();
app.use(express.json());

app.use((req, res, next) => {
    console.log(`📍 ${req.method} ${req.path}`);
    next();
});

app.get('/', (req, res) => res.send('Server is up and running!'));

app.use('/api/meetings', calendarRoutes);
app.use('/api/calendar/auth', calendarAuthRoutes);


async function testConnection() {
    const { error } = await supabase.from('Meeting').select('*');
    console.log(error ? '❌ חיבור נכשל:' + error.message : '✅ החיבור הצליח');
}

testConnection();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 השרת רץ ומקשיב על פורט ${PORT}`);
});

export default app;