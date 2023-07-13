require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Seat = require('./models/Seat');
const { connectDB } = require('./database');


const port = process.env.PORT || 8080;
const app = express();
app.use(express.json());
app.use(cors());


app.get('/seats', async (req, res) => {
  try {
    const seats = await Seat.find();
    res.json({ seats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/reserve', async (req, res) => {
  let { numSeats } = req.body;
  numSeats = +numSeats;

  if (numSeats > 7 || numSeats <= 0) {
    return res.status(400).json({ message: 'Invalid number of seats' });
  }

  const seats = await Seat.find({ isBooked: false }).sort('number');
  const seatCount = seats.length;

  let startIndex = -1;


  for (let i = 0; i <= seatCount - numSeats; i++) {
    const startRow = Math.floor((seats[i].number - 1) / 7) + 1;
    const endRow = Math.floor((seats[i + numSeats - 1].number - 1) / 7) + 1;

    if (endRow - startRow > 0) {
      continue;
    }

    let isBookable = true;
    for (let j = 0; j < numSeats; j++) {
      if (seats[i + j].isBooked) {
        isBookable = false;
        break;
      }
    }

    if (isBookable) {
      startIndex = i;
      break;
    }
  }

  if (startIndex === -1) {

    let minDifference = 80;
    let bestStartIndex = -1;

    for (let start = 0, end = numSeats - 1; end < seatCount; start++, end++) {
      const startSeatNumber = seats[start].number;
      const endSeatNumber = seats[end].number;
      const difference = endSeatNumber - startSeatNumber;


      if (difference < minDifference) {
        minDifference = difference;
        bestStartIndex = start;
      }
    }
    
    if (bestStartIndex !== -1) {
      startIndex = bestStartIndex;
    }
  }

  if (startIndex === -1) {
    return res.status(404).json({ message: 'No available seats' });
  }

  const seatNumbers = seats
    .slice(startIndex, startIndex + numSeats)
    .map((seat) => seat.number);

  await Seat.updateMany(
    { number: { $in: seatNumbers } },
    { isBooked: true }
  );

  res.json({ message: 'Seats reserved successfully', seatNumbers });
});

app.post('/reset', async (req, res) => {
  try {
    await Seat.updateMany({}, { isBooked: false });
    res.json({ message: 'Seats reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reset seats' });
  }
});

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  })
}).catch((err) => {
  console.log(err);
});
