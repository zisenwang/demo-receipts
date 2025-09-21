import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface TokenPayload {
  orderId: string;
  s3Key: string;
  timestamp: string;
  exp: number;
}

export function createReceiptToken(orderId: string, s3Key: string, timestamp: Date): string {
  const token = jwt.sign(
    {
      orderId,
      s3Key,
      timestamp: timestamp.toISOString(),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    },
    JWT_SECRET
  );
  return token;
}

export function verifyReceiptToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}