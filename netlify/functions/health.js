import { query } from './database.js';

export const handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': 'https://afmg.co.uk',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Credentials': 'true'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Method not allowed'
      })
    };
  }

  try {
    // Test database connection
    const result = await query('SELECT NOW() as current_time, version() as db_version');
    
    // Get table counts
    const playerCount = await query('SELECT COUNT(*) as count FROM players');
    const profileCount = await query('SELECT COUNT(*) as count FROM profiles');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          database: {
            connected: true,
            current_time: result.rows[0].current_time,
            version: result.rows[0].db_version,
            tables: {
              players: parseInt(playerCount.rows[0].count),
              profiles: parseInt(profileCount.rows[0].count)
            }
          },
          environment: {
            node_version: process.version,
            platform: process.platform
          }
        }
      })
    };

  } catch (error) {
    console.error('Health check error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        data: {
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          error: error.message,
          database: {
            connected: false
          }
        }
      })
    };
  }
};