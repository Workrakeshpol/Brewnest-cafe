import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import rateLimit from 'express-rate-limit';


import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { NotFoundError } from './utils/errors.js';
import apiRouter from './routes/index.js';
import { closeDatabase, prisma } from './config/database.js';
import { redis } from './config/redis.js';

const app = express();

// 1. Security Headers
app.use(helmet());

// 2. CORS configuration
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  })
);

// 3. Request Logging (using Morgan + structured logger)
const morganFormat = env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  })
);

// 4. Request Body Parsers & Cookie Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// CSRF protection – double submit cookie pattern


// 5. Response Compression
app.use(compression());

// 6. Rate Limiting (prevent brute force / DDoS)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: env.NODE_ENV === 'production' ? 100 : 1000, // limit each IP to requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    error: {
      message: 'Too many requests from this IP, please try again after 15 minutes',
      code: 'TOO_MANY_REQUESTS',
    },
  },
});
app.use('/api/', limiter);

// 6.5 Health Check Route (Diagnostics)
app.get('/healthz', async (_req, res) => {
  let dbHealthy = false;
  let redisHealthy = false;

  try {
    await prisma.$queryRaw`SELECT 1`;
    dbHealthy = true;
  } catch (err) {
    logger.error('Health Check - Database connection failed:', err);
  }

  try {
    if (redis) {
      const ping = await redis.ping();
      if (ping === 'PONG') {
        redisHealthy = true;
      }
    }
  } catch (err) {
    logger.error('Health Check - Redis connection failed:', err);
  }

  const isHealthy = dbHealthy && redisHealthy;
  res.status(isHealthy ? 200 : 500).json({
    status: isHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date(),
    services: {
      database: dbHealthy ? 'up' : 'down',
      cache: redisHealthy ? 'up' : 'down',
    },
  });
});

// 7. Base API Route
app.use('/api/v1', apiRouter);

// 8. 404 handler for unmatched routes
app.use((req, _res, next) => {
  next(new NotFoundError(`Cannot ${req.method} ${req.originalUrl}`));
});

// 9. Global Error Handler Middleware
app.use(errorHandler);

// 10. Start Server
const server = app.listen(env.PORT, env.HOST, () => {
  logger.info(`🚀 BrewNest Café server running at http://${env.HOST}:${env.PORT}`);
  logger.info(`Environment: ${env.NODE_ENV}`);
});

// 11. Graceful Shutdown
function handleShutdown(signal: string) {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  
  server.close(async () => {
    logger.info('HTTP server closed.');
    try {
      if (redis) {
        logger.info('Closing Redis client...');
        await redis.quit();
        logger.info('Redis client closed.');
      }
      await closeDatabase();
      logger.info('Graceful shutdown completed successfully.');
      process.exit(0);
    } catch (err) {
      logger.error('Error during database pool close:', err);
      process.exit(1);
    }
  });

  // Force shutdown if connections don't close in 10s
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down.');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

export default app;
