import express from 'express';
import {connectDB} from './lib/db.js';
import authRoute from './routes/authRoute.js';
import hotelRoute from './routes/hotelRoute.js';
import restaurantRoute from './routes/restaurantRoute.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Welcome to HotelBite Backend!');
});

app.use('/api/auth',authRoute);
app.use('/api/hotel',hotelRoute);
app.use('/api/restaurant',restaurantRoute);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});

export default app;