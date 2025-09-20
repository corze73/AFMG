const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': 'https://afmg.co.uk',
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

  try {
    const { name, email, position, currentClub, message } = JSON.parse(event.body);

    // Validate required fields
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Name, email, and message are required'
        })
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Invalid email format'
        })
      };
    }

    // Create transporter with Ionos-specific settings
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.ionos.co.uk',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465', // true for SSL (465), false for STARTTLS (587)
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // Ionos STARTTLS settings for port 587
      requireTLS: process.env.SMTP_PORT !== '465', // Force STARTTLS for port 587
      tls: {
        rejectUnauthorized: false, // Allow self-signed certificates
        minVersion: 'TLSv1.2'
      },
      // Debug logging
      debug: true,
      logger: true
    });

    // Email content
    const emailContent = `
New Contact Form Submission from AFMG Website

Contact Details:
- Name: ${name}
- Email: ${email}
- Position: ${position || 'Not specified'}
- Current Club: ${currentClub || 'Not specified'}

Message:
${message}

---
This email was sent from the AFMG contact form at https://afmg.co.uk
Reply directly to this email to respond to ${name} at ${email}
    `.trim();

    // Send email
    await transporter.sendMail({
      from: `"AFMG Contact Form" <${process.env.SMTP_USER}>`,
      to: 'info@aspirefootballgroup.co.uk',
      replyTo: email,
      subject: `New Contact: ${name} - ${position || 'General Inquiry'}`,
      text: emailContent,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Email sent successfully'
      })
    };

  } catch (error) {
    console.error('Email send error:', error);
    console.error('Error details:', {
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode
    });
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Failed to send email. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    };
  }
};