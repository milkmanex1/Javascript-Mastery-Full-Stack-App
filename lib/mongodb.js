import mongoose from "mongoose";

/**
 * Global variable to cache the MongoDB connection
 * In development, this prevents multiple connections during hot reloads
 * In production, each Lambda/serverless function has its own connection
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connects to MongoDB using Mongoose
 * Uses cached connection to prevent multiple connections in development
 * Returns the mongoose instance for use in models
 * @returns {Promise<mongoose>} The mongoose connection instance
 */
async function connectDB() {
  // Return existing connection if already established
  if (cached.conn) {
    return cached.conn;
  }

  // Return existing promise if connection is in progress
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 5,
    };

    cached.promise = mongoose
      .connect(process.env.MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("✅ MongoDB connected successfully");
        return mongoose;
      })
      .catch((error) => {
        console.error("❌ MongoDB connection failed:", error.message);
        // Clear the promise on error so it can be retried
        cached.promise = null;
        throw error;
      });
  }

  try {
    // Await the promise and cache the connection
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
