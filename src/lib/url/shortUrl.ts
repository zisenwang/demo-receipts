import { randomBytes } from 'crypto';
import { Redis } from '@upstash/redis';

// Redis client for URL mappings
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!
});

export function generateShortId(): string {
  // Generate 8-character random string (nice and short!)
  return randomBytes(4).toString('hex');
}

export async function storeShortUrl(shortId: string, token: string): Promise<void> {
  try {
    // Store with 24 hour expiry
    await redis.set(shortId, token, { ex: 86400 });
    console.log('Stored mapping in Redis:', shortId, '→', token.substring(0, 20) + '...');
  } catch (error) {
    console.error('Error storing to Redis:', error);
    throw error;
  }
}

export async function getTokenFromShortId(shortId: string): Promise<string | null> {
  try {
    const token = await redis.get(shortId) as string | null;
    console.log('Retrieved mapping from Redis:', shortId, '→', token ? token.substring(0, 20) + '...' : 'null');
    return token;
  } catch (error) {
    console.error('Error retrieving from Redis:', error);
    return null;
  }
}

// Clean up expired entries (optional)
export function cleanupExpiredUrls(): void {
  // Could implement JWT expiry check here
  // For now, we'll let JWT verification handle expiry
}