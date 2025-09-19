import express from 'express';
import { query, testConnection } from '../config/database.js';

const router = express.Router();

// GET /api/health - Comprehensive health check
router.get('/', async (req, res) => {
  const healthCheck = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: false,
    auth: false,
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  };

  try {
    // Test database connection
    const dbConnected = await testConnection();
    healthCheck.database = dbConnected;

    // Test auth system (check if JWT secret is configured)
    healthCheck.auth = !!process.env.JWT_SECRET;

    // Check if all required environment variables are set
    const requiredEnvVars = [
      'DATABASE_URL',
      'JWT_SECRET',
      'CLOUDINARY_CLOUD_NAME',
      'CLOUDINARY_API_KEY',
      'CLOUDINARY_API_SECRET'
    ];

    const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingEnvVars.length > 0) {
      healthCheck.status = 'warning';
      healthCheck.missing_env_vars = missingEnvVars;
    }

    // If database connection failed, set status to error
    if (!healthCheck.database) {
      healthCheck.status = 'error';
    }

    // Get database stats
    if (healthCheck.database) {
      try {
        const playersCount = await query('SELECT COUNT(*) as count FROM players');
        const profilesCount = await query('SELECT COUNT(*) as count FROM profiles');
        
        healthCheck.database_stats = {
          players_count: parseInt(playersCount.rows[0].count),
          profiles_count: parseInt(profilesCount.rows[0].count)
        };
      } catch (error) {
        console.error('Error getting database stats:', error);
      }
    }

    const statusCode = healthCheck.status === 'error' ? 503 : 200;

    res.status(statusCode).json({
      success: healthCheck.status !== 'error',
      data: healthCheck
    });

  } catch (error) {
    console.error('Health check error:', error);
    
    res.status(503).json({
      success: false,
      data: {
        ...healthCheck,
        status: 'error',
        error: error.message
      }
    });
  }
});

// GET /api/health/database - Database-specific health check
router.get('/database', async (req, res) => {
  try {
    const isConnected = await testConnection();
    
    if (isConnected) {
      const result = await query('SELECT NOW() as current_time, version() as version');
      const dbInfo = result.rows[0];
      
      res.json({
        success: true,
        data: {
          connected: true,
          current_time: dbInfo.current_time,
          postgres_version: dbInfo.version.split(' ')[0] + ' ' + dbInfo.version.split(' ')[1],
          response_time: 'fast'
        }
      });
    } else {
      res.status(503).json({
        success: false,
        data: {
          connected: false,
          message: 'Database connection failed'
        }
      });
    }
  } catch (error) {
    console.error('Database health check error:', error);
    res.status(503).json({
      success: false,
      data: {
        connected: false,
        error: error.message
      }
    });
  }
});

// GET /api/health/cloudinary - Cloudinary configuration check
router.get('/cloudinary', (req, res) => {
  const hasCloudinaryConfig = !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );

  res.json({
    success: hasCloudinaryConfig,
    data: {
      configured: hasCloudinaryConfig,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'configured' : 'missing',
      api_key: process.env.CLOUDINARY_API_KEY ? 'configured' : 'missing',
      api_secret: process.env.CLOUDINARY_API_SECRET ? 'configured' : 'missing'
    }
  });
});

export default router;