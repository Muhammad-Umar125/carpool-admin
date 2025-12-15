import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { otpStore } from '@/lib/otpStore';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email, userName } = await request.json();

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid email' },
        { status: 400 }
      );
    }

    // Check rate limiting - max 3 requests per hour
    if (otpStore.hasEmail(email)) {
      const existingRecord = otpStore.getOTP(email);
      if (existingRecord) {
        const timeSinceLastRequest = Date.now() - existingRecord.timestamp;
        if (timeSinceLastRequest < 60000) { // 1 minute cooldown
          return NextResponse.json(
            { success: false, error: 'Please wait before requesting a new OTP' },
            { status: 429 }
          );
        }
      }
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`Generated OTP for ${email}: ${otp}`);

    // Store OTP with timestamp (expires in 5 minutes)
    otpStore.setOTP(email, otp);

    // Prepare email content
    const emailContent = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
      .header h1 { margin: 0; font-size: 28px; }
      .header p { margin: 10px 0 0 0; opacity: 0.9; }
      .content { background-color: #f9fafb; padding: 40px 30px; }
      .otp-code { 
        font-size: 48px; 
        font-weight: bold; 
        letter-spacing: 12px; 
        text-align: center; 
        color: #667eea;
        background-color: white;
        padding: 30px;
        border-radius: 8px;
        margin: 30px 0;
        border: 2px solid #667eea;
        font-family: 'Courier New', monospace;
      }
      .info { background-color: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; }
      .info p { margin: 5px 0; }
      .warning { background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; margin: 20px 0; }
      .warning strong { color: #dc2626; }
      .warning ul { margin: 10px 0; padding-left: 20px; }
      .warning li { margin: 8px 0; }
      .footer { background-color: #f3f4f6; padding: 30px; text-align: center; color: #666; font-size: 12px; border-radius: 0 0 8px 8px; }
      .footer p { margin: 5px 0; }
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
        
        <div class="info">
          <p><strong>⏱️ Valid for:</strong> 5 minutes</p>
          <p><strong>📧 Requested for:</strong> ${email}</p>
        </div>
        
        <div class="warning">
          <strong>🔒 Security Notice:</strong>
          <ul>
            <li>Never share this code with anyone</li>
            <li>Our team will never ask for your OTP</li>
            <li>This is a one-time use code</li>
            <li>If you didn't request this code, please contact support immediately</li>
          </ul>
        </div>

        <p style="color: #666; font-size: 14px;">
          If you have any questions or need assistance, please contact our support team.
        </p>
      </div>
      <div class="footer">
        <p><strong>Carpool Admin Portal</strong></p>
        <p>© ${new Date().getFullYear()} Carpool. All rights reserved.</p>
        <p>This is an automated message. Please do not reply to this email.</p>
      </div>
    </div>
  </body>
</html>
`;

    // Send OTP via Resend
    const data = await resend.emails.send({
      from: 'Carpool Admin <onboarding@resend.dev>',
      to: email,
      subject: 'Your Admin Portal OTP Code - ' + otp,
      html: emailContent,
    });

    if (data.error) {
      console.error('Resend error:', data.error);
      return NextResponse.json(
        { success: false, error: 'Failed to send OTP email' },
        { status: 500 }
      );
    }
    console.log('OTP sent successfully to:', email);
    console.log('OTP value:', otp);

    return NextResponse.json({
      success: true,
      message: 'OTP sent to your email',
      email: email,
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}
