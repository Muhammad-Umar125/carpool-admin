# Two-Factor Authentication (2FA) Implementation

## Overview
This project now includes Two-Factor Authentication (2FA) for enhanced security. After entering valid email and password credentials, users must verify their identity with a 6-digit OTP sent to their email.

## Features

### ✅ Implemented Features
1. **Email & Password Validation** - First step of authentication
2. **OTP Generation** - Automatic 6-digit code generation
3. **OTP Verification Modal** - Clean, user-friendly interface
4. **Resend OTP** - With 60-second cooldown
5. **Auto-focus** - Automatically moves to next input field
6. **Paste Support** - Copy-paste 6-digit OTP codes
7. **Error Handling** - Clear error messages for invalid OTP
8. **Session Security** - OTP cleared after successful verification
9. **Cancel Option** - Users can cancel and return to login

## How It Works

### Login Flow
1. User enters email and password
2. System validates credentials
3. If valid, OTP modal appears
4. 6-digit OTP is generated and "sent" to email (console in demo)
5. User enters OTP
6. System verifies OTP
7. If correct → Redirect to dashboard
8. If incorrect → Error message, allow retry

### File Structure
```
src/
├── app/
│   └── components/
│       ├── LoginForm.tsx          # Main login component with 2FA integration
│       └── OTPVerification.tsx    # OTP verification modal
└── utils/
    └── emailService.ts             # Email service utilities
```

## Components

### LoginForm.tsx
- Handles email/password authentication
- Manages OTP modal visibility
- Integrates with OTPVerification component

### OTPVerification.tsx
- Displays OTP input modal
- Handles OTP validation
- Manages resend OTP functionality
- Shows success/error messages

### emailService.ts
- Utility functions for email integration
- OTP generation
- Email templates
- Ready for production email services

## Demo Usage

### For Testing (Development Mode)
1. Fill in demo credentials using the helper buttons
2. Click "Sign In"
3. OTP modal will appear
4. **Check browser console** for the generated OTP
5. Enter the 6-digit OTP
6. Click "Verify OTP"

### Demo Accounts
- **Super Admin**: umerq0875@gmail.com / admin123
- **Feedback Manager**: feedback@carpool.com / admin123
- **Driver Authenticator**: driverauth@carpool.com / admin123
- **Support Agent**: support@carpool.com / admin123

## Production Integration

### Email Service Setup
To integrate with a real email service, update `src/utils/emailService.ts`:

#### Option 1: Using SendGrid
```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendOTPEmail({ email, otp, userName }: SendOTPParams) {
  const msg = {
    to: email,
    from: 'noreply@yourcarpool.com',
    subject: 'Your Admin Portal OTP Code',
    html: getOTPEmailTemplate(otp, userName),
  };
  
  await sgMail.send(msg);
  return true;
}
```

#### Option 2: Using AWS SES
```typescript
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const sesClient = new SESClient({ region: 'us-east-1' });

export async function sendOTPEmail({ email, otp, userName }: SendOTPParams) {
  const params = {
    Source: 'noreply@yourcarpool.com',
    Destination: { ToAddresses: [email] },
    Message: {
      Subject: { Data: 'Your Admin Portal OTP Code' },
      Body: { Html: { Data: getOTPEmailTemplate(otp, userName) } }
    }
  };
  
  await sesClient.send(new SendEmailCommand(params));
  return true;
}
```

#### Option 3: Using Resend
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOTPEmail({ email, otp, userName }: SendOTPParams) {
  await resend.emails.send({
    from: 'noreply@yourcarpool.com',
    to: email,
    subject: 'Your Admin Portal OTP Code',
    html: getOTPEmailTemplate(otp, userName),
  });
  return true;
}
```

### Backend API Endpoint
Create an API endpoint to handle OTP sending:

```typescript
// src/app/api/send-otp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sendOTPEmail, generateOTP } from '@/utils/emailService';

export async function POST(request: NextRequest) {
  try {
    const { email, userName } = await request.json();
    
    // Generate OTP
    const otp = generateOTP();
    
    // Store OTP in database or cache (Redis) with expiration
    // await storeOTP(email, otp, 300); // 5 minutes
    
    // Send email
    await sendOTPEmail({ email, otp, userName });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}
```

### Security Best Practices

1. **Store OTP Securely**
   - Use Redis or database with expiration
   - Hash OTP before storing
   - Set expiration (5 minutes recommended)

2. **Rate Limiting**
   - Limit OTP requests per email (e.g., 3 per hour)
   - Add cooldown between resend attempts

3. **Attempt Limiting**
   - Lock account after 5 failed OTP attempts
   - Require new login after too many failures

4. **Environment Variables**
   ```env
   SENDGRID_API_KEY=your_api_key
   # or
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   # or
   RESEND_API_KEY=your_api_key
   ```

## Customization

### Change OTP Length
In `OTPVerification.tsx`, modify the array size:
```typescript
const [otp, setOtp] = useState(['', '', '', '']); // 4-digit OTP
```

### Change Cooldown Duration
In `OTPVerification.tsx`:
```typescript
setResendCooldown(120); // 2 minutes
```

### Customize Email Template
Edit `getOTPEmailTemplate()` in `src/utils/emailService.ts`

## Troubleshooting

### OTP Not Showing in Console
- Check browser console (F12)
- Look for the separator lines with OTP

### Modal Not Appearing
- Ensure credentials are correct
- Check browser console for errors

### OTP Verification Failing
- Ensure you're entering the exact 6-digit code
- Check if OTP hasn't expired
- Verify sessionStorage is enabled

## Future Enhancements

- [ ] SMS-based OTP as alternative
- [ ] Authenticator app support (TOTP)
- [ ] Remember device option
- [ ] Backup codes
- [ ] OTP expiration timer in UI
- [ ] Email verification before enabling 2FA

## Support

For issues or questions about 2FA implementation, please contact the development team.
