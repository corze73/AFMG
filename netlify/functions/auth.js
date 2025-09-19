import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from './database.js';

export const handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': 'https://afmg.co.uk',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, GET, PUT, OPTIONS',
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
    const path = event.path.replace('/.netlify/functions/auth', '');
    const method = event.httpMethod;

    // POST /login
    if (method === 'POST' && path === '/login') {
      const { email, password } = JSON.parse(event.body);

      if (!email || !password) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Email and password are required'
          })
        };
      }

      // Find user
      const userResult = await query(
        'SELECT id, email, password_hash, full_name, role FROM profiles WHERE email = $1',
        [email]
      );

      if (userResult.rows.length === 0) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Invalid email or password'
          })
        };
      }

      const user = userResult.rows[0];

      // Check password
      const passwordMatch = await bcrypt.compare(password, user.password_hash);
      if (!passwordMatch) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Invalid email or password'
          })
        };
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: {
            token,
            user: {
              id: user.id,
              email: user.email,
              name: user.full_name,
              role: user.role
            }
          }
        })
      };
    }

    // GET /me
    if (method === 'GET' && path === '/me') {
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

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userResult = await query(
          'SELECT id, email, full_name, role, profile_image_url FROM profiles WHERE id = $1',
          [decoded.userId]
        );

        if (userResult.rows.length === 0) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({
              success: false,
              message: 'User not found'
            })
          };
        }

        const user = userResult.rows[0];
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            data: {
              id: user.id,
              email: user.email,
              name: user.full_name,
              role: user.role,
              profile_image_url: user.profile_image_url
            }
          })
        };
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
    console.error('Auth function error:', error);
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
