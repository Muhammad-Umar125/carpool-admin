// Email Service Utility for sending OTP
// Uses Resend email service for actual email delivery

interface SendOTPParams {
  email: string;
  userName?: string;
}

/**
 * Send OTP via Resend Email Service
 * This calls the backend API which handles OTP generation and sending
 */
export async function sendOTPEmail({ email, userName }: SendOTPParams): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const response = await fetch('/api/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, userName }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('OTP send error:', data.error);
      return {
        success: false,
        error: data.error || 'Failed to send OTP',
      };
    }
    console.log('OTP sent successfully to:', email);
    return {
      success: true,
      message: data.message || 'OTP sent to your email',
    };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return {
      success: false,
      error: 'Failed to send OTP. Please try again.',
    };
  }
}

/**
 * Verify OTP via Backend API
 */
export async function verifyOTP(email: string, otp: string): Promise<{
  success: boolean;
  message?: string;
  error?: string;
  remainingAttempts?: number;
}> {
  try {
    const response = await fetch('/api/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('OTP verification error:', data.error);
      return {
        success: false,
        error: data.error || 'Invalid OTP',
        remainingAttempts: data.remainingAttempts,
      };
    }

    console.log('OTP verified successfully');
    return {
      success: true,
      message: data.message || 'OTP verified',
    };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return {
      success: false,
      error: 'Verification failed. Please try again.',
    };
  }
}


