import router from './routes/meeting.route.js';
import { supabase } from './config/supabase.js';
import dns from 'dns';
import express from 'express';



process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
if (dns && dns.setDefaultResultOrder) { dns.setDefaultResultOrder('ipv4first'); }

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

app.use('/api/meetings', router)

async function testConnection() {
  try {
    const { data, error } = await supabase.from('Meeting').select('*');
    if (error) {
      console.log('❌ החיבור נכשל (object):', error);
      try {
        console.log('❌ פרטי שגיאה:', JSON.stringify(error));
      } catch (_) {}
      return;
    }
    console.log('✅ החיבור הצליח');
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.log('❌ החיבור נכשל:', msg);
  }
}

testConnection();
const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
  console.log(`Server is running on port ${PORT}`);
})
export default app;
