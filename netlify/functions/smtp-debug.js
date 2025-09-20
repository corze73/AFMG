// Try different import methods for nodemailer
let nodemailer;
try {
  nodemailer = require('nodemailer');
} catch (e1) {
  try {
    // Try destructuring
    const { createTransporter } = require('nodemailer');
    nodemailer = { createTransporter };
  } catch (e2) {
    try {
      // Try default import
      nodemailer = require('nodemailer').default;
    } catch (e3) {
      console.error('All nodemailer import methods failed:', { e1: e1.message, e2: e2.message, e3: e3.message });
    }
  }
}

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
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

  try {
    // Debug nodemailer import
    console.log('nodemailer object:', typeof nodemailer, Object.keys(nodemailer || {}));
    
    if (!nodemailer || !nodemailer.createTransport) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Nodemailer import failed',
          debug: {
            nodemailerType: typeof nodemailer,
            nodemailerKeys: Object.keys(nodemailer || {}),
            hasCreateTransport: !!(nodemailer && nodemailer.createTransport)
          }
        })
      };
    }

    // Check environment variables
    const envCheck = {
      SMTP_HOST: process.env.SMTP_HOST || 'NOT SET',
      SMTP_PORT: process.env.SMTP_PORT || 'NOT SET',
      SMTP_USER: process.env.SMTP_USER || 'NOT SET',
      SMTP_PASS: process.env.SMTP_PASS ? 'SET (hidden)' : 'NOT SET'
    };

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'SMTP configuration incomplete',
          envCheck
        })
      };
    }

    // Test transporter configuration
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      requireTLS: process.env.SMTP_PORT !== '465',
      tls: {
        rejectUnauthorized: false,
        minVersion: 'TLSv1.2'
      }
    });

    // Test connection first
    try {
      console.log('Testing SMTP connection...');
      await transporter.verify();
      console.log('SMTP connection successful');
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'SMTP connection test successful',
          config: {
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            user: process.env.SMTP_USER,
            secure: process.env.SMTP_PORT === '465'
          }
        })
      };
    } catch (verifyError) {
      console.error('SMTP verification failed:', verifyError);
      
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'SMTP connection failed',
          error: verifyError.message,
          code: verifyError.code,
          errno: verifyError.errno,
          command: verifyError.command,
          response: verifyError.response,
          config: {
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            user: process.env.SMTP_USER,
            secure: process.env.SMTP_PORT === '465'
          }
        })
      };
    }

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Function error',
        error: error.message
      })
    };
  }
};