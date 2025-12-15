import { NextRequest, NextResponse } from 'next/server';
import { otpStore } from '@/lib/otpStore';

const MAX_ATTEMPTS = 5;
const OTP_EXPIRY = 5 * 60 * 1000; // 5 minutes

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    // Validate inputs
    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Check if OTP exists for this email
    const storedRecord = otpStore.getOTP(email);
    if (!storedRecord) {
      return NextResponse.json(
        { success: false, error: 'No OTP found for this email. Please request a new OTP.' },
        { status: 400 }
      );
    }

    // Check if OTP has expired
    if (Date.now() - storedRecord.timestamp > OTP_EXPIRY) {
      otpStore.deleteOTP(email);
      return NextResponse.json(
        { success: false, error: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Check if max attempts exceeded
    if (storedRecord.attempts >= MAX_ATTEMPTS) {
      otpStore.deleteOTP(email);
      return NextResponse.json(
        { success: false, error: 'Too many failed attempts. Please request a new OTP.' },
        { status: 429 }
      );
    }

    // Verify OTP
    if (otp === storedRecord.otp) {
      // OTP is correct - remove from store
      otpStore.deleteOTP(email);
      return NextResponse.json({
        success: true,
        message: 'OTP verified successfully',
      });
    } else {
      // Increment attempts
      otpStore.incrementAttempts(email);
      const updatedRecord = otpStore.getOTP(email);
      const remainingAttempts = updatedRecord ? MAX_ATTEMPTS - updatedRecord.attempts : 0;

      return NextResponse.json(
        {
          success: false,
          error: `Invalid OTP. ${remainingAttempts} attempts remaining.`,
          remainingAttempts,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { success: false, error: 'Verification failed' },
      { status: 500 }
    );
  }
}
