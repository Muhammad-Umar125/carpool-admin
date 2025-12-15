'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import OTPVerification from './OTPVerification';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [verifiedUser, setVerifiedUser] = useState<any>(null);
  const router = useRouter();

  // Demo users with different roles for testing
  const demoUsers = [
    { email: 'umerq0875@gmail.com', password: 'admin123', role: 'super_admin', name: 'Super Admin' },
    { email: 'feedback@carpool.com', password: 'admin123', role: 'feedback_manager', name: 'Feedback Manager' },
    { email: 'driverauth@carpool.com', password: 'admin123', role: 'driver_authenticator', name: 'Driver Authenticator' },
    { email: 'support@carpool.com', password: 'admin123', role: 'support_agent', name: 'Support Agent' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check against demo users
      const user = demoUsers.find(u => u.email === email && u.password === password);
      
      if (user) {
        // Store user info temporarily for OTP verification
        setVerifiedUser(user);
        // Show OTP verification modal
        setShowOTP(true);
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerifySuccess = () => {
    if (verifiedUser) {
      // Store user info in localStorage after successful OTP verification
      localStorage.setItem('adminUser', JSON.stringify({
        email: verifiedUser.email,
        role: verifiedUser.role,
        name: verifiedUser.name,
        loginTime: new Date().toISOString()
      }));
      
      router.push('/dashboard');
    }
  };

  const handleOTPCancel = () => {
    setShowOTP(false);
    setVerifiedUser(null);
    setPassword('');
  };

  // Demo credentials helper (remove in production)
  const fillDemoCredentials = (role: string) => {
    const user = demoUsers.find(u => u.role === role);
    if (user) {
      setEmail(user.email);
      setPassword(user.password);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-96 border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Portal Login</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="admin@carpool.com"
            required
            disabled={loading}
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Enter your password"
            required
            disabled={loading}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      {/* Demo credentials helper - Remove this in production */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 mb-2 text-center">Demo Credentials (for testing):</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => fillDemoCredentials('super_admin')}
            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-2 rounded transition-colors"
          >
            Super Admin
          </button>
          <button
            type="button"
            onClick={() => fillDemoCredentials('feedback_manager')}
            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-2 rounded transition-colors"
          >
            Feedback Manager
          </button>
          <button
            type="button"
            onClick={() => fillDemoCredentials('driver_authenticator')}
            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-2 rounded transition-colors"
          >
            Driver Auth
          </button>
          <button
            type="button"
            onClick={() => fillDemoCredentials('support_agent')}
            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-2 rounded transition-colors"
          >
            Support Agent
          </button>
        </div>
      </div>

      {/* Security notice */}
      <div className="mt-4 text-xs text-gray-400 text-center">
        🔒 Secure admin portal for authorized personnel only
      </div>

      {/* OTP Verification Modal */}
      {showOTP && (
        <OTPVerification
          email={email}
          onVerifySuccess={handleOTPVerifySuccess}
          onCancel={handleOTPCancel}
        />
      )}
    </div>
  );
}