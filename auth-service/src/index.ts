import 'dotenv/config';
import passport from './config/strategies/google.strategy.js'; 
import express from 'express';
import authRoutes from './routes/authorization.routes.js';
import adminRoutes from './routes/admin.routes.js';
import cors from 'cors'; 
import { errorHandler } from './middlewares/errorHandler.js';
import session from 'express-session';
import localAuthRoutes from './routes/localAuth.routes.js';


const app = express();
app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
const PORT = process.env.PORT;
app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecret',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
// app.use('/api/auth', oidc);
app.use('/api/local-auth', localAuthRoutes);

console.log("Check Env:", {
    port: process.env.PORT,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_ANON_KEY
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

app.use(errorHandler);

