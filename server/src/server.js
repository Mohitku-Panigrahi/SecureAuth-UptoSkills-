import app from './app.js';
import { config, validateEnv } from './config/env.js';
import { connectDB } from './config/db.js';

const startServer = async () => {
  try {
    const { warnings } = validateEnv();
    if (warnings.length > 0) {
      warnings.forEach((w) => console.warn(`[Config Notice] ${w}`));
    }

    // Connect to database
    await connectDB();

    // Start listening
    const server = app.listen(config.port, () => {
      console.log(`SecureAuth Server listening on port ${config.port} (${config.clientUrl})`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      console.log('\nShutting down SecureAuth Server...');
      server.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
