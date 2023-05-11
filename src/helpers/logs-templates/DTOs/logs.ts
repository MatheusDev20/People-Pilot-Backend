export interface UnauthLoginLog {
  time: Date;
  ipAddress: string;
  userAgent: string;
  username?: string;
  reason: string;
}
