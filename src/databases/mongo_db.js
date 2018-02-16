import dotenv from 'dotenv';
import mongoose from 'mongoose';

const config = dotenv.config();

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.

export const MEADOWS_COLLECTION = "meadows";

mongoose.connection.on("open", function(ref) {
  console.log("Connected to mongo server.");
});

mongoose.connection.on("error", function(err) {
  console.log("Could not connect to mongo server!");
});

mongoose.connect(process.env.MONGODB_URI || `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ds149122.mlab.com:49122/cryptic-meadow-db`);
export const db = mongoose.connection;