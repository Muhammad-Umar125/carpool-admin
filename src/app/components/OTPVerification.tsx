'use client';

import { useState, useEffect } from 'react';
import { sendOTPEmail, verifyOTP } from '@/utils/emailService';

interface OTPVerificationProps {
  email: string;
  onVerifySuccess: () => void;
  onCancel: () => void;
}

export default function OTPVerification({ email, onVerifySuccess, onCancel }: OTPVerificationProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSending, setIsSending] = useState(true);
  const [remainingAttempts, setRemainingAttempts] = useState(5);

  // Auto-send OTP when component mounts
  useEffect(() => {
    const sendInitialOTP = async () => {
      setIsSending(true);
      const result = await sendOTPEmail({ email });
      
      if (result.success) {
        setSuccessMessage('OTP sent to your email!');
        setResendCooldown(60);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(result.error || 'Failed to send OTP');
      }
      setIsSending(false);
    };

    sendInitialOTP();
  }, [email]);

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);
  };

  const handleVerify = async () => {
    const enteredOTP = otp.join('');
    
    if (enteredOTP.length !== 6) {
      setError('Please enter complete 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Verify OTP with backend
      const result = await verifyOTP(email, enteredOTP);

      if (result.success) {
        onVerifySuccess();
      } else {
        setError(result.error || 'Invalid OTP. Please try again.');
        setRemainingAttempts(result.remainingAttempts || 5);
        setOtp(['', '', '', '', '', '']);
        document.getElementById('otp-0')?.focus();
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;
    
    setOtp(['', '', '', '', '', '']);
    setError('');
    setIsSending(true);

    const result = await sendOTPEmail({ email });
    
    if (result.success) {
      setSuccessMessage('New OTP sent to your email!');
      setResendCooldown(60);
      setRemainingAttempts(5); // Reset attempts
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setError(result.error || 'Failed to resend OTP');
    }
    setIsSending(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96 border border-gray-200">
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">Two-Factor Authentication</h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          We've sent a verification code to<br />
          <span className="font-semibold text-gray-800">{email}</span>
        </p>

        {isSending && (
          <div className="bg-blue-50 border border-blue-200 text-blue-600 px-4 py-2 rounded-md text-sm mb-4 text-center">
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending OTP...
            </span>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-2 rounded-md text-sm mb-4 text-center">
            {successMessage}
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
            Enter 6-digit OTP
          </label>
          <div className="flex justify-center gap-2" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-gray-800"
                disabled={loading || isSending}
              />
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm mb-4">
            {error}
          </div>
        )}

        <button
          onClick={handleVerify}
          disabled={loading || otp.join('').length !== 6 || isSending}
          className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium mb-3"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Verifying...
            </span>
          ) : (
            'Verify OTP'
          )}
        </button>

        <div className="flex justify-between items-center mb-4 text-xs">
          <span className="text-gray-500">
            Attempts remaining: <span className="font-semibold">{remainingAttempts}</span>
          </span>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={handleResendOTP}
            disabled={resendCooldown > 0 || isSending}
            className="text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
          </button>
          
          <button
            onClick={onCancel}
            disabled={loading || isSending}
            className="text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Cancel
          </button>
        </div>

        <div className="text-xs text-gray-400 text-center mt-4">
          🔒 Check your email for the verification code
        </div>
      </div>
    </div>
  );
}
