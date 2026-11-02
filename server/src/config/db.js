import mongoose from 'mongoose';
import { config } from './env.js';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    const conn = await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 5000
    });

    isConnected = true;
    console.log('SecureAuth Backend Started');
    console.log('API: Running');
    console.log('Database: Connected');
    console.log(`Environment: ${config.nodeEnv}`);
    return conn;
  } catch (error) {
    console.error(`Database Connection Failed: ${error.message}`);
    // If in test environment or explicitly enabled in dev without mongod installed, fallback to MongoMemoryServer
    if (process.env.NODE_ENV === 'test' || process.env.ENABLE_MEMORY_DB === 'true') {
      try {
        console.log('[SecureAuth DB] Initializing in-memory MongoDB fallback...');
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        const conn = await mongoose.connect(uri);
        isConnected = true;
        console.log('SecureAuth Backend Started');
        console.log('API: Running');
        console.log('Database: Connected (In-Memory Fallback)');
        console.log(`Environment: ${config.nodeEnv}`);
        return conn;
      } catch (memErr) {
        console.error('[Memory DB Error]', memErr.message);
      }
    }
    throw error;
  }
};

export const getDbStatus = () => {
  const state = mongoose.connection.readyState;
  switch (state) {
    case 1:
      return 'Connected';
    case 2:
      return 'Connecting';
    case 3:
      return 'Disconnecting';
    default:
      return 'Disconnected';
  }
};
