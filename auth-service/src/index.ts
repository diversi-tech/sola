import 'dotenv/config';
import passport from './config/strategies/google.strategy.js'; 
import oidc from './routes/oidc.routes.js';
import express from 'express';
import authRoutes from './routes/authorization.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import dotenv from 'dotenv';
import session from 'express-session';

dotenv.config();

const app = express();
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
app.use('/api/auth', oidc);

console.log("Check Env:", {
    port: process.env.PORT,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_ANON_KEY
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

