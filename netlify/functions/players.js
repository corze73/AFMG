import jwt from 'jsonwebtoken';
import { query } from './database.js';

export const handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': 'https://afmg.co.uk',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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

  try {
    const path = event.path.replace('/.netlify/functions/players', '');
    const method = event.httpMethod;

    // GET /players - Allow public access
    if (method === 'GET' && path === '') {
      const result = await query(`
        SELECT 
          id,
          name,
          position,
          preferred_foot,
          current_club,
          image_url,
          bio,
          created_at,
          updated_at
        FROM players 
        ORDER BY name ASC
      `);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: result.rows
        })
      };
    }

    // All other endpoints require authentication
    const authHeader = event.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Access token required'
        })
      };
    }

    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.userId;
    } catch (error) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Invalid or expired token'
        })
      };
    }

    // GET /players/:id
    if (method === 'GET' && path.match(/^\/[a-f0-9-]{36}$/i)) {
      const playerId = path.substring(1);
      const result = await query(`
        SELECT 
          id,
          name,
          position,
          preferred_foot,
          current_club,
          image_url,
          bio,
          created_at,
          updated_at
        FROM players 
        WHERE id = $1
      `, [playerId]);

      if (result.rows.length === 0) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Player not found'
          })
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: result.rows[0]
        })
      };
    }

    // POST /players
    if (method === 'POST' && path === '') {
      const {
        name,
        position,
        preferred_foot,
        current_club,
        image_url,
        bio
      } = JSON.parse(event.body);

      if (!name || !position) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Name and position are required'
          })
        };
      }

      const result = await query(`
        INSERT INTO players (
          name,
          position,
          preferred_foot,
          current_club,
          image_url,
          bio
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `, [
        name,
        position,
        preferred_foot,
        current_club,
        image_url,
        bio
      ]);

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          success: true,
          data: result.rows[0]
        })
      };
    }

    // PUT /players/:id
    if (method === 'PUT' && path.match(/^\/[a-f0-9-]{36}$/i)) {
      const playerId = path.substring(1);
      const {
        name,
        position,
        preferred_foot,
        current_club,
        image_url,
        bio
      } = JSON.parse(event.body);

      if (!name || !position) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Name and position are required'
          })
        };
      }

      const result = await query(`
        UPDATE players SET
          name = $1,
          position = $2,
          preferred_foot = $3,
          current_club = $4,
          image_url = $5,
          bio = $6,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $7
        RETURNING *
      `, [
        name,
        position,
        preferred_foot,
        current_club,
        image_url,
        bio,
        playerId
      ]);

      if (result.rows.length === 0) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Player not found'
          })
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: result.rows[0]
        })
      };
    }

    // DELETE /players/:id
    if (method === 'DELETE' && path.match(/^\/[a-f0-9-]{36}$/i)) {
      const playerId = path.substring(1);
      
      const result = await query('DELETE FROM players WHERE id = $1 RETURNING id', [playerId]);

      if (result.rows.length === 0) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Player not found'
          })
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Player deleted successfully'
        })
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Endpoint not found'
      })
    };

  } catch (error) {
    console.error('Players function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Internal server error'
      })
    };
  }
};
