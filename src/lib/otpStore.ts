// Global OTP Store - persists across requests
// In production, use Redis or a database instead

interface OTPRecord {
  otp: string;
  timestamp: number;
  attempts: number;
}

class OTPStore {
  private store: Map<string, OTPRecord> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Start cleanup interval on initialization
    this.startCleanup();
  }

  setOTP(email: string, otp: string): void {
    this.store.set(email, {
      otp,
      timestamp: Date.now(),
      attempts: 0,
    });
    console.log(`[OTPStore] OTP set for ${email}: ${otp}`);
  }

  getOTP(email: string): OTPRecord | null {
    const record = this.store.get(email);
    if (!record) {
      console.log(`[OTPStore] No OTP found for ${email}`);
      return null;
    }
    console.log(`[OTPStore] OTP found for ${email}`);
    return record;
  }

  deleteOTP(email: string): void {
    this.store.delete(email);
    console.log(`[OTPStore] OTP deleted for ${email}`);
  }

  incrementAttempts(email: string): void {
    const record = this.store.get(email);
    if (record) {
      record.attempts++;
      console.log(`[OTPStore] Attempts incremented for ${email}: ${record.attempts}`);
    }
  }

  hasEmail(email: string): boolean {
    return this.store.has(email);
  }

  printStore(): void {
    console.log('[OTPStore] Current store:', Array.from(this.store.entries()));
  }

  private startCleanup(): void {
    // Cleanup every minute
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      const OTP_EXPIRY = 5 * 60 * 1000; // 5 minutes

      let deletedCount = 0;
      for (const [email, record] of this.store.entries()) {
        if (now - record.timestamp > OTP_EXPIRY) {
          this.store.delete(email);
          deletedCount++;
        }
      }

      if (deletedCount > 0) {
        console.log(`[OTPStore] Cleaned up ${deletedCount} expired OTPs`);
      }
    }, 60000);
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}

// Global instance
export const otpStore = new OTPStore();
