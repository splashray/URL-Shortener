const mongoose = require("mongoose");

const inProduction = process.env.NODE_ENV === 'production';

const connectDB = async () => {
  mongoose.set({ strictQuery: true });
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MongoDB URI is missing. Set the MONGODB_URI environment variable.');
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      autoIndex: !inProduction
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;
