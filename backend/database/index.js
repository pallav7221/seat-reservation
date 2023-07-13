const mongoose = require('mongoose');
const Seat = require('../models/Seat');

require('dotenv').config()

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        Seat.countDocuments({})
        .then((count) => {
          if (count === 0) {
            const seats = Array(80).fill().map((_, index) => ({
              number: index + 1,
            }));
            return Seat.insertMany(seats);
          }
          return Promise.resolve();
        })
        .then(() => {
          console.log('Initial seat data created');
        })
        .catch((error) => {
          console.error('Error creating initial seat data:', error);
        });
        console.log('MongoDB Connected...');
    } catch (error) {
        console.log("Not connected....", error.message);
    }
}

module.exports = { connectDB };