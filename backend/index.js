import express from 'express';
import {connectDB} from './lib/db.js';
import authRoute from './routes/authRoute.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Welcome to HotelBite Backend!');
});

app.use('/api/auth',authRoute);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});

export default app;