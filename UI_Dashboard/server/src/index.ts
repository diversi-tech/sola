import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
const PORT = process.env.PORT || 5006;

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});