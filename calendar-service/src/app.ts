import express from 'express';
import calendarRoutes from './routes/meeting.route.js';
import { supabase } from './config/supabase.js';
import dns from 'dns';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
if (dns?.setDefaultResultOrder) dns.setDefaultResultOrder('ipv4first');

const app = express();
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
    console.log(`📍 ${req.method} ${req.path}`);
    next();
});

app.get('/', (req, res) => res.send('Server is up and running!'));

// רק route אחד לcalendar — מחקי את /api/meetings אם הוא אותו קובץ
app.use('/api/calendar', calendarRoutes);

async function testConnection() {
    const { error } = await supabase.from('Meeting').select('*');
    console.log(error ? '❌ חיבור נכשל:' + error.message : '✅ החיבור הצליח');
}

testConnection();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

export default app;