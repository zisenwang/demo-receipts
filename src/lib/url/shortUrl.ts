import { randomBytes } from 'crypto';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

// File-based storage for persistence across serverless requests
const STORAGE_FILE = join(process.cwd(), 'url-mappings.json');

function loadMappings(): Map<string, string> {
  if (existsSync(STORAGE_FILE)) {
    try {
      const data = readFileSync(STORAGE_FILE, 'utf-8');
      const obj = JSON.parse(data);
      return new Map(Object.entries(obj));
    } catch (error) {
      console.error('Error loading mappings:', error);
    }
  }
  return new Map();
}

function saveMappings(mappings: Map<string, string>): void {
  try {
    const obj = Object.fromEntries(mappings);
    writeFileSync(STORAGE_FILE, JSON.stringify(obj, null, 2));
  } catch (error) {
    console.error('Error saving mappings:', error);
  }
}

export function generateShortId(): string {
  const mappings = loadMappings();
  let shortId: string;
  let attempts = 0;
  const maxAttempts = 100; // Prevent infinite loops
  
  do {
    // Generate 6-character random string
    shortId = randomBytes(3).toString('hex');
    attempts++;
    
    if (attempts >= maxAttempts) {
      // If too many collisions, increase length
      shortId = randomBytes(4).toString('hex'); // 8 characters
      break;
    }
  } while (mappings.has(shortId));
  
  return shortId;
}

export function storeShortUrl(shortId: string, token: string): void {
  const mappings = loadMappings();
  mappings.set(shortId, token);
  saveMappings(mappings);
  console.log('Stored mapping:', shortId, '→', token.substring(0, 20) + '...');
}

export function getTokenFromShortId(shortId: string): string | null {
  const mappings = loadMappings();
  const token = mappings.get(shortId) || null;
  console.log('Retrieved mapping:', shortId, '→', token ? token.substring(0, 20) + '...' : 'null');
  return token;
}

// Clean up expired entries (optional)
export function cleanupExpiredUrls(): void {
  // Could implement JWT expiry check here
  // For now, we'll let JWT verification handle expiry
}