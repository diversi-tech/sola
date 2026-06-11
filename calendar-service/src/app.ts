import express from 'express';

const app = express();

app.use(express.json());

app.get('/',(req,res) => {
  res.send('Server is up and running')
})

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
  console.log(`Server is running on port ${PORT}`);
})
