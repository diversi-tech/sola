import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import audioRouter from './routes/audio.routes';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;


app.use(cors());         
app.use(express.json());  


app.use('/api/audio', audioRouter);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});