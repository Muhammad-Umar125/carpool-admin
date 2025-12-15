// Email Service Utility for sending OTP
// This is a utility file that can be used to integrate with email services

/**
 * Send OTP via Email
 * In production, integrate with services like:
 * - SendGrid
 * - AWS SES
 * - Nodemailer
 * - Resend
 * - Mailgun
 */

interface SendOTPParams {
  email: string;
  otp: string;
  userName?: string;
}

export async function sendOTPEmail({ email, otp, userName }: SendOTPParams): Promise<boolean> {
  try {
    // For production, implement your email service here
    // Example with a backend API:
    /*
    const response = await fetch('/api/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp, userName }),
    });

    if (!response.ok) {
      throw new Error('Failed to send OTP');
    }

    return true;
    */

    // For demo purposes, we'll just log to console
    console.log('=================================');
    console.log('Email Service - OTP Details');
    console.log('=================================');
    console.log('To:', email);
    console.log('Subject: Your Admin Portal OTP Code');
    console.log('OTP:', otp);
    console.log('Valid for: 5 minutes');
    console.log('=================================');

    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return false;
  }
}

/**
 * Email Template for OTP
 */
export function getOTPEmailTemplate(otp: string, userName?: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9fafb; padding: 30px; }
        .otp-code { 
          font-size: 32px; 
          font-weight: bold; 
          letter-spacing: 8px; 
          text-align: center; 
          color: #2563eb;
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .warning { color: #dc2626; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Carpool Admin Portal</h1>
          <p>Two-Factor Authentication</p>
        </div>
        <div class="content">
          <p>Hello ${userName || 'Admin'},</p>
          <p>Your One-Time Password (OTP) for accessing the Carpool Admin Portal is:</p>
          
          <div class="otp-code">${otp}</div>
          
          <p>This code will expire in <strong>5 minutes</strong>.</p>
          
          <p class="warning">⚠️ Security Notice:</p>
          <ul>
            <li>Never share this code with anyone</li>
            <li>Our team will never ask for your OTP</li>
            <li>If you didn't request this code, please contact support immediately</li>
          </ul>
        </div>
        <div class="footer">
          <p>This is an automated message from Carpool Admin Portal</p>
          <p>© ${new Date().getFullYear()} Carpool. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate a secure 6-digit OTP
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Validate OTP format
 */
export function isValidOTPFormat(otp: string): boolean {
  return /^\d{6}$/.test(otp);
}
