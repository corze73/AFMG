import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': 'https://afmg.co.uk',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Method not allowed'
      })
    };
  }

  // Verify JWT token
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
    jwt.verify(token, process.env.JWT_SECRET);
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

  try {
    const { file, type = 'player' } = JSON.parse(event.body);

    if (!file) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'File data is required'
        })
      };
    }

    // Validate file type
    if (!file.startsWith('data:image/')) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Invalid file type. Only images are allowed.'
        })
      };
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file, {
      folder: `afmg/${type}s`,
      resource_type: 'image',
      transformation: [
        { width: 400, height: 400, crop: 'fill', quality: 'auto' }
      ]
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: {
          url: result.secure_url,
          public_id: result.public_id
        }
      })
    };

  } catch (error) {
    console.error('Upload function error:', error);

    // Handle Cloudinary specific errors
    if (error.error && error.error.message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: error.error.message
        })
      };
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Upload failed'
      })
    };
  }
};