import 'dotenv/config';
import oidc from './routes/oidc.routes.js';
import cors from 'cors';
import express from 'express';
import authRoutes from './routes/authorization.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from './config/strategies/passport.config.js'; 
import localAuthRoutes from './routes/localAuth.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors({
  origin:process.env.CLIENT_URL || 'http://localhost:5173', 
  credentials: true 
}));

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
app.use('/api/local-auth', localAuthRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});